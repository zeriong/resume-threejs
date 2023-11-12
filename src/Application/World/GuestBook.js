import * as THREE from 'three';
import Application from '../Application';
import {Mesh} from 'three';
import {db} from '../Utills/Firebase';
import {collection, query, orderBy, limit, getDocs, addDoc, startAfter, endBefore, limitToLast} from "firebase/firestore";

export class GuestBook {
    constructor() {
        this.app = Application.getInstance();

        this.limit = 6; // 페이지당 limit 지정
        this.currentPage =  1; // 페이지 지정
        this.firstVisible = null; // 이전페이지 페이징을 위한 첫번째 방명록의 createAt
        this.lastVisible = null; // 다음페이지 페이징을 위한 마지막 방명록의 createAt
        this.nextDisabled = true; // next버튼 비활성화 여부
        this.prevDisabled = true; // prev버튼 비활성화 여부

        this.isShowModal = false; // 모달이 show 여부
        this.guestReviewList = [];
        this.canvasList = []; // 이 후 선택하여 painting을 위한 배열
        this.canvasTextureList = []; // needsUpdate를 위한 textTexture를 담은 배열
        this.reviewMeshList = []; // 렌더링 될 최대 6개의 mesh를 담은 배열

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
                app.gsap.toContent('guestBook');
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

        // init setting
        this.setGuestReviews()
    }

    // 방명록 세팅 매서드
    setGuestReviews() {
        (async () => {
            // get data
            await this.getFirestoreData();
            // fetch success

            // 방명록 next 버튼 생성
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
            rightArrowMesh.material.opacity = 0;
            rightArrowMesh.material.transparent = true;
            rightArrowMesh.name = 'nextReview';

            // next 활성화 여부
            if (this.guestReviewList.length === 6) this.nextDisabled = false;

            // 방명록 prev 버튼 생성
            const leftArrowMesh = rightArrowMesh.clone();
            leftArrowMesh.material.side = THREE.DoubleSide;
            leftArrowMesh.rotation.y = THREE.MathUtils.degToRad(90);
            leftArrowMesh.position.set(2.8955, 2.026, 1.837);
            leftArrowMesh.material.opacity = 0;
            leftArrowMesh.material.transparent = true;
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
        })()
    }

    // 방명록 생성 매서드
    createGuestReview() {
        const name = this.guestBookName.value;
        const message = this.guestBookMessage.value;
        if (name.length < 2 && message.length < 2) alert('이름과 메시지는 2글자 이상으로 입력해주세요.');

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
                    // get init data
                    await this.getFirestoreData();
                    // painting
                    this.paintGuestReview();
                })()
            })
            .catch(err => console.log(err));
    }

    /** isFirstLoad: 첫 데이터인 경우 true 삽입하여 초기세팅 */
    paintGuestReview(isFirstLoad) {
        let geometry;
        // 첫 로드인 경우만 geometry 생성하여 세팅
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
                reviewMesh.position.set(...this.reviewMeshPositionSets()[i]);

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

    /**
     * @param type {'on' || 'off'}
     * @param timeout { number }
     * @description 방명록 작성 모달 컨트롤 매서드*/
    controlReviewModal(type, timeout = 320) {
        if (type === 'on') {
            this.isShowModal = true;
            this.guestBook.style.display = 'flex';
            setTimeout(() => this.guestBook.style.opacity = 1,timeout);
        } else if (type === 'off') {
            this.isShowModal = false;
            this.guestBook.style.opacity = 0;
            // transition 이후 사라짐
            setTimeout(() => {
                this.guestBook.style.display = 'none';
            },320);
        }
    }

    // 방명록 next 페이지 매서드
    async nextReview() {
        if (this.nextDisabled) return;
        // get next page data
        await this.getFirestoreData('next');
        // prev 비활성화 상태라면 활성화
        if (this.prevDisabled) this.prevDisabled = false;
        // 페이지++
        this.currentPage++;
        // painting
        this.paintGuestReview();
    }

    // 방명록 prev 페이지 매서드
    async prevReview() {
        if (this.prevDisabled) return;
        // next 비활성화 상태라면 활성화
        if (this.nextDisabled) this.nextDisabled = false;
        // get prev page data
        await this.getFirestoreData('prev');
        // 페이지--
        this.currentPage--;
        // 1페이지로 돌아갈 때 prev 비활성화 및 첫 페이지(최신화된 데이터) load
        if (this.currentPage === 1) {
            this.prevDisabled = true;
            // get init data
            await this.getFirestoreData();
        }
        // painting
        this.paintGuestReview();
    }

    /**
     * @param type { 'next' || 'prev' || undefined }
     * @description firestore 데이터 fetch 매서드 */
    async getFirestoreData(type) {
        // 쿼리 작성
        // next: startAfter(마지막 데이터의 createAt), limit를 사용하여 다음페이지 이동
        // prev: endBefore(처음 받는 데이터의 createAt), limitToLast를 사용하여 이전페이지 이동
        // undefined: 기본쿼리 orderBy, limit만을 사용 (첫 페이지를 최신화하여 렌더링)
        const queryArr = [];
        if (type === 'next') queryArr.push(startAfter(this.lastVisible), limit(this.limit));
        if (type === 'prev') queryArr.push(endBefore(this.firstVisible), limitToLast(this.limit));
        if (!type) queryArr.push(limit(this.limit));

        let q = query(
            collection(db, 'guestBook'),
            orderBy('createAt', 'desc'),
            ...queryArr,
        );

        // fetch firestore
        const snapshot = await getDocs(q);
        // 더이상 받아올 데이터가 없다면 isLastData = true
        if (snapshot.empty) {
            if (type === 'next') return this.nextDisabled = true;
            if (type === 'prev') return this.prevDisabled = true;
        }
        // 새로운 데이터를 받기 위해 빈배열로 초기화
        this.guestReviewList = [];
        // get firstVisible
        this.firstVisible = snapshot.docs[0].data().createAt;
        snapshot.forEach((doc) => {
            const data = doc.data();
            this.guestReviewList.push(data);
            this.lastVisible = data.createAt;
        });
    }

    // 방명록 mesh 포지션 세팅 매서드
    reviewMeshPositionSets() {
        const pos = { x: 2.8955, y: 2.341, z: 2.045, gap: 0.302 }
        return [
            [(pos.x), (pos.y), (pos.z)],
            [(pos.x), (pos.y), (pos.z + pos.gap)],
            [(pos.x), (pos.y - pos.gap), (pos.z)],
            [(pos.x), (pos.y - pos.gap), (pos.z + pos.gap)],
            [(pos.x), (pos.y - (pos.gap * 2)), (pos.z)],
            [(pos.x), (pos.y - (pos.gap * 2)), (pos.z + pos.gap)],
        ];
    }
}