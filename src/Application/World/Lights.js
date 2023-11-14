import * as THREE from 'three';
import Application from '../Application';

export default class Lights {
    constructor() {
        this.app = Application.getInstance();
        this.scene = this.app.scene;
        this.setLights();
    }

    setLights() {
        // EventModule Effect
        const setLightOption = (light) => {
            light.castShadow = true;
            light.shadow.mapSize.set(2048 * 2, 2048 * 2);
            light.penumbra = 1.0;
            light.shadow.bias = -0.0002;
            light.shadow.radius = 10
        }

        // 창문 -> 침대로 향하는
        const windowToBedDirectLight = new THREE.DirectionalLight(0xB3B1FF, 5);
        const windowToBedDirectLightTarget = new THREE.Object3D();
        windowToBedDirectLight.position.set(8, 3, 2.5);
        windowToBedDirectLightTarget.position.set(-2, 0.5, -0);
        windowToBedDirectLight.target = windowToBedDirectLightTarget;
        setLightOption(windowToBedDirectLight);

        // directLight1 보다 상단 위치
        const aboveWindowToBedDirectLight = new THREE.DirectionalLight(0xFFD689, 4);
        const aboveWindowToBedDirectLightTarget = new THREE.Object3D();
        aboveWindowToBedDirectLight.position.set(12, 5, 3);
        aboveWindowToBedDirectLightTarget.position.set(-2, 0, 0);
        aboveWindowToBedDirectLight.target = aboveWindowToBedDirectLightTarget;  // 빛의 타겟을 새 객체로 설정
        setLightOption(aboveWindowToBedDirectLight);

        // 상단 측면
        const topRightSpotLight =  new THREE.SpotLight(0xffffff, 250);
        topRightSpotLight.position.set(8, 6, 6); // 빛의 위치 설정
        topRightSpotLight.target.position.set(-3.5, 0, -1); // 빛이 향할 위치 설정
        topRightSpotLight.angle = Math.PI / 7; // 원뿔의 최대 각도 (라디안)
        topRightSpotLight.distance = 16; // 빛의 최대 거리 (0은 무제한)
        topRightSpotLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
        setLightOption(topRightSpotLight);

        // 위 -> 아래
        const upToFloorSpotLight = new THREE.SpotLight(0xffffff, 350);
        upToFloorSpotLight.position.set(7, 14, 2); // 빛의 위치 설정
        upToFloorSpotLight.target.position.set(-3, 0, 2); // 빛이 향할 위치 설정
        upToFloorSpotLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
        upToFloorSpotLight.distance = 18; // 빛의 최대 거리 (0은 무제한)
        upToFloorSpotLight.decay = 1.8; // 빛의 감쇠율 (일반적으로 2 사용)
        setLightOption(upToFloorSpotLight);

        // 창문 사각
        const windowRectAreaLight = new THREE.RectAreaLight(0xffffff, 4, 1.4, 2);
        windowRectAreaLight.position.set(3.1, 2.1, 1.15); // 빛의 위치 설정
        windowRectAreaLight.lookAt(-5, 2, 1);

        // 문쪽 사각
        const doorRectAreaLight = new THREE.RectAreaLight(0xffffff, 2, 1.4, 3);
        doorRectAreaLight.position.set(3.1, 1.7, 3.2); // 빛의 위치 설정
        doorRectAreaLight.lookAt(-5, 1.7, 3.2)

        // 내부
        const innerLight = new THREE.PointLight(0xFFDD99, 8, 8);
        innerLight.position.set(1, 2, 2); // 빛의 위치 설정
        innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
        innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
        innerLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
        setLightOption(innerLight);

        this.scene.add(
            windowToBedDirectLight, windowToBedDirectLightTarget, aboveWindowToBedDirectLight, aboveWindowToBedDirectLightTarget,
            topRightSpotLight, topRightSpotLight.target, upToFloorSpotLight, upToFloorSpotLight.target,
            windowRectAreaLight, doorRectAreaLight, innerLight
        );
    }
}