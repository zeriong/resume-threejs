import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
import {FBXLoader} from "three/addons/loaders/FBXLoader";

// loadingManager 적용을 위한 loader 클래스
export default class Loader {
    constructor() {
        // 로딩매니저
        this.loadingManager = new THREE.LoadingManager();

        // 로딩 매니저를 통한 로더 생성
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.fbxLoader = new FBXLoader(this.loadingManager);
        this.fontLoader = new FontLoader(this.loadingManager);
        this.audioLoader = new THREE.AudioLoader(this.loadingManager);
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);

        this.loading();
    }

    loading() {
        // loading element
        const loadingItem = document.querySelector('#loadingItem');
        const progressPercent = document.querySelector('#progressPercent');
        const loadingTitle = document.querySelector('#loadingTitle');
        const loadedConsole = document.querySelector('#loadedConsole');
        const loadingConsole = document.querySelector('#loadingConsole');
        const loadingContainer = document.querySelector('#loadingContainer');
        const loadedMessage = document.querySelector('#loadedMessage');

        let prevLoadedUrl = '';

        // 모델링이 하나씩 로드 될 때마다 실행
        // ( item: 로드중인 타겟, loaded: 로드된 개수, total: 로드 아이템 총 개수 )
        this.loadingManager.onProgress = (url, loaded, itemsTotal) => {
            // 오류 등으로 인한 중복 로드 표기 방지
            if (prevLoadedUrl != url) {
                const itemEl = document.createElement('li');
                const progressEl = document.createElement('li');

                const percentComplete = (loaded / itemsTotal * 100).toFixed(2);
                itemEl.innerHTML = url.split('/').pop()
                progressEl.innerHTML = `...  ${percentComplete}%`

                // 지정 요소에 삽입
                loadingItem.appendChild(itemEl);
                progressPercent.appendChild(progressEl);

                console.log(url)

                prevLoadedUrl = url
            }
        };

        // 로딩 완료
        this.loadingManager.onLoad = () => {
            loadingTitle.innerHTML = 'FINISHED LOADING RESOURCES';
            loadingTitle.style.color = '#00FF00';
            loadingConsole.style.display = 'none';
            loadedConsole.style.display = 'block';
            // 일정시간 지난 후 start 버튼으로 이동
            setTimeout(() => {
                loadingContainer.style.display = 'none';
                loadedMessage.style.display = 'flex';
            }, 1700);
        };
    }
}