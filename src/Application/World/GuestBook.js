import * as THREE from 'three';
import Application from '../Application';
import {Mesh} from 'three';
import {db} from '../Utills/Firebase';
import {  collection, query, orderBy, limit, getDocs, addDoc, startAfter, endBefore, limitToLast  } from "firebase/firestore";

export class GuestBook {
    constructor() {
        this.app = Application.getInstance();

        this.limit = 6;
        this.currentPage =  1;
        this.firstVisible = null;
        this.lastVisible = null;
        this.nextDisabled = true;
        this.prevDisabled = true;

        this.isShowModal = false;
        this.guestReviewList = [];
        this.canvasList = []; // 이 후 선택하여 painting을 위한 배열
        this.canvasTextureList = []; // needsUpdate를 위한 textTexture를 담은 배열
        this.reviewMeshList = []; // 렌더링 될 최대 6개의 mesh를 담은 배열

        this.reviewPositions = [
            [2.8955, 2.328, 2.045], [2.8955, 2.328, 2.347],
            [2.8955, 2.026, 2.045], [2.8955, 2.026, 2.347],
            [2.8955, 1.724, 2.045], [2.8955, 1.724, 2.347],
        ];

        this.guestBook = document.querySelector('#guestBook');
        this.guestBookName = document.querySelector('#guestBookName');
        this.guestBookMessage = document.querySelector('#guestBookMessage');

        // 방명록 메뉴 버튼 이벤트
        document.querySelector('#guestBookBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            const app = Application.getInstance();
            // 카메라 애니메이션중인 경우 캔슬
            if (app.gsap.isMovingCam) return;
            // 방명록 애니메이션 실행
            if (!this.isShowModal) {
                if (app.gsap.isInGuestBook) return this.controlReviewModal('on', 10);
                app.gsap.toGuestBook();
                app.gsap.isInGuestBook = true;
                this.isShowModal = true;
                // 카메라 애니메이션 끝난 후 방명록 작성 모달 띄움
                setTimeout(() => this.controlReviewModal('on'), 1000);
            }
        });
        // 리뷰모달 클릭 시 모달 취소 캔슬
        this.guestBook.addEventListener('click', e => e.stopPropagation());
        this.guestBook.addEventListener('submit', e => {
            e.preventDefault();
            // todo: 글쓰기 성공시 창내리고 리스트 업데이트 + 초기화면 돌리기  // 실패 시 실패 팝업 위에서 아래로
        });
        // 리뷰모달 취소
        window.addEventListener('click', (e) => {
            if (!this.isShowModal) return;
            this.controlReviewModal('off');
        });
        // 타이틀 Enter 시 포커스 내용으로
        this.guestBookName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.querySelector('#guestBookContent').focus();
                e.preventDefault();
            }
        });
        // 방명록 작성
        document.querySelector('#guestBookSubmit').addEventListener('click', () => {
            this.createGuestReview();
        });

        this.getFirestoreData();
    }

    setGuestReviews() {
        // 방명록 next 버튼
        const vertices = new Float32Array([
            -0.03, 0.05, 0,   // 꼭지점 1 (x, y, z)
            -0.03, -0.05, 0, // 꼭지점 2 (x, y, z)
            0.01, 0, 0   // 꼭지점 3 (x, y, z)
        ]);
        const rightArrowGeometry = new THREE.BufferGeometry();
        rightArrowGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const rightArrowMaterial = new THREE.MeshBasicMaterial({ color: '#eeeeee' })
        const rightArrowMesh = new THREE.Mesh(rightArrowGeometry, rightArrowMaterial);
        rightArrowMesh.position.set(2.8955, 2.026, 2.55);
        rightArrowMesh.rotation.y = THREE.MathUtils.degToRad(-90);
        rightArrowMesh.name = 'nextReview';
        // next 활성화 여부
        if (this.guestReviewList.length === 6) this.nextDisabled = false;

        // 방명록 prev 버튼
        const leftArrowMesh = rightArrowMesh.clone();
        leftArrowMesh.material.side = THREE.DoubleSide;
        leftArrowMesh.rotation.y = THREE.MathUtils.degToRad(90);
        leftArrowMesh.position.set(2.8955, 2.026, 1.837);
        leftArrowMesh.name = 'prevReview';

        // 버튼들 raycaster, scene추가
        this.app.intersectsMeshes.push(leftArrowMesh, rightArrowMesh);
        this.app.scene.add(rightArrowMesh, leftArrowMesh);

        // 방명록 raycaster 감지 영역 추가
        const areaGeometry = new THREE.PlaneGeometry(0.6,1,1,1);
        const areaMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        const areaMesh = new Mesh(areaGeometry, areaMaterial);
        areaMesh.position.set(2.8955, 2, 2.2);
        areaMesh.rotation.y = THREE.MathUtils.degToRad(-90);
        areaMesh.name = 'guestBook';
        this.app.intersectsMeshes.push(areaMesh);
        this.app.scene.add(areaMesh);

        // 방명록 첫 렌더링 기준으로 painting
        this.paintGuestReview(true);
    }
    // todo: fetch 매서드화 해서 정리
    createGuestReview() {
        const name = this.guestBookName.value;
        const message = this.guestBookMessage.value;
        // if (name.length < 2 && message.length < 2) alert('이름과 메시지는 2글자 이상으로 입력해주세요.');

        addDoc(collection(db, 'guestBook'), {
            createAt: new Date().toISOString(),
            name: name,
            message: message,
        })
            .then(res => {
                this.guestBookName.value = '';
                this.guestBookMessage.value = '';
                this.controlReviewModal('off');

                (async () => {
                    // 방명록 초기화
                    this.guestReviewList = [];
                    // 쿼리 작성
                    const q = query(
                        collection(db, 'guestBook'),
                        orderBy('createAt', 'desc'),
                        limit(this.limit),
                    );
                    // fetch firestore
                    const snapshot = await getDocs(q);
                    // get firstVisible
                    this.firstVisible = snapshot.docs[0].data().createAt;
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log('방명록 작성 후 데이터',data)
                        this.guestReviewList.push(data);
                        this.lastVisible = data.createAt;
                    });
                    // painting
                    this.paintGuestReview();
                })()
            })
            .catch(err => console.log(err));
    }

    /** isFirstLoad: 첫 데이터인 경우 true 삽입하여 초기세팅 */
    paintGuestReview(isFirstLoad) {
        let geometry;
        if (isFirstLoad) geometry = new THREE.PlaneGeometry(0.23, 0.23, 1, 1);

        for (let i = 0; i < 6; i ++) {
            // 데이터 첫 로드 시 기본 세팅
            if (isFirstLoad) {
                // create canvas
                const canvas = document.createElement('canvas');
                canvas.width = 500;
                canvas.height = 500;

                // create mesh  / 배경색 : '#FFFB6A'
                const texture = new THREE.CanvasTexture(canvas);
                const material = new THREE.MeshBasicMaterial({ map: texture });
                const reviewMesh = new THREE.Mesh(geometry, material);
                reviewMesh.rotation.y = THREE.MathUtils.degToRad(-90);
                reviewMesh.position.set(...this.reviewPositions[i]);

                // review mesh 기울기 랜덤 설정
                reviewMesh.rotation.x = THREE.MathUtils.degToRad(Math.random() * 7 - 3.5);

                // 이 후 선택하여 painting을 위한 배열
                this.canvasList.push(canvas);
                this.canvasTextureList.push(texture);
                // 데이터 개수에 따라 mesh를 보여주기 위한 배열
                this.reviewMeshList.push(reviewMesh);
            }

            // 리뷰가 존재한다면 리뷰 추가
            const review = this.guestReviewList[i];
            if (review) {
                // canvas painting
                const context = this.canvasList[i].getContext('2d');
                const title = this.guestReviewList[i].name;
                const date = new Date(this.guestReviewList[i].createAt);
                const createAt = date.getFullYear().toString() + '-' +
                    (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    date.getDate().toString().padStart(2, '0');
                // content 가공
                const contentTxt = this.guestReviewList[i].message.replace(/\n/g, '')
                const contentArr = [];
                for (let i = 0; i < contentTxt.length; i += 10) {
                    contentArr.push(contentTxt.slice(i, i + 10));
                }
                // fill background
                context.fillStyle = '#FFFB6A';
                context.fillRect(0,0,500,500);
                // font painting
                context.fillStyle = '#000';
                context.font = 'normal 50px Pretendard';
                context.fillText(title, 55, 100);
                context.font = 'normal 30px Pretendard';
                context.fillText(createAt, 55, 160);
                context.font = 'normal 40px Pretendard';
                contentArr.map((txt, idx) => {
                    const y = ( idx + 1 ) * 50 + 180; // default 230
                    context.fillText(txt, 55, y);
                });
                // 첫 로드가 아닌 경우 texture 업데이트 트리거
                if (!isFirstLoad) this.canvasTextureList[i].needsUpdate = true;

                this.app.scene.add(this.reviewMeshList[i]);
            } else { // 리뷰가 존재하지 않는다면 scene에서 제외
                this.app.scene.remove(this.reviewMeshList[i]);
            }
        }
    }

    controlReviewModal(type, timeout = 320) {
        if (type === 'on') {
            this.isShowModal = true;
            this.guestBook.style.display = 'flex';
            setTimeout(() => this.guestBook.style.opacity = 1,timeout);
        } else if (type === 'off') {
            this.isShowModal = false;
            this.guestBook.style.opacity = 0;
            setTimeout(() => {
                this.guestBook.style.display = 'none';
            },320);
        }
    }

    async nextReview() {
        if (this.nextDisabled) return;
        // 방명록 데이터 초기화
        this.guestReviewList = [];
        // db 쿼리 생성
        const q = query(
            collection(db, 'guestBook'),
            orderBy('createAt', 'desc'),
            startAfter(this.lastVisible),
            limit(this.limit),
        );
        // 데이터 요청
        const snapshot = await getDocs(q);
        // 다음 데이터가 없다면 next 비활성화
        if (snapshot.empty) return this.nextDisabled = true;
        // get firstVisible
        this.firstVisible = snapshot.docs[0].data().createAt;
        // 응답 데이터 추가
        snapshot.forEach((doc) => {
            const data = doc.data();
            this.guestReviewList.push(data);
            this.lastVisible = data.createAt;
        });
        // 첫 next 클릭 시 prev 활성화
        if (this.currentPage === 1) this.prevDisabled = false;
        // 페이지++
        this.currentPage++;
        // painting
        this.paintGuestReview();
    }
    async prevReview() {
        if (this.prevDisabled) return;
        // 방명록 데이터 초기화
        this.guestReviewList = [];
        // db 쿼리 생성
        const q = query(
            collection(db, 'guestBook'),
            orderBy('createAt', 'desc'),
            endBefore(this.firstVisible),
            limitToLast(this.limit),
        );
        // 데이터 요청
        const snapshot = await getDocs(q);
        console.log(snapshot.size)
        // get firstVisible
        this.firstVisible = snapshot.docs[0].data().createAt;
        // 응답 데이터 추가
        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log('prev가 가져온 데이터~',data);
            this.guestReviewList.push(data);
            this.lastVisible = data.createAt;
        });
        // 페이지--
        this.currentPage--;
        // // 1페이지라면 prev 비활성화
        // if (this.currentPage === 1) this.prevDisabled = true;
        // // 추가된 데이터가 있다면 최신화 데이터로 리로드
        // if (this.currentPage < 1) {
        //     // 페이지 1로 초기화
        //     this.currentPage = 1;
        //     // 방명록 초기화
        //     this.guestReviewList = [];
        //     // 쿼리 작성
        //     const q = query(
        //         collection(db, 'guestBook'),
        //         orderBy('createAt', 'desc'),
        //         limit(this.limit),
        //     );
        //     // fetch firestore
        //     const snapshot = await getDocs(q);
        //     snapshot.forEach((doc) => {
        //         const data = doc.data();
        //         console.log('방명록 작성 후 데이터',data)
        //         this.guestReviewList.push(data);
        //         this.lastVisible = data.createAt;
        //     });
        //     // painting
        //     this.paintGuestReview();
        // }
        // painting
        this.paintGuestReview();
    }
    async getFirestoreData() {
        // 쿼리 작성
        const q = query(
            collection(db, 'guestBook'),
            orderBy('createAt', 'desc'),
            limit(this.limit),
        );
        // fetch firestore
        const snapshot = await getDocs(q);
        // get firstVisible
        this.firstVisible = snapshot.docs[0].data().createAt;
        snapshot.forEach((doc) => {
            const data = doc.data();
            this.guestReviewList.push(data);
            this.lastVisible = data.createAt;
        });
        // 로드 후 초기 세팅
        this.setGuestReviews();
    }
}