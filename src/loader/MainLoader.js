import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
import {loadDino} from './Dino';
import {loadFonts} from './Fonts';
import {loadRoom} from './Room';

export const targetMeshes = [];
export const monitorPosition = new THREE.Vector3();

export function modelsLoad(canvas, scene, cssScene) {
    // 로드매니저 모두 로드되면, display: block
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => canvas.style.display = 'block';

    const loader = new GLTFLoader(loadingManager);

    loadRoom(scene, cssScene, loader, targetMeshes);
    loadDino(scene, loader, targetMeshes);
    loadFonts(scene, targetMeshes);
}
