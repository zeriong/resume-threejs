import * as THREE from 'three';
import Application from '../Application';
import {Mesh} from 'three';
import {db} from '../common/firebase';
import {collection, query, orderBy, limit, getDocs, addDoc, startAfter, endBefore, limitToLast} from "firebase/firestore";

export default class GuestBook {
    #limit = 6; // 페이지당 limit 지정
    #currentPage =  1; // 페이지 지정
    #firstVisible = null; // 이전페이지 페이징을 위한 첫번째 방명록의 createAt
    #lastVisible = null; // 다음페이지 페이징을 위한 마지막 방명록의 createAt
    #nextDisabled = true; // next버튼 비활성화 여부
    #prevDisabled = true; // prev버튼 비활성화 여부
    #guestReviewList = [];
    #canvasList = []; // 이 후 선택하여 painting을 위한 배열
    #canvasTextureList = []; // needsUpdate를 위한 textTexture를 담은 배열
    #reviewMeshList = []; // 렌더링 될 최대 6개의 mesh를 담은 배열
    #isShowModal = false; // 모달이 show 여부

    // #ids = []; // 어드민 모드에서 방명록 삭제를 위한 id 배열

    constructor() {
        this.#init();
    }

    #init() {
        const app = Application.getInstance();
        const guestBookEl = document.querySelector('#guestBook');
        const contentsController = app.contentsController;

        // 방명록 메뉴 버튼 이벤트
        document.querySelector('#guestBookBtn').addEventListener('click', (e) => {
            e.stopPropagation();

            // 카메라 애니메이션중인 경우 캔슬
            if (contentsController.isMovingCam) return;
            // 방명록 애니메이션 실행
            if (!this.#isShowModal) {
                // 이미 방명록컨텐츠인 경우 모달만 띄움(Gsap 실행 x)
                if (contentsController.isInGuestBook) return this.#controlReviewModal('on', 10);

                // 현재 컨텐츠가 aboutMe인 경우 대화창 사라진 후 이동
                if (contentsController.currentContent?.name === 'aboutMe') {
                    // 말풍선 사라지는 애니메이션 끝나고 이동
                    contentsController.hideDialog('guestBook', false);
                    // 말풍선 사라지는 애니메이션 끝난 후 방명록 작성 모달 띄움
                    setTimeout(() => this.#controlReviewModal('on'), 1350);
                } else {
                    contentsController.toContent('guestBook');
                    // 카메라 애니메이션 끝난 후 방명록 작성 모달 띄움
                    setTimeout(() => this.#controlReviewModal('on'), 1000);
                }
                contentsController.isInGuestBook = true;
                this.#isShowModal = true;
            }
        });
        // 리뷰모달 클릭 시 모달 취소 캔슬
        guestBookEl.addEventListener('click', e => e.stopPropagation());
        guestBookEl.addEventListener('submit', e => e.preventDefault());
        // 리뷰모달 취소
        window.addEventListener('click', (e) => {
            if (!this.#isShowModal) return;
            this.#controlReviewModal('off');
        });
        // 타이틀에서 Enter 시 내용으로 포커스
        document.querySelector('#guestBookName').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.querySelector('#guestBookMessage').focus();
                e.preventDefault();
            }
        });
        // 방명록 작성
        document.querySelector('#guestBookSubmit').addEventListener('click', () => {
            this.#createGuestReview();
        });

        this.#setGuestReviews();
    }

    // 방명록 세팅 매서드
    #setGuestReviews() {
        (async () => {
            const app = Application.getInstance()
            const raycaster = app.raycaster;

            // get data
            await this.#getFirestoreData();

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
            if (this.#guestReviewList.length === 6) this.#nextDisabled = false;

            // 방명록 prev 버튼 생성
            const leftArrowMesh = rightArrowMesh.clone();
            leftArrowMesh.material.side = THREE.DoubleSide;
            leftArrowMesh.rotation.y = THREE.MathUtils.degToRad(90);
            leftArrowMesh.position.set(2.8955, 2.026, 1.838);
            leftArrowMesh.material.opacity = 0;
            leftArrowMesh.material.transparent = true;
            leftArrowMesh.name = 'prevReview';

            // 버튼들 raycaster, scene추가
            raycaster.targetMeshes.push(leftArrowMesh, rightArrowMesh);
            app.scene.add(rightArrowMesh, leftArrowMesh);

            // 방명록 raycaster 감지 영역 추가
            const areaGeometry = new THREE.PlaneGeometry(0.6,1,1,1);
            const areaMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
            const areaMesh = new Mesh(areaGeometry, areaMaterial);
            areaMesh.position.set(2.8955, 2, 2.2);
            areaMesh.rotation.y = THREE.MathUtils.degToRad(-90);
            areaMesh.name = 'guestBook';

            raycaster.targetMeshes.push(areaMesh);
            app.scene.add(areaMesh);

            // 방명록 첫 렌더링 기준으로 painting
            this.#paintGuestReview(true);
        })()
    }

    // 방명록 생성 매서드
    #createGuestReview() {
        const name = document.querySelector('#guestBookName');
        const message = document.querySelector('#guestBookMessage');
        if (name.value.length < 2 && message.value.length < 2) return alert('이름과 메시지는 2글자 이상으로 입력해주세요.');

        addDoc(collection(db, 'guestBook'), {
            createAt: new Date().toISOString(),
            name: name.value,
            message: message.value,
        })
            .then(res => {
                name.value = '';
                message.value = '';
                this.#controlReviewModal('off');

                (async () => {
                    // get init data
                    await this.#getFirestoreData();
                    // painting
                    this.#paintGuestReview();
                })()
            })
            .catch(err => console.log(err));
    }

    /** isFirstLoad: 첫 데이터인 경우 매개변수에 true 삽입하여 초기세팅 */
    #paintGuestReview(isFirstLoad) {
        const app = Application.getInstance();
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
                reviewMesh.position.set(...this.#reviewMeshPositionSets()[i]);

                // review mesh 기울기 랜덤 설정
                reviewMesh.rotation.x = THREE.MathUtils.degToRad(Math.random() * 7 - 3.5);

                // 이 후 선택하여 painting을 위한 배열
                this.#canvasList.push(canvas);
                // 방명록을 그려 줄 때 needsUpdate속성에 접근하기 위한 배열에 추가
                this.#canvasTextureList.push(texture);
                // 데이터 개수에 따라 mesh를 보여주기 위한 배열
                this.#reviewMeshList.push(reviewMesh);
            }

            // 리뷰가 존재한다면 리뷰 추가
            const review = this.#guestReviewList[i];
            if (review) {
                // 방명록 각도 변경
                this.#reviewMeshList[i].rotation.x = THREE.MathUtils.degToRad(Math.random() * 7 - 3.5);
                // canvas painting
                const context = this.#canvasList[i].getContext('2d');
                const title = this.#guestReviewList[i].name;
                const date = new Date(this.#guestReviewList[i].createAt);
                const createAt = date.getFullYear().toString() + '-' +
                    (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
                    date.getDate().toString().padStart(2, '0');
                // content 가공
                const contentTxt = this.#guestReviewList[i].message.replace(/\n/g, '')
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
                if (!isFirstLoad) this.#canvasTextureList[i].needsUpdate = true;

                app.scene.add(this.#reviewMeshList[i]);
            } else { // 리뷰가 존재하지 않는다면 scene에서 제외
                app.scene.remove(this.#reviewMeshList[i]);
            }
        }
    }

    /**
     * @param type {'on' || 'off'}
     * @param timeout { number }
     * @description 방명록 작성 모달 컨트롤 매서드*/
    #controlReviewModal(type, timeout = 320) {
        const guestBook = document.querySelector('#guestBook');
        if (type === 'on') {
            this.#isShowModal = true;
            guestBook.style.display = 'flex';
            setTimeout(() => guestBook.style.opacity = 1,timeout);
        } else if (type === 'off') {
            this.#isShowModal = false;
            guestBook.style.opacity = 0;
            // transition 이후 사라짐
            setTimeout(() => {
                guestBook.style.display = 'none';
            },320);
        }
    }

    // 방명록 next 페이지 매서드
    async nextReview() {
        if (this.#nextDisabled) return;
        // get next page data
        await this.#getFirestoreData('next');
        // fetch 후 다음 데이터가 더 있는 경우만
        if (!this.#nextDisabled) {
            // prev 비활성화 상태라면 활성화
            if (this.#prevDisabled) this.#prevDisabled = false;
            // 페이지++
            this.#currentPage++;
            // painting
            this.#paintGuestReview();
        }
    }

    // 방명록 prev 페이지 매서드
    async prevReview() {
        if (this.#prevDisabled) return;
        // next 비활성화 상태라면 활성화
        if (this.#nextDisabled) this.#nextDisabled = false;
        // get prev page data
        await this.#getFirestoreData('prev');
        // fetch 후 이전 데이터가 더 있는 경우만
        if (!this.#prevDisabled) {
            // 페이지--
            this.#currentPage--;
            // 1페이지로 돌아갈 때 prev 비활성화 및 첫 페이지(최신화된 데이터) load
            if (this.#currentPage === 1) {
                this.#prevDisabled = true;
                // get init data
                await this.#getFirestoreData();
            }
            // painting
            this.#paintGuestReview();
        }

    }

    /**
     * @param type { 'next' || 'prev' || undefined }
     * @description firestore 데이터 fetch 매서드 */
    async #getFirestoreData(type) {
        // 쿼리 작성
        // next: startAfter(마지막 데이터의 createAt), limit를 사용하여 다음페이지 이동
        // prev: endBefore(처음 받는 데이터의 createAt), limitToLast를 사용하여 이전페이지 이동
        // undefined: 기본쿼리 orderBy, limit만을 사용 (첫 페이지를 최신화하여 렌더링)
        const queryArr = [];
        if (type === 'next') queryArr.push(startAfter(this.#lastVisible), limit(this.#limit));
        if (type === 'prev') queryArr.push(endBefore(this.#firstVisible), limitToLast(this.#limit));
        if (!type) queryArr.push(limit(this.#limit));

        let q = query(
            collection(db, 'guestBook'),
            orderBy('createAt', 'desc'),
            ...queryArr,
        );

        // fetch firestore
        const snapshot = await getDocs(q);
        // 더이상 받아올 데이터가 없다면 isLastData = true
        if (snapshot.empty) {
            if (type === 'next') return this.#nextDisabled = true;
            if (type === 'prev') return this.#prevDisabled = true;
        }
        // 새로운 데이터를 받기 위해 빈배열로 초기화
        this.#guestReviewList = [];
        // get firstVisible
        this.#firstVisible = snapshot.docs[0].data().createAt;
        snapshot.forEach((doc) => {
            const data = doc.data();
            // this.#ids.push(doc._key.path.segments[6]); // 랜덤 문서이름을 id로 지정
            this.#guestReviewList.push(data);
            this.#lastVisible = data.createAt;
        });
    }

    // 방명록 mesh 포지션 세팅 매서드
    #reviewMeshPositionSets() {
        const pos = { x: 2.896, y: 2.341, z: 2.045, gap: 0.302 }
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