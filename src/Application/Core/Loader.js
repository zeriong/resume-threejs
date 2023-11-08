import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
import Application from '../Application';

// loadingManager 적용을 위한 loader 클래스 // todo: 로딩매니저를 통한 loading화면 개발
export default class Loader {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.fontLoader = new FontLoader(this.loadingManager);

        this.loading();
    }

    loading() {
        const loadingItem = document.querySelector('#loadingItem');
        const progressPercent = document.querySelector('#progressPercent');
        const loadingTitle = document.querySelector('#loadingTitle');
        const loadedConsole = document.querySelector('#loadedConsole');
        const loadingConsole = document.querySelector('#loadingConsole');
        const loadingContainer = document.querySelector('#loadingContainer');
        const loadedMessage = document.querySelector('#loadedMessage');

        const itemList = [
            "dino.glb",
            "dino_option",
            "Pretendard_Bold.json",
            "Pretendard_Regular.json",
            "blob:d12eca61-fa82...",
            "blob:47e8e17b-73cb...",
            "blob:abe2ce90-1b69...",
            "blob:b48b850c-71e3...",
            "room.glb",
            "room_option",
        ]

        this.loadingManager.onProgress = (item, loaded, total) => {
            const itemEl = document.createElement('li');
            const progressEl = document.createElement('li');

            itemEl.innerHTML = itemList[loaded - 1];
            progressEl.innerHTML = `...  ${(loaded / total * 100).toFixed(0)}%`;

            loadingItem.appendChild(itemEl);
            progressPercent.appendChild(progressEl);

            if (loaded === total) {
                loadingTitle.innerHTML = 'FINISHED LOADING RESOURCES';
                loadingTitle.style.color = '#00FF00';
                loadingConsole.style.display = 'none';
                loadedConsole.style.display = 'block';

                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                    loadedMessage.style.display = 'flex';
                }, 1700);
            }
        };
    }
}