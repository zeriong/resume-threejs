import * as THREE from 'three';
import Application from '../Application';

export default class Raycaster {
    raycaster;
    timeout1 = null;
    timeout2 = null;
    targetMeshes = [];

    #clickStartX;
    #mouse;
    #mouseMoved;
    #clickStartY;

    constructor() {
        this.raycaster = new THREE.Raycaster();

        this.#mouse = new THREE.Vector2();
        this.#mouseMoved = false;
        this.#clickStartX = 0;
        this.#clickStartY = 0;

        this.init()
    }

    init() {
        const app = Application.getInstance();
        const rendererDom = app.renderer.instance.domElement;

        // 마우스 드래그 시 발생하는 rayCaster 방지
        rendererDom.addEventListener('mousedown', (e) => {
            this.clickStartX = e.clientX;
            this.clickStartY = e.clientY;
        });
        rendererDom.addEventListener('mouseup', (e) => {
            const gapX = Math.abs(e.clientX - this.clickStartX);
            const gapY = Math.abs(e.clientY - this.clickStartY);
            this.#mouseMoved = gapX > 5 || gapY > 5;
        });
        // meshes 감지 이벤트
        rendererDom.addEventListener('click', (e) => {
            // 마우스 클릭 위치 정교화
            this.#mouse.x = e.clientX / rendererDom.clientWidth * 2 - 1;
            this.#mouse.y = -(e.clientY / rendererDom.clientHeight * 2 - 1);
            this.checkIntersects();
        });
    }

    // 레이캐스터 작동 매서드
    async checkIntersects() {
        // raycaster작동 시 targetMeshes 최신데이터를 사용
        const app = Application.getInstance()
        const camera = app.camera.instance;
        const contents = app.contents.getList();

        // 카메라 기준으로 ray 관통
        this.raycaster.setFromCamera(this.#mouse, camera);

        // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        const intersects = this.raycaster.intersectObjects(this.targetMeshes);

        // intersects에 담긴 item이 없다면 return;
        if (!intersects[0]) return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intersects[0])을 식별
        const target = intersects[0].object;

        // contentsController play중이 아니거나 드래그가 아닌 경우에만 이벤트 발생
        if (!app.contentsController.isInContent && !this.#mouseMoved) {

            // 콘텐츠의 실행 매개체인 오브젝트 명칭 종합
            const names = contents.map(item => item.objNames).flat();

            // 오브젝트 클릭에 따른 콘텐츠 진행
            if (names.includes(target.name)) {
                // 선택된 오브젝트
                const content = contents.find((item) => item.objNames.includes(target.name));
                if (content.name === 'guestBook') this.showGuestBookToast()
                return app.contentsController.toContent(content)
            }

            // 링크 메뉴 클릭 이벤트
            if (target.name === 'github_menu') return window.open('https://github.com/zeriong/','_blank');
            if (target.name === 'blog_menu') window.open('https://zeriong.tistory.com/','_blank');
        }

        if (app.contentsController.isInGuestBook) {
            if (target.name === 'nextReview') return await app.world.guestBook.nextReview();
            if (target.name === 'prevReview') await app.world.guestBook.prevReview();
        }
    }

    /** @param {'hidden' || 'show'} type */
    controlPopup(type) {
        const guestBookPopup = document.querySelector('#guestBookPopup');
        const windowSizes = Application.getInstance().windowSizes;
        if (type === 'hidden') {
            // 모바일 대응 추가
            if (windowSizes.width <= 497) guestBookPopup.style.top = '-80px';
            else guestBookPopup.style.top = '-100px';
            guestBookPopup.style.opacity = 0;
        } else if (type === 'show') {
            // 모바일 대응 추가
            if (windowSizes.width <= 497) guestBookPopup.style.top = '80px';
            else guestBookPopup.style.top = '100px';
            guestBookPopup.style.opacity = 1;
        }
    }

    // 방명록 토스트 알림 실행 매서드
    showGuestBookToast() {
        // 방명록 토스트 알림 카메라 무빙 끝난 후 실행
        this.timeout1 = setTimeout(() => {
            this.controlPopup('show');

            this.timeout2 = setTimeout(() => {
                this.controlPopup('hidden');
            },3000);
        }, 1000);
    }
}