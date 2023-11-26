import * as THREE from 'three';
import WindowSizes from './utills/WindowSizes';
import Camera from './core/Camera';
import Renderer from './core/Renderer';
import World from './world/World';
import Loader from './core/Loader';
import Raycaster from './core/Raycaster';
import ContentsController from './core/ContentsController';
import Contents from './core/Contents';
import Audio from './core/Audio';
import UI from "./core/UI";

export default class Application {

    // 싱글톤 패턴 적용
    static getInstance() {
        // 인스턴스가 없다면 새로 생성하고 있다면 인스턴스 반환
        if (!Application.instance) new Application();
        return Application.instance;
    }

    constructor() {
        // 생성자에서 인스턴스 정의
        Application.instance = this;
    }

    init() {
        // variables
        this.isStart = false; // 시작모드 여부 (start & skip)

        // Setup
        this.windowSizes = new WindowSizes();
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.raycaster = new Raycaster();
        this.loader = new Loader();
        this.contents = new Contents();
        this.contentsController = new ContentsController();
        this.audio = new Audio();
        this.ui = new UI();

        this.world = World.getInstance().init();

        this.scene.background = new THREE.Color(0x222222); // 0x61657a
        this.scene.fog = new THREE.Fog(0x222222, 10, 100);

        // 매서드 실행
        this.camera.createControls();
        this.update();

        // test
        //const axesHelper = new THREE.AxesHelper(10);
        //this.scene.add(axesHelper);

        // 테스트시 주석 해제
        // const loadingEl = document.querySelector('#loading');
        // loadingEl.style.display = 'none';
        //
        // return Application.instance

        // html 작업 시 조정
        // this.loader.loadingManager.onLoad = () => {
        //     // html상호작용 가능 설정
        //     document.querySelector('#webgl').style.zIndex = -1;
        //
        //     // 오빗컨트롤 제한 해제
        //     this.camera.orbitControls.maxPolarAngle = Math.PI; // 하단 시점 제한해제
        //     this.camera.orbitControls.minDistance = 0; // 가까워지는 최소거리 설정
        //     this.camera.orbitControls.minAzimuthAngle = -Infinity; // 좌측 시점 제한해제
        //     this.camera.orbitControls.maxAzimuthAngle = Infinity; // 우측 시점 제한해제
        //
        //     // 원하는 컨텐츠로 변경
        //     this.htmlPosition = this.positions.getContentPositions();
        //     this.content = this.htmlPosition.find(val => val.current === 'roadMap');
        //     this.camera.instance.position.x = this.content.cameraPosition.x;
        //     this.camera.instance.position.y = this.content.cameraPosition.y;
        //     this.camera.instance.position.z = this.content.cameraPosition.z;
        //     this.camera.orbitControls.target.x = this.content.controlsTarget.x;
        //     this.camera.orbitControls.target.y = this.content.controlsTarget.y;
        //     this.camera.orbitControls.target.z = this.content.controlsTarget.z;
        //
        //     // // 방명록 시점으로 지정.
        //     // this.camera.instance.position.x = 0.5;
        //     // this.camera.instance.position.y = 2;
        //     // this.camera.instance.position.z = 2.2;
        //     // this.camera.orbitControls.target.x = 1;
        //     // this.camera.orbitControls.target.y = 2;
        //     // this.camera.orbitControls.target.z = 2.2;
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