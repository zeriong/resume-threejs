import Application from '../Application';
import * as THREE from 'three';
import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer';

export default class Room {
    constructor() {
        const app = Application.getInstance();
        this.sizes = app.sizes;
        this.contentSizes = this.sizes.roomSizes;
        this.initScale = this.sizes.roomInitScale; // html 삽입된 mesh의 규격 scale
        this.loader = app.loader;
        this.intersectsMeshes = app.intersectsMeshes; // raycaster 감지 배열
        this.scene = app.scene;
        this.cssScene = app.cssScene;

        this.projectsPosition = new THREE.Vector3();
        this.historyPosition = new THREE.Vector3();
        this.skillsPosition = new THREE.Vector3();
        this.posterPosition = new THREE.Vector3();

        this.loadRoom();
    }

    loadRoom() {
        this.loader.gltfLoader.load('/assets/models/room.glb', (glb) => {
            const model = glb.scene;
            model.castShadow = true;
            model.rotation.y = THREE.MathUtils.degToRad(-90);
            model.position.z = 2;
            model.position.x = 1;

            // 모델링에 포함된 모든 mesh의 그림자 표현
            model.traverse(child => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    // 블라인드, 연출을 위해 블라인드의 그림자 생성 제외
                    if (child.name === 'Plane089' || child.name === 'Plane090') {
                        child.material.transparent = true;
                        child.material.opacity = 0.9;
                        child.receiveShadow = true;
                    } else {
                        // 블라인드 외의 mesh는 그림자 생성
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }

                    // 모니터 스크린
                    if (child.name === 'Plane202_3') {
                        child.getWorldPosition(this.projectsPosition);

                        // iframe 생성
                        const iframe = document.createElement('iframe');
                        iframe.src = './pages/projects.html';
                        iframe.style.width = this.contentSizes.monitor.width + 'px';
                        iframe.style.height = this.contentSizes.monitor.height + 'px';
                        iframe.style.boxSizing = 'border-box';
                        iframe.style.opacity = '1';

                        // CSS3DObject 생성
                        const cssObj = new CSS3DObject(iframe);
                        cssObj.name = 'monitor';
                        cssObj.position.x = this.projectsPosition.x;
                        cssObj.position.y = this.projectsPosition.y + 0.115;
                        cssObj.position.z = this.projectsPosition.z + 0.026;
                        cssObj.scale.set(...this.initScale);

                        // HTML 상호작용을 위한 element이며 반드시 카메라가 앞면을 마주보고 있어야 상호작용 가능
                        // const htmlActionDom = cssDomEl.querySelector('div > div > div').children[0];

                        this.cssScene.add(cssObj);

                        // CSS3DObject를 표현하기 위한 Mesh
                        const geometry = new THREE.PlaneGeometry(this.contentSizes.monitor.width, this.contentSizes.monitor.height);
                        const material = new THREE.MeshLambertMaterial();
                        material.side = THREE.DoubleSide;
                        material.opacity = 0;
                        material.transparent = true;
                        material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                        material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                        material.emissiveIntensity = 0;  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.position.x = this.projectsPosition.x;
                        mesh.position.y = this.projectsPosition.y + 0.115;
                        mesh.position.z = this.projectsPosition.z + 0.028;
                        mesh.scale.set(...this.initScale);
                        mesh.name = 'projects';
                        this.scene.add(mesh);

                        child.name = 'projects';
                    }

                    // "Poster" 액자
                    if (child.name === 'Plane221_1') {
                        child.getWorldPosition(this.posterPosition);

                        const setPosition = [this.posterPosition.x, this.posterPosition.y, this.posterPosition.z + 0.049];

                        // texture img
                        const textureLoad = new THREE.TextureLoader();
                        const texture = textureLoad.load('/assets/images/dragonBall.png');
                        const geometry = new THREE.PlaneGeometry(this.contentSizes.poster.width, this.contentSizes.poster.height);
                        const material = new THREE.MeshBasicMaterial({ map: texture });
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.position.set(...setPosition);
                        mesh.scale.set(...this.initScale);
                        mesh.name = 'poster';
                        this.scene.add(mesh);

                        child.name = 'poster';
                    }

                    // "history" 액자
                    if (child.name === 'Plane218_1') {
                        child.getWorldPosition(this.historyPosition);

                        const setPosition = [this.historyPosition.x, this.historyPosition.y, this.historyPosition.z + 0.02];

                        // htmls 생성
                        const historyEl = document.createElement('iframe');
                        historyEl.src = './pages/history.html'
                        historyEl.style.width = this.contentSizes.history.width + 'px';
                        historyEl.style.height = this.contentSizes.history.height + 'px';
                        historyEl.style.overflow = 'scroll';
                        historyEl.style.boxSizing = 'border-box';
                        historyEl.style.opacity = '1';

                        // CSS3DObject 생성
                        const cssObj = new CSS3DObject(historyEl);
                        cssObj.name = 'history';
                        cssObj.position.set(...setPosition);
                        cssObj.scale.set(...this.initScale);
                        this.cssScene.add(cssObj);

                        // CSS3DObject를 표현하기 위한 Mesh
                        const geometry = new THREE.PlaneGeometry(this.contentSizes.history.width, this.contentSizes.history.height);
                        const material = new THREE.MeshLambertMaterial();
                        material.side = THREE.DoubleSide;
                        material.opacity = 0;
                        material.transparent = true;
                        material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                        material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                        material.emissiveIntensity = 0  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.position.set(...setPosition);
                        mesh.scale.set(...this.initScale);
                        mesh.name = 'history';
                        this.scene.add(mesh);

                        child.name = 'history';
                    }

                    // "Skills" 액자
                    if (child.name === 'Plane220_1') {
                        const scale = new THREE.Vector3();
                        child.getWorldPosition(this.skillsPosition);
                        child.getWorldScale(scale);

                        const setPosition = [this.skillsPosition.x, this.skillsPosition.y, this.skillsPosition.z + 0.02];

                        // htmls 생성
                        const skillsEl = document.createElement('iframe');
                        skillsEl.src = './pages/skills.html';
                        skillsEl.style.width = this.contentSizes.skills.width + 'px';
                        skillsEl.style.height = this.contentSizes.skills.height + 'px';
                        skillsEl.style.overflow = 'scroll';
                        skillsEl.style.boxSizing = 'border-box';
                        skillsEl.style.opacity = '1';

                        // CSS3DObject 생성
                        const cssObj = new CSS3DObject(skillsEl);
                        cssObj.name = 'skills';
                        cssObj.position.set(...setPosition);
                        cssObj.scale.set(...this.initScale);
                        this.cssScene.add(cssObj);

                        // CSS3DObject를 표현하기 위한 Mesh
                        const geometry = new THREE.PlaneGeometry(this.contentSizes.skills.width, this.contentSizes.skills.height);
                        const material = new THREE.MeshLambertMaterial();
                        material.side = THREE.DoubleSide;
                        material.opacity = 0;
                        material.transparent = true;
                        material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                        material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                        material.emissiveIntensity = 0  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.position.set(...setPosition);
                        mesh.scale.set(...this.initScale);
                        mesh.name = 'skills';
                        this.scene.add(mesh);

                        child.name = 'skills';
                    }

                    // 후면 허리 받침 기둥
                    if (child.name === 'Plane193') {
                        child.name = 'chair1';
                        child.material.transparent = true;
                        child.material.opacity = 1;
                        this.intersectsMeshes.push(child);
                    }
                    // 등받이 테두리
                    if (child.name === 'Plane207_1') {
                        child.name = 'chair2';
                        child.material.transparent = true;
                        child.material.opacity = 1;
                        this.intersectsMeshes.push(child);
                    }
                    // 등받이 + 팔걸이 밑단
                    if (child.name === 'Plane207_2') {
                        child.name = 'chair3';
                        child.material.transparent = true;
                        child.material.opacity = 1;
                        this.intersectsMeshes.push(child);
                    }

                    child.material = new THREE.MeshPhysicalMaterial({
                        color: child.material.color,
                        map: child.material.map,
                        normalMap: child.material.normalMap,
                        toneMapped: child.material.toneMapped,
                        emissive: child.material.emissive,
                        emissiveMap: child.material.emissiveMap,
                        emissiveIntensity: child.material.emissiveIntensity,
                        opacity: child.material.opacity,
                        transparent: child.material.transparent,
                        side: child.material.side,
                        depthTest: child.material.depthTest,
                        depthWrite: child.material.depthWrite,
                        vertexColors: child.material.vertexColors,
                        userData: child.material.userData,
                        flatShading: false,
                    });

                    this.intersectsMeshes.push(child);
                }
            });
            this.scene.add(model);
        })
    }
}