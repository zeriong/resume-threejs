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
import EventModule from './Utills/EventModule';
import {GuestBook} from './World/GuestBook';

export default class Application {

    // 싱글톤 패턴 적용
    static getInstance() {
        // 인스턴스가 없다면 새로 생성하고 있다면 인스턴스 반환
        if (!Application.instance) new Application();
        return Application.instance;
    }

    constructor() {
        Application.instance = this;

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
        this.raycaster = new Raycaster()
        this.eventModule = new EventModule();
        this.guestBook = new GuestBook();

        // 변수
        this.isStart = false; // 시작모드 여부 (start & skip)

        this.scene.background = new THREE.Color(0x61657a);

        this.camera.createControls();
        this.renderer.setComposer();
        this.update();

        // test
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);

        this.test = false;
        this.testEl = document.querySelector('#loading');

        document.querySelector('#test').addEventListener('click', () => {
            // if (!this.test) {
            //     this.test = true;
            //     this.testEl.style.display = 'none';
            //     return;
            // }
            // this.testEl.style.display = 'flex';
            // this.test = false;
            console.log('얍!')
            this.guestBook.nextReview();
        });

        // html 작업 시 조정
        this.loader.loadingManager.onLoad = () => {
            // html상호작용 가능 설정
            // document.querySelector('#webgl').style.zIndex = -1;

            // 오빗컨트롤 제한 해제
            this.camera.orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(360); // 하단 시점 제한해제
            this.camera.orbitControls.minDistance = 0; // 가까워지는 최소거리 설정

            // 원하는 컨텐츠로 변경
            // this.htmlPosition = this.positions.getContentPositions();
            // this.content = this.htmlPosition.find(val => val.current === 'projects');
            // this.camera.instance.position.x = this.content.cameraPosition.x;
            // this.camera.instance.position.y = this.content.cameraPosition.y;
            // this.camera.instance.position.z = this.content.cameraPosition.z;
            // this.camera.orbitControls.target.x = this.content.controlsTarget.x;
            // this.camera.orbitControls.target.y = this.content.controlsTarget.y;
            // this.camera.orbitControls.target.z = this.content.controlsTarget.z;

            // 원하는 컨텐츠로 변경
            this.camera.instance.position.x = 0.5;
            this.camera.instance.position.y = 2;
            this.camera.instance.position.z = 2.2;
            this.camera.orbitControls.target.x = 1;
            this.camera.orbitControls.target.y = 2;
            this.camera.orbitControls.target.z = 2.2;
        }
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