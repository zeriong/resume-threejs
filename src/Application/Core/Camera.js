import * as THREE from 'three';
import Application from '../Application';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

export default class Camera {
    constructor() {
        this.application = Application.getInstance();
        this.sizes = this.application.sizes;
        this.scene = this.application.scene;
        this.renderer = this.application.renderer;

        this.setInstance();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(24, this.sizes.width / this.sizes.height, 0.1, 1000);
        this.scene.add(this.instance);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    createControls() {
        // Application에서 클래스 생성 순서 때문에 this.renderer를 재할당 후 실행
        this.renderer = this.application.renderer;

        this.orbitControls = new OrbitControls(this.instance, this.renderer.instance.domElement);
        this.orbitControls.enablePan = false;
        this.orbitControls.enableDamping = true; // 카메라 컨트롤 시 smooth 적용 (draw 함수에 controls.update() 를 넣어야 함)
        this.orbitControls.maxDistance = 100; // 멀어지는 최대거리를 설정
        this.orbitControls.minDistance = 5; // 가까워지는 최소거리 설정
        this.orbitControls.mouseButtons.RIGHT = null; // 마우스 오른쪽 드래그로 중심 축 변경 잠금
        this.orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 바닥 아래를 볼 수 없도록 제한
        this.orbitControls.target.set(1,1,2);
        this.orbitControls.update();
    }

    update() {
        this.orbitControls.update();
    }
}