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
        this.raycaster = new Raycaster();

        // 변수
        this.isStart = false; // 시작모드 여부 (start & skip)

        this.scene.background = new THREE.Color(0x61657a);

        this.camera.createControls();
        this.renderer.setComposer();
        this.update();

        // test
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);

        document.querySelector('#test').addEventListener('click', () => {
            console.log(this.world.projectsPosition)
        });
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