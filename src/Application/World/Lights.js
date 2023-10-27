import * as THREE from 'three';
import Application from '../Application';

export default class Lights {
    constructor() {
        this.application = Application.getInstance();
        this.scene = this.application.scene;

        // 창문 -> 침대로 향하는
        this.directLight1 = new THREE.DirectionalLight(0xB3B1FF, 5);
        this.directLight1Target = new THREE.Object3D();

        // directLight1 보다 상단 위치
        this.directLight2 = new THREE.DirectionalLight(0xFFD689, 4);
        this.directLight2Target = new THREE.Object3D();

        this.spotLight1 =  new THREE.SpotLight(0xffffff, 250);  // 상단 측면
        this.spotLight2 = new THREE.SpotLight(0xffffff, 350);  // 위 -> 아래
        this.rectAreaLight1 = new THREE.RectAreaLight(0xffffff, 4, 1.4, 2);  // 창문 사각
        this.rectAreaLight2 = new THREE.RectAreaLight(0xffffff, 2, 1.4, 3);  // 문쪽 사각
        this.innerLight = new THREE.PointLight(0xFFDD99, 8, 8); // 내부

        this.setLights();
    }

    setLights() {
        // Common Effect
        const setLightOption = (light) => {
            light.castShadow = true;
            light.shadow.mapSize.set(2048 * 2, 2048 * 2);
            light.penumbra = 1.0;
            light.shadow.bias = -0.0002;
            light.shadow.radius = 10
        }

        // 창문 -> 침대로 향하는
        this.directLight1.position.set(8, 3, 2.5);
        this.directLight1Target.position.set(-2, 0.5, -0);
        this.directLight1.target = this.directLight1Target;
        setLightOption(this.directLight1);

        // directLight1 보다 상단 위치
        this.directLight2.position.set(12, 5, 3);
        this.directLight2Target.position.set(-2, 0, 0);
        this.directLight2.target = this.directLight2Target;  // 빛의 타겟을 새 객체로 설정
        setLightOption(this.directLight2);

        // 상단 측면
        this.spotLight1.position.set(8, 6, 6); // 빛의 위치 설정
        this.spotLight1.target.position.set(-3.5, 0, -1); // 빛이 향할 위치 설정
        this.spotLight1.angle = Math.PI / 7; // 원뿔의 최대 각도 (라디안)
        this.spotLight1.distance = 16; // 빛의 최대 거리 (0은 무제한)
        this.spotLight1.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
        setLightOption(this.spotLight1);

        // 위 -> 아래
        this.spotLight2.position.set(7, 14, 2); // 빛의 위치 설정
        this.spotLight2.target.position.set(-3, 0, 2); // 빛이 향할 위치 설정
        this.spotLight2.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
        this.spotLight2.distance = 18; // 빛의 최대 거리 (0은 무제한)
        this.spotLight2.decay = 1.8; // 빛의 감쇠율 (일반적으로 2 사용)
        setLightOption(this.spotLight2);

        // 창문 사각
        this.rectAreaLight1.position.set(3.1, 2.1, 1.15); // 빛의 위치 설정
        this.rectAreaLight1.lookAt(-5, 2, 1);

        // 문쪽 사각
        this.rectAreaLight2.position.set(3.1, 1.7, 3.2); // 빛의 위치 설정
        this.rectAreaLight2.lookAt(-5, 1.7, 3.2)

        // 내부
        this.innerLight.position.set(1, 2, 2); // 빛의 위치 설정
        this.innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
        this.innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
        this.innerLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
        setLightOption(this.innerLight);

        this.scene.add(
            this.directLight1, this.directLight1Target, this.directLight2, this.directLight2Target,
            this.spotLight1, this.spotLight1.target, this.spotLight2, this.spotLight2.target,
            this.rectAreaLight1, this.rectAreaLight2, this.innerLight
        );
    }
}