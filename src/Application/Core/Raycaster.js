import * as THREE from 'three';
import Application from '../Application';

export default class Raycaster {
    constructor() {
        const app = Application.getInstance();
        this.rendererDom = app.renderer.instance.domElement;
        this.gsap = app.gsap;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseMoved = false;
        this.clickStartX = 0;
        this.clickStartY = 0;
        this.isInContent = app.gsap.isInContent;
        this.camera = app.camera.instance;
        this.timeout1 = null;
        this.timeout2 = null;

        // 마우스 드래그 시 발생하는 rayCaster 방지
        this.rendererDom.addEventListener('mousedown', (e) => {
            this.clickStartX = e.clientX;
            this.clickStartY = e.clientY;
        });
        this.rendererDom.addEventListener('mouseup', (e) => {
            const gapX = Math.abs(e.clientX - this.clickStartX);
            const gapY = Math.abs(e.clientY - this.clickStartY);
            this.mouseMoved = gapX > 5 || gapY > 5;
        });
        // meshes 감지 이벤트
        this.rendererDom.addEventListener('click', (e) => {
            // 마우스 클릭 위치 정교화
            this.mouse.x = e.clientX / this.rendererDom.clientWidth * 2 - 1;
            this.mouse.y = -(e.clientY / this.rendererDom.clientHeight * 2 - 1);
            this.checkIntersects();
        });
    }

    // 레이캐스터 작동 매서드
    async checkIntersects() {
        // raycaster작동 시 intersectsMeshes 최신데이터를 사용
        const app = Application.getInstance()

        // 카메라 기준으로 ray 관통
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        const intersects = this.raycaster.intersectObjects(app.intersectsMeshes);

        // intersects에 담긴 item이 없다면 return;
        if (!intersects[0]) return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intersects[0])을 식별
        const target = intersects[0].object;

        // gsap play중이 아니거나 드래그가 아닌 경우에만 이벤트 발생
        if (!app.gsap.isInContent && !this.mouseMoved) {
            // 모델링 클릭 카메라 무빙 애니메이션
            if (target.name === 'aboutMe') return this.gsap.toContent(target.name);
            if (target.name === 'projects') return this.gsap.toContent(target.name);
            if (target.name === 'poster') return this.gsap.toContent(target.name);
            if (target.name === 'history') return this.gsap.toContent(target.name);
            if (target.name === 'skills') return this.gsap.toContent(target.name);
            if (target.name === 'guestBook') {
                // 방명록 토스트 알림 실행
                this.playGuestBookToast()
                return this.gsap.toContent('guestBook');
            }

            // 링크 메뉴 클릭 이벤트
            if (target.name === 'github') return window.open('https://github.com/zeriong/','_blank');
            if (target.name === 'blog') window.open('https://zeriong.tistory.com/','_blank');
        }

        if (app.gsap.isInGuestBook) {
            if (target.name === 'nextReview') return await app.guestBook.nextReview();
            if (target.name === 'prevReview') await app.guestBook.prevReview();
        }
    }

    /** @param {'hidden' || 'show'} type */
    controlPopup(type) {
        const guestBookPopup = document.querySelector('#guestBookPopup');
        if (type === 'hidden') {
            guestBookPopup.style.top = '-100px';
            guestBookPopup.style.opacity = 0;
        } else if (type === 'show') {
            guestBookPopup.style.top = '100px';
            guestBookPopup.style.opacity = 1;
        }
    }

    // 방명록 토스트 알림 실행 매서드
    playGuestBookToast() {
        // 방명록 토스트 알림 카메라 무빙 끝난 후 실행
        this.timeout1 = setTimeout(() => {
            this.controlPopup('show');

            this.timeout2 = setTimeout(() => {
                this.controlPopup('hidden');
            },3000);
        }, 1000);
    }
}