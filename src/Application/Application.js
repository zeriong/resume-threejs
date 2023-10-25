import * as THREE from 'three';
import Sizes from './Utills/Sizes';
import Camera from './Core/Camera';
import Renderer from './Core/Renderer';
import World from './World/World';
import Loader from './Core/Loader';
import {camera} from '../main';

export default class Application {

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

        // this.loading = new Loading();
        this.sizes = new Sizes();
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.camera.createControls();
        this.world = new World();
        this.loader = new Loader();

        this.renderer.setComposer();

        this.sizes.on('resize', () => this.resize());

        this.update();
    }



    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update();

        window.requestAnimationFrame(() => {
            this.update();
        });
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }
}