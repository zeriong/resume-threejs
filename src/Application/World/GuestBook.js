import * as THREE from 'three';
import Application from '../Application';
import {Mesh} from 'three';
import {db} from '../Utills/Firebase';
import {  collection, query, orderBy, limit, getDocs, addDoc, startAfter  } from "firebase/firestore";

export class GuestBook {
    constructor() {
        this.app = Application.getInstance();

        this.limit = 6;
        this.currentPage =  -1;
        this.lastVisible = null;

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
        

        // 변경사항 없는 geometry는 재사용
        const geometry = new THREE.PlaneGeometry(0.23, 0.23, 1, 1);

        // 리뷰 Mesh를 모두 담은 배열 생성
        for (let i = 0; i < 6; i ++) {
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
                for (let i = 0; i < contentTxt.length; i += 11) {
                    contentArr.push(contentTxt.slice(i, i + 11));
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

                this.app.scene.add(this.reviewMeshList[i]);
            }
        }
    }

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
            })
            .catch(err => console.log(err));
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
        // console.log('넥스트리뷰 before', this.canvasContext)
        // // 메모지 Mesh 배열 생성
        // this.canvasContext.fillStyle = '#fff';
        // this.canvasContext.fillRect(0, 0, 500, 500)
        // this.canvasTexture.needsUpdate = true;
        // console.log('넥스트리뷰 after', this.canvasContext)
        // todo: startAfter와 endBefore를 사용한 파이어베이스 페이지네이션 구현
        const q = query(
            collection(db, 'guestBook'),
            orderBy('createAt', 'desc'),
            startAfter(this.lastVisible),
            limit(this.limit),
        )
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            console.log(doc.data())
            this.guestReviewList.push(doc.data());
        })

        this.currentPage++;
    }
    prevReview() {
        // console.log('넥스트리뷰 before', this.canvasContext)
        // // 메모지 Mesh 배열 생성
        // this.canvasContext.fillStyle = '#fff';
        // this.canvasContext.fillRect(0, 0, 500, 500)
        // this.canvasTexture.needsUpdate = true;
        // console.log('넥스트리뷰 after', this.canvasContext)


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
        snapshot.forEach((doc, idx) => {
            const data = doc.data();
            this.guestReviewList.push(data);
            this.lastVisible = data.createAt;
        });
        // 로드 후 초기 세팅
        this.setGuestReviews();
    }
}