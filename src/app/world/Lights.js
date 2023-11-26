import * as THREE from 'three';
import Application from '../Application';

export default class Lights {
    constructor() {
        this.init();
    }

    init() {
        const app = Application.getInstance();

        // 창문 사각
        const windowRectAreaLight = new THREE.RectAreaLight(0xffffff, 16, 1.4, 2);
        windowRectAreaLight.position.set(3.1, 2.1, 1.15); // 빛의 위치 설정
        windowRectAreaLight.lookAt(-5, 2, 1);
        windowRectAreaLight.castShadow = false

        // 문쪽 사각
        const doorRectAreaLight = new THREE.RectAreaLight(0xffffff, 12, 1.4, 3);
        doorRectAreaLight.position.set(3.1, 1.7, 3.2); // 빛의 위치 설정
        doorRectAreaLight.lookAt(-5, 1.7, 3.2)
        doorRectAreaLight.castShadow = false

        // 내부
        const innerLight = new THREE.PointLight(0x918fe3, 16, 8); // 292c39
        innerLight.position.set(1, 2, 2); // 빛의 위치 설정
        innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
        innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
        innerLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
        innerLight.castShadow = false;
        innerLight.penumbra = 1.0;

        // 전체
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

        app.scene.add(
            ambientLight,
            doorRectAreaLight, windowRectAreaLight,
            innerLight
        );
    }
}