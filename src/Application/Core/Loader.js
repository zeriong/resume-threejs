import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';

// loadingManager 적용을 위한 loader 클래스
export default class Loader {
    constructor() {
        // 로딩매니저 & gltf, font 로더
        this.loadingManager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.loadingManager);
        this.fontLoader = new FontLoader(this.loadingManager);

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
        // 로딩 시 보여 줄 목록
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

        // 모델링이 하나씩 로드 될 때마다 실행
        // ( item: 로드중인 타겟, loaded: 로드된 개수, total: 로드 아이템 총 개수 )
        this.loadingManager.onProgress = (item, loaded) => {
            // 지연로드로 인한 total변경 가능성으로 itemList length로 total 선언
            const total = itemList.length;
            const itemEl = document.createElement('li');
            const progressEl = document.createElement('li');

            // 로딩된 아이템의 이름, 로드 퍼센트 입력
            const random = Math.floor(Math.abs(Math.random() * 10 - 1));
            const percent = Math.floor(loaded / total * 100);
            const progress = (random + percent) > 100 ? 100 : (random + percent);
            itemEl.innerHTML = itemList[loaded - 1];
            progressEl.innerHTML = `...  ${progress}%`;
            // 지정 요소에 삽입
            loadingItem.appendChild(itemEl);
            progressPercent.appendChild(progressEl);
            // 로드가 완료되면 메시지 내용 변경
            if (loaded === total) {
                loadingTitle.innerHTML = 'FINISHED LOADING RESOURCES';
                loadingTitle.style.color = '#00FF00';
                loadingConsole.style.display = 'none';
                loadedConsole.style.display = 'block';
                // 일정시간 지난 후 start 버튼으로 이동
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                    loadedMessage.style.display = 'flex';
                }, 1700);
            }
        };
    }
}