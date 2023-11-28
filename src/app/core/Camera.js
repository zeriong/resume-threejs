import * as THREE from 'three';
import Application from '../Application';
import {OrbitControls} from 'three/addons/controls/OrbitControls';

export default class Camera {
    constructor() {
        const app = Application.getInstance();
        this.windowSizes = app.windowSizes;
        this.scene = app.scene;
        this.renderer = app.renderer;

        this.setCameraPosition();
        this.init();
    }

    // 카메라 생성
    init() {
        this.instance = new THREE.PerspectiveCamera(24, this.windowSizes.width / this.windowSizes.height, 0.1, 1000);
        this.instance.position.set(...this.cameraPosition);

        this.scene.add(this.instance);
    }

    // 카메라 리사이즈 처리
    resize() {
        this.instance.aspect = this.windowSizes.width / this.windowSizes.height;
        this.instance.updateProjectionMatrix();
    }

    // set 카메라 포지션
    setCameraPosition() {
        const fixCamPosition = () => {
            if (this.windowSizes.width >= 1400) return 1;
            return (1400 - this.windowSizes.width) * (this.windowSizes.width <= 497 ? 0.0003 : 0.0007) + 1;
        }
        this.cameraPosition = [
            (this.windowSizes.width <= 497) ? (-2.96 * fixCamPosition()) : (-24 * fixCamPosition()),
            (this.windowSizes.width <= 497) ? (10.63 * fixCamPosition()) : (14.4 * fixCamPosition()),
            (this.windowSizes.width <= 497) ? (30.98 * fixCamPosition()) : (14 * fixCamPosition()),
        ]
    }

    // 컨트롤 생성
    createControls() {
        // Application에서 클래스 생성 순서 때문에 this.renderer를 초기화
        this.renderer = Application.getInstance().renderer;

        this.orbitControls = new OrbitControls(this.instance, this.renderer.instance.domElement);
        this.orbitControls.enablePan = false;
        this.orbitControls.enableDamping = true; // 카메라 컨트롤 시 smooth 적용 (draw 함수에 controls.update() 를 넣어야 함)
        this.orbitControls.maxDistance = 50; // 멀어지는 최대거리를 설정
        this.orbitControls.minDistance = 5; // 가까워지는 최소거리 설정
        this.orbitControls.mouseButtons.RIGHT = null; // 마우스 오른쪽 드래그로 중심 축 변경 잠금
        this.orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 바닥 아래를 볼 수 없도록 제한
        this.orbitControls.minAzimuthAngle = -THREE.MathUtils.degToRad(90); // 좌측 시점 제한
        this.orbitControls.maxAzimuthAngle = THREE.MathUtils.degToRad(0); // 우측 시점 제한
        this.orbitControls.target.set(1, 1.5, 2);
        this.orbitControls.update();
    }

    // 컨트롤 업데이트 매서드
    update() {
        this.orbitControls.update();
    }
}