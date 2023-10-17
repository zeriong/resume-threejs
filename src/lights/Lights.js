// import * as THREE from 'three';
//
// export const setLights = (scene) => {
//     // 조명 전체 세팅 함수
//     const setLightOption = (light) => {
//         light.penumbra = 1; // 부드러운 경계
//         light.castShadow = true;
//         light.shadow.radius = 100
//         light.shadow.mapSize.set(2048, 2048);
//         light.shadow.camera.near = 0.1;
//         light.shadow.camera.far = 1000;
//         light.shadow.bias = -0.001
//         light.shadow.blurSamples = 20;
//     }
//
//     // 문으로 비추는 빛
//     const toDoorLight = new THREE.SpotLight(0xFFDDAA, 100);
//     toDoorLight.position.set(2.4, 5.5, -4); // 빛의 위치 설정
//     toDoorLight.target.position.set(0, -2.5, 2); // 빛이 향할 위치 설정
//     toDoorLight.angle = Math.PI / 12; // 원뿔의 최대 각도 (라디안)
//     toDoorLight.distance = 8; // 빛의 최대 거리 (0은 무제한)
//     toDoorLight.decay = 1; // 빛의 감쇠율 (일반적으로 2 사용)
//     setLightOption(toDoorLight);
//     scene.add(toDoorLight);
//     scene.add(toDoorLight.target);
//
//     // 창문으로 비추는 빛
//     const toWindowLight = new THREE.SpotLight(0xFFDDAA, 100);
//     toWindowLight.position.set(1, 5.5, -6); // 빛의 위치 설정
//     toWindowLight.target.position.set(-2, 0, 1); // 빛이 향할 위치 설정
//     toWindowLight.angle = Math.PI / 22; // 원뿔의 최대 각도 (라디안)
//     toWindowLight.distance = 10; // 빛의 최대 거리 (0은 무제한)
//     toWindowLight.decay = 1; // 빛의 감쇠율 (일반적으로 2 사용)
//     setLightOption(toWindowLight);
//     scene.add(toWindowLight);
//     scene.add(toWindowLight.target);
//
//     // 오른쪽 측면에서 전체적으로
//     const fromRightLight = new THREE.SpotLight(0xFFF0F7, 200);
//     fromRightLight.position.set(10, 5, -8); // 빛의 위치 설정
//     fromRightLight.target.position.set(-3.0, 0.5, 3.5); // 빛이 향할 위치 설정
//     fromRightLight.angle = Math.PI / 13; // 원뿔의 최대 각도 (라디안)
//     fromRightLight.distance = 16.5; // 빛의 최대 거리 (0은 무제한)
//     fromRightLight.decay = 1.5; // 빛의 감쇠율 (일반적으로 2 사용)
//     setLightOption(fromRightLight);
//     scene.add(fromRightLight);
//     scene.add(fromRightLight.target);
//
//     // 높이서 아래로
//     const fromSkyLight = new THREE.SpotLight(0xffffff, 100);
//     fromSkyLight.position.set(-1, 7, -6); // 빛의 위치 설정
//     fromSkyLight.target.position.set(-1, 2, 1); // 빛이 향할 위치 설정
//     fromSkyLight.angle = Math.PI / 12; // 원뿔의 최대 각도 (라디안)
//     fromSkyLight.distance = 11; // 빛의 최대 거리 (0은 무제한)
//     fromSkyLight.decay = 0.8; // 빛의 감쇠율 (일반적으로 2 사용)
//     fromSkyLight.shadow.radius = 5;
//     setLightOption(fromSkyLight);
//     scene.add(fromSkyLight);
//     scene.add(fromSkyLight.target);
//
//     // 전체를 은은하게 비추는 포인트
//     const ambientPointLight = new THREE.PointLight(0xffffff, 14, 20);
//     ambientPointLight.position.set(0, 10, 0); // 빛의 위치 설정
//     ambientPointLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
//     ambientPointLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
//     ambientPointLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
//     setLightOption(ambientPointLight);
//     scene.add(ambientPointLight);
//
//     // 모델 내부를 밝히는 조명
//     const innerLight = new THREE.PointLight(0xFFBBCC, 8.5, 6);
//     innerLight.position.set(0, 3, 0); // 빛의 위치 설정
//     innerLight.angle = Math.PI / 8; // 원뿔의 최대 각도 (라디안)
//     innerLight.distance = 0; // 빛의 최대 거리 (0은 무제한)
//     innerLight.decay = 2; // 빛의 감쇠율 (일반적으로 2 사용)
//     setLightOption(innerLight);
//     scene.add(innerLight);
// }