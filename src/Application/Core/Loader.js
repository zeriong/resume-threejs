import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';

// loadingManager 적용을 위한 loader 클래스 // todo: 로딩매니저를 통한 loading화면 개발
export default class Loader {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.fontLoader = new FontLoader(this.loadingManager);
    }
}