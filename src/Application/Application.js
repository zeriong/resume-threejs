import * as THREE from 'three';
import Sizes from './Utills/Sizes';
import Camera from './Core/Camera';
import Renderer from './Core/Renderer';
import World from './World/World';
import Loader from './Core/Loader';
import Raycaster from './Core/Raycaster';
import Lights from './World/Lights';
import GsapAnimation from './Core/GsapAnimation';
import Positions from './Utills/Positions';
import {GuestBook} from './World/GuestBook';

export default class Application {

    // 싱글톤 패턴 적용
    static getInstance() {
        // 인스턴스가 없다면 새로 생성하고 있다면 인스턴스 반환
        if (!Application.instance) new Application();
        return Application.instance;
    }

    constructor() {
        // 싱글톤 패턴 적용
        Application.instance = this;

        // variables
        this.isStart = false; // 시작모드 여부 (start & skip)
        this.onSound = true; // sound on/off 여부

        // Setup
        this.intersectsMeshes = [];
        this.sizes = new Sizes();
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.loader = new Loader();
        this.lights = new Lights();
        this.world = new World();
        this.positions = new Positions();
        this.gsap = new GsapAnimation();
        this.raycaster = new Raycaster();
        this.guestBook = new GuestBook();

        this.scene.background = new THREE.Color(0x61657a);

        // common events
        const guestBookBtn = document.querySelector('#guestBookBtn');
        const soundBtn = document.querySelector('#soundBtn');
        const guestBookToolTip = document.querySelector('#guestBookToolTip');
        const soundToolTip = document.querySelector('#soundToolTip');
        const soundOn = document.querySelector('#soundOn');
        const soundOff = document.querySelector('#soundOff');

        // 모바일이 아닌 경우만 방명록 & 사운드 버튼 툴팁, hover 이벤트
        if (this.sizes.width > 497) {
            guestBookBtn.addEventListener('mouseenter' ,() => {
                guestBookBtn.style.backgroundColor = '#363636';
                guestBookToolTip.style.opacity = 1;
                guestBookToolTip.style.visibility = 'visible';
            });
            guestBookBtn.addEventListener('mouseleave' ,() => {
                guestBookBtn.style.backgroundColor = '#252525';
                guestBookToolTip.style.opacity = 0;
                guestBookToolTip.style.visibility = 'hidden';
            });
            soundBtn.addEventListener('mouseenter' ,() => {
                soundBtn.style.backgroundColor = '#363636';
                soundToolTip.style.opacity = 1;
                soundToolTip.style.visibility = 'visible';
            });
            soundBtn.addEventListener('mouseleave' ,() => {
                soundBtn.style.backgroundColor = '#252525';
                soundToolTip.style.opacity = 0;
                soundToolTip.style.visibility = 'hidden';
            });
        }
        // 사운드버튼 클릭 시 아이콘 토글 이벤트
        soundBtn.addEventListener('click', () => {
            if (this.onSound) {
                this.onSound = false;
                soundOff.style.display = 'block';
                soundOn.style.display = 'none';
            } else {
                this.onSound = true;
                soundOff.style.display = 'none';
                soundOn.style.display = 'block';
            }
        });

        // 매서드 실행
        this.camera.createControls();
        // this.renderer.setComposer();
        this.update();

        // test
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);



        // this.test = false;
        // this.testEl = document.querySelector('#loading');
        //
        // document.querySelector('#test').addEventListener('click', () => {
        //     // if (!this.test) {
        //     //     this.test = true;
        //     //     this.testEl.style.display = 'none';
        //     //     return;
        //     // }
        //     // this.testEl.style.display = 'flex';
        //     // this.test = false;
        //     // this.guestBook.nextReview();
        //     // this.gsap.toGuestBook();
        // });

        // // html 작업 시 조정
        // this.loader.loadingManager.onLoad = () => {
        //     // html상호작용 가능 설정
        //     // document.querySelector('#webgl').style.zIndex = -1;
        //
        //     // 오빗컨트롤 제한 해제
        //     this.camera.orbitControls.maxPolarAngle = Math.PI; // 하단 시점 제한해제
        //     this.camera.orbitControls.minDistance = 0; // 가까워지는 최소거리 설정
        //     this.camera.orbitControls.minAzimuthAngle = -Infinity; // 좌측 시점 제한해제
        //     this.camera.orbitControls.maxAzimuthAngle = Infinity; // 우측 시점 제한해제
        //
        //     // 원하는 컨텐츠로 변경
        //     // this.htmlPosition = this.positions.getContentPositions();
        //     // this.content = this.htmlPosition.find(val => val.current === 'projects');
        //     // this.camera.instance.position.x = this.content.cameraPosition.x;
        //     // this.camera.instance.position.y = this.content.cameraPosition.y;
        //     // this.camera.instance.position.z = this.content.cameraPosition.z;
        //     // this.camera.orbitControls.target.x = this.content.controlsTarget.x;
        //     // this.camera.orbitControls.target.y = this.content.controlsTarget.y;
        //     // this.camera.orbitControls.target.z = this.content.controlsTarget.z;
        //
        //     // 현재 방명록 시점으로 지정.
        //     this.camera.instance.position.x = 0.5;
        //     this.camera.instance.position.y = 2;
        //     this.camera.instance.position.z = 2.2;
        //     this.camera.orbitControls.target.x = 1;
        //     this.camera.orbitControls.target.y = 2;
        //     this.camera.orbitControls.target.z = 2.2;
        // }
    }

    // 3D 렌더링 요소 일괄 업데이트
    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update();

        window.requestAnimationFrame(() => {
            this.update();
        });
    }

    // resize 일괄 실행
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
}