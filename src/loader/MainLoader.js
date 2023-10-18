import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
import {loadDino} from './Dino';
import {loadFonts} from './Fonts';
import {loadRoom} from './Room';

export const targetMeshes = [];

export function modelsLoad(webgl, scene, cssScene, cssDomEl) {
    // 로드매니저 모두 로드되면, display: block
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => webgl.style.display = 'block';

    const loader = new GLTFLoader(loadingManager);

    loadRoom(scene, cssScene, cssDomEl, loader, targetMeshes);
    loadDino(scene, loader, targetMeshes);
    loadFonts(scene, targetMeshes);
}
