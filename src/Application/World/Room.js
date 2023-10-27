import Application from '../Application';
import * as THREE from 'three';
import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer';

export default class Room {
    constructor() {
        const app = Application.getInstance();
        this.sizes = app.sizes;
        this.contentSizes = this.sizes.roomSizes;
        this.initScale = this.sizes.roomInitScaleArr;
        this.loader = app.loader;
        this.intersectsMeshes = app.intersectsMeshes;
        this.scene = app.scene;
        this.cssScene = app.cssScene;

        this.projectsPosition = new THREE.Vector3();
        this.learningPosition = new THREE.Vector3();
        this.skillsPosition = new THREE.Vector3();
        this.posterPosition = new THREE.Vector3();

        this.loadRoom();
    }

    loadRoom() {
        this.loader.gltfLoader.load('/models/room.glb', (glb) => {
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

                        // html의 바탕이 될 container
                        const container = document.createElement('div');
                        container.style.width = this.contentSizes.monitor.width + 'px';
                        container.style.height = this.contentSizes.monitor.height + 'px';
                        container.style.opacity = '1';

                        // iframe 생성
                        const iframe = document.createElement('iframe');
                        iframe.src = './htmls/projects.html';
                        iframe.style.width = this.contentSizes.monitor.width + 'px';
                        iframe.style.height = this.contentSizes.monitor.height + 'px';
                        iframe.style.boxSizing = 'border-box';
                        iframe.style.opacity = '1';

                        // CSS3DObject 생성
                        const cssObj = new CSS3DObject(iframe);
                        cssObj.name = 'monitor';
                        cssObj.position.x = this.projectsPosition.x;
                        cssObj.position.y = this.projectsPosition.y + 0.066;
                        cssObj.position.z = this.projectsPosition.z + 0.026;
                        cssObj.scale.set(...this.initScale);

                        // HTML 상호작용을 위한 element이며 반드시 카메라가 앞면을 마주보고 있어야 상호작용 가능
                        // const htmlActionDom = cssDomEl.querySelector('div > div > div').children[0];

                        container.appendChild(iframe);
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
                        mesh.position.y = this.projectsPosition.y + 0.066;
                        mesh.position.z = this.projectsPosition.z + 0.026;
                        mesh.scale.set(...this.initScale);
                        mesh.name = 'projects';
                        this.scene.add(mesh);

                        // todo: 작업 완료 시 삭제
                        // camera.position.set(monitorPosition.x + 0.08, monitorPosition.y, monitorPosition.z + 1)
                        // controls.target.set(monitorPosition.x, monitorPosition.y, -3)
                        // scene.add(camera);

                        child.name = 'projects';
                    }

                    // "Poster" 액자
                    if (child.name === 'Plane221_1') {
                        child.getWorldPosition(this.posterPosition);

                        const setPosition = [this.posterPosition.x, this.posterPosition.y, this.posterPosition.z + 0.049];

                        // htmls 생성
                        const posterEl = document.createElement('iframe');
                        posterEl.src = './htmls/poster.html';
                        posterEl.style.width = this.contentSizes.poster.width + 'px';
                        posterEl.style.height = this.contentSizes.poster.height + 'px';
                        posterEl.style.overflow = 'scroll';
                        posterEl.style.boxSizing = 'border-box';
                        posterEl.style.opacity = '1';

                        // CSS3DObject 생성
                        const cssObj = new CSS3DObject(posterEl);
                        cssObj.name = 'learning';
                        cssObj.position.set(...setPosition);
                        cssObj.scale.set(...this.initScale);
                        this.cssScene.add(cssObj);

                        // CSS3DObject를 표현하기 위한 Mesh
                        const geometry = new THREE.PlaneGeometry(this.contentSizes.poster.width, this.contentSizes.poster.height);
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
                        mesh.name = 'projects';
                        this.scene.add(mesh);

                        child.name = 'poster';
                    }

                    // "Learning" 액자
                    if (child.name === 'Plane218_1') {
                        child.getWorldPosition(this.learningPosition);

                        const setPosition = [this.learningPosition.x, this.learningPosition.y, this.learningPosition.z + 0.02];

                        // htmls 생성
                        const learningEl = document.createElement('iframe');
                        learningEl.src = './htmls/learning.html'
                        learningEl.style.width = this.contentSizes.learning.width + 'px';
                        learningEl.style.height = this.contentSizes.learning.height + 'px';
                        learningEl.style.overflow = 'scroll';
                        learningEl.style.boxSizing = 'border-box';
                        learningEl.style.opacity = '1';

                        // CSS3DObject 생성
                        const cssObj = new CSS3DObject(learningEl);
                        cssObj.name = 'learning';
                        cssObj.position.set(...setPosition);
                        cssObj.scale.set(...this.initScale);
                        this.cssScene.add(cssObj);

                        // CSS3DObject를 표현하기 위한 Mesh
                        const geometry = new THREE.PlaneGeometry(this.contentSizes.learning.width, this.contentSizes.learning.height);
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
                        mesh.name = 'learning';
                        this.scene.add(mesh);

                        child.name = 'learning';
                    }

                    // "Skills" 액자
                    if (child.name === 'Plane220_1') {
                        child.getWorldPosition(this.skillsPosition);

                        const setPosition = [this.skillsPosition.x, this.skillsPosition.y, this.skillsPosition.z + 0.02];

                        // htmls 생성
                        const skillsEl = document.createElement('iframe');
                        skillsEl.src = './htmls/skills.html';
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

                    // 거울
                    if (child.name === 'Plane219_1') {
                        // const pos = new THREE.Vector3();
                        // const scale = new THREE.Vector3();
                        // node.getWorldPosition(pos);
                        // node.getWorldScale(scale);
                        //
                        // node.material.opacity = 0;
                        //
                        // // geometry 생성
                        // const mirrorGeometry = new THREE.PlaneGeometry(0.7, 0.7);
                        //
                        // // Reflector를 만들고 설정
                        // const mirror = new Reflector(mirrorGeometry, {
                        //     textureWidth: window.innerWidth * window.devicePixelRatio,
                        //     textureHeight: window.innerHeight * window.devicePixelRatio,
                        //     clipBias: 0.003,
                        //     color: 0x777777
                        // });
                        // mirror.rotation.z = THREE.MathUtils.degToRad(-90);
                        // mirror.rotation.y = THREE.MathUtils.degToRad(-90);
                        // // mirror.rotation.x = THREE.MathUtils.degToRad(90);
                        // mirror.position.set(pos.x - 0.027, pos.y, pos.z);
                        // mirror.scale.set(scale.x, scale.y, scale.z);
                        //
                        // scene.add(mirror);

                        child.name = 'mirror';
                    }

                    // 후면 허리 받침 기둥
                    if (child.name === 'Plane193') {
                        child.name = 'chair1';
                        this.intersectsMeshes.push(child);
                    }
                    // 등받이 테두리
                    if (child.name === 'Plane207_1') {
                        child.name = 'chair2';
                        this.intersectsMeshes.push(child);
                    }
                    // 등받이 + 팔걸이 밑단
                    if (child.name === 'Plane207_2') {
                        child.name = 'chair3';
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