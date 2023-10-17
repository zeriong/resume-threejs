// import * as THREE from 'three';
// import {lgPosterTexture, mdPosterTexture, monitorTexture, smPosterTexture} from '../common/canvases';
//
// // Floor
// export const floorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
// export const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xe8eaff });
//
// // Floor2
// export const floor2Geometry = new THREE.PlaneGeometry(7, 7, 10, 10);
// export const floor2Material = new THREE.MeshStandardMaterial({ color: 'red' });
//
// // Monitor
// export const monitorGeometry = new THREE.PlaneGeometry(0.88, 0.437, 1);
// export const monitorMaterial = new THREE.MeshStandardMaterial({
//     // color: 'white',
//     side: THREE.DoubleSide,
//     map: monitorTexture,
// });
//
// // Lg Poster
// export const lgPosterGeometry = new THREE.PlaneGeometry(0.995, 1.228, 1);
// export const lgPosterMaterial = new THREE.MeshStandardMaterial({
//     // color: 'white',
//     side: THREE.DoubleSide,
//     map: lgPosterTexture,
// });
//
// // Md Poster
// export const mdPosterGeometry = new THREE.PlaneGeometry(0.88, 0.437, 1);
// export const mdPosterMaterial = new THREE.MeshStandardMaterial({
//     // color: 'white',
//     side: THREE.DoubleSide,
//     map: mdPosterTexture,
// });
//
// // Sm Poster
// export const smPosterGeometry = new THREE.PlaneGeometry(0.88, 0.437, 1);
// export const smPosterMaterial = new THREE.MeshStandardMaterial({
//     // color: 'white',
//     side: THREE.DoubleSide,
//     map: smPosterTexture,
// });
//
// // 빛 가루 파티클
// export const particleGeometry = new THREE.BufferGeometry();
// const particlesCount = 60;
// const positions = new Float32Array(particlesCount * 3);
// for(let i = 0; i < particlesCount * 3; i += 3) {
//     positions[i] = (Math.random() - 0.5) * 5;
//     positions[i + 1] = Math.random() * 8;  // 높이 0 ~ 8
//     positions[i + 2] = (Math.random() - 0.5) * 5;
// }
// particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// export const particleMaterial = new THREE.PointsMaterial({
//     size: 0.05,
//     blending: THREE.AdditiveBlending,  // 산술 블렌딩을 사용하여 빛의 누적 효과를 만듭니다
//     transparent: true,
//     color: 0xffff00  // 노란색 빛으로 설정
// });
// // 빛 가루 이벤트
// export const runLightParticle = () => {
//     const positions = particleGeometry.attributes.position.array;
//     for(let i = 0; i < positions.length; i += 3) {
//         positions[i + 1] -= 0.0075;  // 천천히 아래로 이동
//         if (positions[i + 1] < 0) positions[i + 1] = 5;
//     }
//     particleGeometry.attributes.position.needsUpdate = true;  // 위치 업데이트
// }
