import * as THREE from 'three';
import Sizes from './Utills/Sizes';
import Camera from './Core/Camera';
import Renderer from './Core/Renderer';
import World from './World/World';
import Loader from './Core/Loader';
import Raycaster from './Core/Raycaster';
import Lights from './World/Lights';
import Gsap from './Core/Gsap';

export default class Application {

    // 싱글톤 패턴 적용
    static getInstance() {
        // 인스턴스가 없다면 새로 생성
        if (!Application.instance) {
            new Application();
        }
        // 인스턴스 반환
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
        this.gsap = new Gsap();
        this.raycaster = new Raycaster();

        // 변수
        this.isStart = false; // 시작모드 여부 (start & skip)

        this.scene.background = new THREE.Color(0x61657a);

        this.sizes.on('resize', () => this.resize());

        this.camera.createControls();
        this.renderer.setComposer();
        this.update();

        // test
        const axesHelper = new THREE.AxesHelper(10);
        this.scene.add(axesHelper);

        document.querySelector('#test').addEventListener('click', () => {

            const chair1 = this.intersectsMeshes.find(val => val.name === 'chair1');
            const chair2 = this.intersectsMeshes.find(val => val.name === 'chair2');
            const chair3 = this.intersectsMeshes.find(val => val.name === 'chair3');

            chair1.material.transparent = true;
            chair2.material.transparent = true;
            chair3.material.transparent = true;
            chair1.material.opacity = 0;
            chair2.material.opacity = 0;
            chair3.material.opacity = 0;


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