import * as THREE from 'three';
import Application from '../Application';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

export default class Lights {
    constructor() {
        this.init();
    }

    init() {
        const app = Application.getInstance();

        // 창문 사각
        const windowRectAreaLight = new THREE.RectAreaLight(0xffffff, 12, 140, 170);
        windowRectAreaLight.position.set(200, 210, -85); // 빛의 위치 설정
        windowRectAreaLight.lookAt(0, 210, -85);
        windowRectAreaLight.castShadow = false;

        const helper = new RectAreaLightHelper( windowRectAreaLight );
        windowRectAreaLight.add( helper );

        // 문쪽 사각
        const doorRectAreaLight = new THREE.RectAreaLight(0xffffff, 10, 120, 240);
        doorRectAreaLight.position.set(195, 160, 130); // 빛의 위치 설정
        doorRectAreaLight.lookAt(0, 160, 130);
        doorRectAreaLight.castShadow = false;

        const helper2 = new RectAreaLightHelper( doorRectAreaLight );
        doorRectAreaLight.add( helper2 );

        // 내부
        const innerLight = new THREE.PointLight(0x918fe3, 180, 1000); // 292c39
        innerLight.position.set(0, 200, 0); // 빛의 위치 설정
        innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
        //innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
        innerLight.decay = 0.9; // 빛의 감쇠율 (일반적으로 2 사용)
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