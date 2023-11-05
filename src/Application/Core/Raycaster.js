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
        this.guestBookPopup = document.querySelector('#guestBookPopup');

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

    checkIntersects() {
        // raycaster작동 시 intersectsMeshes 최신데이터를 사용
        const app = Application.getInstance()
        const intersectsMeshes = app.intersectsMeshes;
        const isInContent = app.gsap.isInContent;

        // gsap play중이거나 드래그인 경우 이벤트 x
        if (isInContent || this.mouseMoved) return;
        this.raycaster.setFromCamera(this.mouse, this.camera); // 카메라 기준으로 ray 관통

        const intersects = this.raycaster.intersectObjects(intersectsMeshes); // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intersects[0])을 식별
        const target = intersects[0].object;

        // 모델링 클릭 카메라 줌인 무빙 애니메이션
        if (target.name === 'aboutMe1') this.gsap.toContent(target.name);
        if (target.name === 'projects') this.gsap.toContent(target.name);
        if (target.name === 'poster') this.gsap.toContent(target.name);
        if (target.name === 'history') this.gsap.toContent(target.name);
        if (target.name === 'skills') this.gsap.toContent(target.name);
        if (target.name === 'guestBook') {
            this.timeout1 = setTimeout(() => {
                this.controlPopup('show');

                this.timeout2 = setTimeout(() => {
                    this.controlPopup('hidden');
                },3000);
            }, 1000);
            this.gsap.toGuestBook();
        }
        if (target.name === 'nextReview') app.guestBook.nextReview();
        if (target.name === 'prevReview') app.guestBook.prevReview();

        // 링크 메뉴 클릭 이벤트
        if (target.name === 'github') window.open('https://github.com/zeriong/','_blank');
        if (target.name === 'blog') window.open('https://zeriong.tistory.com/','_blank');
    }

    /** type: hidden || show */
    controlPopup(type) {
        if (type === 'hidden') {
            this.guestBookPopup.style.top = '-100px';
            this.guestBookPopup.style.opacity = 0;
        } else if (type === 'show') {
            this.guestBookPopup.style.top = '100px';
            this.guestBookPopup.style.opacity = 1;
        }
    }
}