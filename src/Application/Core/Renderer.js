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
        this.sizes = app.sizes;
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
            powerPreference: 'high-performance',
        });
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.shadowMap.enabled = true; // 그림자 설정
        this.instance.shadowMap.type = THREE.VSMShadowMap; // 그림자 맵 타입 설정
        this.instance.domElement.style.position = 'absolute';
        document.querySelector('#webgl')?.appendChild(this.instance.domElement);
        // css 렌더러 설정
        this.cssInstance = new CSS3DRenderer();
        this.cssInstance.setSize(this.sizes.width, this.sizes.height);
        this.cssInstance.domElement.style.position = 'absolute';
        document.querySelector(`#css3DObject`)?.appendChild(this.cssInstance.domElement);
    }

    // 그림자, 질감표현의 디테일을 위한 매서드
    // setComposer() {
    //     // EffectComposer
    //     this.composer = new EffectComposer(this.instance);
    //     this.composer.addPass(new RenderPass(this.scene, this.camera.instance));
    //
    //     this.customShader = {
    //         uniforms: {
    //             "tDiffuse": { value: null },
    //             "saturation": { value: 1.0 },
    //             "contrast": { value: 1.0 },
    //             "brightness": { value: 0.0 },
    //             "colorTint": { value: new THREE.Color(0xffffff) }  // 특정 색감 유니폼 추가
    //         },
    //         vertexShader: [
    //             "varying vec2 vUv;",
    //             "void main() {",
    //             "    vUv = uv;",
    //             "    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    //             "}"
    //         ].join('\n'),
    //         fragmentShader: [
    //             "uniform sampler2D tDiffuse;",
    //             "uniform float saturation;",
    //             "uniform float contrast;",
    //             "uniform float brightness;",
    //             "uniform vec3 colorTint;",  // 특정 색감 유니폼 사용
    //             "varying vec2 vUv;",
    //             "void main() {",
    //             "    vec4 color = texture2D(tDiffuse, vUv);",
    //             "    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));",
    //             "    vec3 satColor = mix(vec3(gray), color.rgb, saturation);",
    //             "    vec3 tintedColor = satColor * colorTint;",  // 특정 색감 적용
    //             "    vec3 mid = vec3(0.5);",
    //             "    vec3 conColor = mix(mid, tintedColor, contrast);",  // 대비 개선
    //             "    gl_FragColor = vec4(conColor + brightness, color.a);",
    //             "}"
    //         ].join('\n')
    //     };
    //
    //     this.customPass = new ShaderPass(this.customShader);
    //     this.customPass.uniforms.saturation.value = 0.9;  // 채도
    //     this.customPass.uniforms.contrast.value = 0.9;    // 대비
    //     this.customPass.uniforms.brightness.value = 0.0;  // 밝기
    //     this.composer.addPass(this.customPass);
    //
    //     this.smaaPass = new SMAAPass();
    //     this.composer.addPass(this.smaaPass);
    // }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(Number(window.devicePixelRatio), 2));

        this.cssInstance.setSize(this.sizes.width, this.sizes.height);

        this.instance.render(this.scene, this.camera.instance);
        this.cssInstance.render(this.cssScene, this.camera.instance);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
        this.cssInstance.render(this.cssScene, this.camera.instance);
    }
}