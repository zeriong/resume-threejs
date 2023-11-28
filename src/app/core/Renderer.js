import Application from '../Application';
import * as THREE from 'three';
import {CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer';
import {RenderPass} from 'three/addons/postprocessing/RenderPass';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass';

export default class Renderer {
    constructor() {
        const app = Application.getInstance();
        this.windowSizes = app.windowSizes;
        this.scene = app.scene;
        this.cssScene = app.cssScene;
        this.camera = app.camera;

        this.setInstance();
    }

    setInstance() {
        // 기본 렌더러 설정
        this.instance = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            //powerPreference: 'high-performance',
        });
        this.instance.setSize(this.windowSizes.width, this.windowSizes.height)
        this.instance.setPixelRatio(this.windowSizes.pixelRatio);
        //this.instance.shadowMap.enabled = true; // 그림자 설정
        //this.instance.shadowMap.type = THREE.VSMShadowMap; // 그림자 맵 타입 설정
        //this.instance.toneMapping = THREE.ACESFilmicToneMapping
        //this.instance.toneMappingExposure = 0.8
        //this.instance.toneMapping = THREE.NoToneMapping
        this.instance.domElement.style.position = 'absolute';
        document.querySelector('#webgl')?.appendChild(this.instance.domElement);

        // css 렌더러 설정
        this.cssInstance = new CSS3DRenderer();
        this.cssInstance.setSize(this.windowSizes.width, this.windowSizes.height);
        this.cssInstance.domElement.style.position = 'absolute';
        document.querySelector(`#css3DObject`)?.appendChild(this.cssInstance.domElement);
    }

    resize() {
        this.instance.setSize(this.windowSizes.width, this.windowSizes.height);
        this.instance.setPixelRatio(this.windowSizes.pixelRatio);

        this.cssInstance.setSize(this.windowSizes.width, this.windowSizes.height);

        this.instance.render(this.scene, this.camera.instance);
        this.cssInstance.render(this.cssScene, this.camera.instance);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
        this.cssInstance.render(this.cssScene, this.camera.instance);
    }
}