import * as THREE from 'three';
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper';

export const setLights = (scene) => {
    // 조명 전체 세팅 함수
    const setLightOption = (light) => {
        light.castShadow = true;
        light.shadow.mapSize.set(2048 * 2, 2048 * 2);
        light.penumbra = 1.0;
        light.shadow.bias = -0.0002;
        light.shadow.radius = 10
        //light.shadow.blurSamples = 100;
        //light.shadow.radius = 10
        /*light.shadow.radius = 30;
        light.shadow.mapSize.set(2048, 2048);
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 1000;
        /*light.penumbra = 1; // 부드러운 경계
        light.castShadow = true;
        light.shadow.radius = 30;
        light.shadow.mapSize.set(2048, 2048);
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 1000;
        light.shadow.bias = -0.001
        light.shadow.blurSamples = 20;*/
    }

    var directionalLight1 = new THREE.DirectionalLight(0xB3B1FF, 5);
    directionalLight1.position.set(8, 3, 2.5);
    setLightOption(directionalLight1)
    var targetObject1 = new THREE.Object3D();
    targetObject1.position.set(-2, 0.5, -0);
    scene.add(targetObject1);
    directionalLight1.target = targetObject1;  // 빛의 타겟을 새 객체로 설정
    scene.add(directionalLight1);
    //scene.add(new THREE.DirectionalLightHelper(directionalLight1));

    var directionalLight2 = new THREE.DirectionalLight(0xFFD689, 4);
    directionalLight2.position.set(12, 5, 3);
    setLightOption(directionalLight2)
    var targetObject2 = new THREE.Object3D();
    targetObject2.position.set(-2, 0, 0);
    scene.add(targetObject2);
    directionalLight2.target = targetObject2;  // 빛의 타겟을 새 객체로 설정
    scene.add(directionalLight2);
    //scene.add(new THREE.DirectionalLightHelper(directionalLight2));


    // 측면
    const spotLight1 = new THREE.SpotLight(0xffffff, 250);
    spotLight1.position.set(8, 6, 6); // 빛의 위치 설정
    spotLight1.target.position.set(-3.5, 0, -1); // 빛이 향할 위치 설정
    spotLight1.angle = Math.PI / 7; // 원뿔의 최대 각도 (라디안)
    spotLight1.distance = 16; // 빛의 최대 거리 (0은 무제한)
    spotLight1.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
    setLightOption(spotLight1);
    scene.add(spotLight1);
    scene.add(spotLight1.target);
    //scene.add(new THREE.SpotLightHelper(spotLight1));

    // 위에서 아래
    const spotLight2 = new THREE.SpotLight(0xffffff, 350);
    spotLight2.position.set(7, 14, 2); // 빛의 위치 설정
    spotLight2.target.position.set(-3, 0, 2); // 빛이 향할 위치 설정
    spotLight2.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
    spotLight2.distance = 18; // 빛의 최대 거리 (0은 무제한)
    spotLight2.decay = 1.8; // 빛의 감쇠율 (일반적으로 2 사용)
    setLightOption(spotLight2);
    scene.add(spotLight2);
    scene.add(spotLight2.target);
    //scene.add(new THREE.SpotLightHelper(spotLight2));


    // 창문 사각조명
    const rectAreaLight1 = new THREE.RectAreaLight(0xffffff, 4, 1.4, 2);
    rectAreaLight1.position.set(3.1, 2.1, 1.15); // 빛의 위치 설정
    rectAreaLight1.lookAt(-5, 2, 1)
    scene.add(rectAreaLight1);
    //const rectLightHelper = new RectAreaLightHelper(rectAreaLight1);
    // rectAreaLight1.add(rectLightHelper);

    // 문 사각조명
    const rectAreaLight2 = new THREE.RectAreaLight(0xffffff, 2, 1.4, 3);
    rectAreaLight2.position.set(3.1, 1.7, 3.2); // 빛의 위치 설정
    rectAreaLight2.lookAt(-5, 1.7, 3.2)
    scene.add(rectAreaLight2);
    //const rectLightHelper2 = new RectAreaLightHelper(rectAreaLight2);
    //rectAreaLight2.add(rectLightHelper2);


    const innerLight = new THREE.PointLight(0xFFDD99, 8, 8); // 3.6
    innerLight.position.set(1, 2, 2); // 빛의 위치 설정
    innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
    innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
    innerLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
    setLightOption(innerLight);
    scene.add(innerLight);

    // // 문으로 비추는 빛
    // const toDoorLight = new THREE.SpotLight(0xFFDDAA, 100);
    // toDoorLight.position.set(5, 5.5, 4.4); // 빛의 위치 설정
    // toDoorLight.target.position.set(-1, -2.5, 2); // 빛이 향할 위치 설정
    // toDoorLight.angle = Math.PI / 12; // 원뿔의 최대 각도 (라디안)
    // toDoorLight.distance = 8; // 빛의 최대 거리 (0은 무제한)
    // toDoorLight.decay = 1; // 빛의 감쇠율 (일반적으로 2 사용)
    // setLightOption(toDoorLight);
    // scene.add(toDoorLight);
    // scene.add(toDoorLight.target);
    // // const toDoorLightHelper = new THREE.SpotLightHelper(toDoorLight)
    // // scene.add(toDoorLightHelper)
    //
    // // 창문으로 비추는 빛
    // const toWindowLight = new THREE.SpotLight(0xFFDDAA, 100);
    // toWindowLight.position.set(7, 5.5, 3); // 빛의 위치 설정
    // toWindowLight.target.position.set(0, 0, 0); // 빛이 향할 위치 설정
    // toWindowLight.angle = Math.PI / 22; // 원뿔의 최대 각도 (라디안)
    // toWindowLight.distance = 10; // 빛의 최대 거리 (0은 무제한)
    // toWindowLight.decay = 1; // 빛의 감쇠율 (일반적으로 2 사용)
    // setLightOption(toWindowLight);
    // scene.add(toWindowLight);
    // scene.add(toWindowLight.target);
    // // const toWindowLightHelper = new THREE.SpotLightHelper(toWindowLight);
    // // scene.add(toWindowLightHelper);
    //
    // // 오른쪽 측면에서 전체적으로
    // const fromRightLight = new THREE.SpotLight(0xFFF0F7, 200);
    // fromRightLight.position.set(9, 5, 12); // 빛의 위치 설정
    // fromRightLight.target.position.set(-2.5, 0.5, -1); // 빛이 향할 위치 설정
    // fromRightLight.angle = Math.PI / 13; // 원뿔의 최대 각도 (라디안)
    // fromRightLight.distance = 16.5; // 빛의 최대 거리 (0은 무제한)
    // fromRightLight.decay = 1.5; // 빛의 감쇠율 (일반적으로 2 사용)
    // setLightOption(fromRightLight);
    // scene.add(fromRightLight);
    // scene.add(fromRightLight.target);
    // // const fromRightLightHelper = new THREE.SpotLightHelper(fromRightLight);
    // // scene.add(fromRightLightHelper);
    //
    // // 높이서 아래로
    // const fromSkyLight = new THREE.SpotLight(0xffffff, 100);
    // fromSkyLight.position.set(7, 7, 1); // 빛의 위치 설정
    // fromSkyLight.target.position.set(0, 2, 1); // 빛이 향할 위치 설정
    // fromSkyLight.angle = Math.PI / 12; // 원뿔의 최대 각도 (라디안)
    // fromSkyLight.distance = 11; // 빛의 최대 거리 (0은 무제한)
    // fromSkyLight.decay = 0.8; // 빛의 감쇠율 (일반적으로 2 사용)
    // fromSkyLight.shadow.radius = 5;
    // setLightOption(fromSkyLight);
    // scene.add(fromSkyLight);
    // scene.add(fromSkyLight.target);
    // // const fromSkyLightHelper = new THREE.SpotLightHelper(fromSkyLight);
    // // scene.add(fromSkyLightHelper);
    //
    // // 전체를 은은하게 비추는 포인트
    // const ambientPointLight = new THREE.PointLight(0xffffff, 14, 20);
    // ambientPointLight.position.set(1, 10, 2); // 빛의 위치 설정
    // ambientPointLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
    // ambientPointLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
    // ambientPointLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
    // setLightOption(ambientPointLight);
    // scene.add(ambientPointLight);
    // // const ambientPointLightHelper = new THREE.PointLightHelper(ambientPointLight);
    // // scene.add(ambientPointLightHelper);
    //
    // // 모델 내부를 밝히는 조명
    // const innerLight = new THREE.PointLight(0xFFBBCC, 8.5, 6);
    // innerLight.position.set(1, 3, 2); // 빛의 위치 설정
    // innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
    // innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
    // innerLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
    // setLightOption(innerLight);
    // scene.add(innerLight);
    // // const innerLightHelper = new THREE.PointLightHelper(innerLight);
    // // scene.add(innerLightHelper);
}