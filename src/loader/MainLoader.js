// import * as THREE from 'three';
// import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
// import {loadDino} from './Dino';
// import {loadFonts} from './Fonts';
// import {loadRoom} from './Room';
//
// export const targetMeshes = [];
// export const monitorPosition = new THREE.Vector3();
//
// export function modelsLoad(canvas, scene, renderer, camera) {
//     // 로드매니저
//     const loadingManager = new THREE.LoadingManager();
//     loadingManager.onLoad = () => {
//         // 모델링이 로드되면 보이게
//         canvas.style.display = 'block';
//     }
//     const loader = new GLTFLoader(loadingManager);
//
//
//     loadRoom(scene, loader, targetMeshes);
//     loadDino(scene, loader, targetMeshes);
//     loadFonts(scene, targetMeshes);
// }
