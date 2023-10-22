import * as THREE from 'three';
import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer';
import {camera, controls} from '../main';
import {Reflector} from 'three/addons/objects/Reflector';

const setScale = (val) => new Array(3).fill(val);  // x, y, z
export const monitorPosition = new THREE.Vector3();
const SCALE = 0.001;

export function loadRoom(scene, cssScene, cssDomEl, loader, targetMeshes) {
    // Room 로드
    loader.load('/models/room.glb', (glb) => {
        const model = glb.scene;
        model.castShadow = true;
        model.rotation.y = THREE.MathUtils.degToRad(-90);
        model.position.z = 2;
        model.position.x = 1;
        console.log('모델입니다', model);

        // 모델링에 포함된 모든 mesh의 그림자 표현
        model.traverse(node => {
            if (node instanceof THREE.Mesh && node.material instanceof THREE.MeshStandardMaterial) {
                // 블라인드
                if (node.name === 'Plane089' || node.name === 'Plane090') {
                    node.material.transparent = true;
                    node.material.opacity = 0.9;
                    node.receiveShadow = true;  // 연출을 위해 블라인드의 그림자 생성 제외
                } else {
                    node.receiveShadow = true;
                    node.castShadow = true;
                }

                // 모니터 스크린
                if (node.name === 'Plane202_3') {
                    const SIZE = { w: 879, h: 438 };
                    node.getWorldPosition(monitorPosition);

                    // html의 바탕이 될 container
                    const container = document.createElement('div');
                    container.style.width = SIZE.w + 'px';
                    container.style.height = SIZE.h + 'px';
                    container.style.opacity = '1';

                    // iframe 생성
                    const iframe = document.createElement('iframe');
                    iframe.src = './content/projects.html';
                    iframe.style.width = SIZE.w + 'px';
                    iframe.style.height = SIZE.h + 'px';
                    iframe.style.boxSizing = 'border-box';
                    iframe.style.opacity = '1';
                    iframe.className = 'monitor';
                    iframe.id = 'screen';
                    iframe.title = 'screen';

                    // CSS3DObject 생성
                    const cssObj = new CSS3DObject(iframe);
                    cssObj.name = 'monitor';
                    cssObj.position.x = monitorPosition.x;
                    cssObj.position.y = monitorPosition.y + 0.066;
                    cssObj.position.z = monitorPosition.z + 0.026;
                    cssObj.scale.set(...setScale(SCALE));

                    // HTML 상호작용을 위한 element이며 반드시 카메라가 앞면을 마주보고 있어야 상호작용 가능
                    // const htmlActionDom = cssDomEl.querySelector('div > div > div').children[0];

                    container.appendChild(iframe);
                    cssScene.add(cssObj);

                    // CSS3DObject를 표현하기 위한 Mesh
                    const geometry = new THREE.PlaneGeometry(SIZE.w, SIZE.h);
                    const material = new THREE.MeshLambertMaterial();
                    material.side = THREE.DoubleSide;
                    material.opacity = 0;
                    material.transparent = true;
                    material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                    material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                    material.emissiveIntensity = 0;  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = monitorPosition.x;
                    mesh.position.y = monitorPosition.y + 0.066;
                    mesh.position.z = monitorPosition.z + 0.026;
                    mesh.scale.set(...setScale(SCALE));
                    mesh.name = 'monitor';
                    scene.add(mesh);

                    // todo: 작업 완료 시 삭제
                    // camera.position.set(monitorPosition.x + 0.08, monitorPosition.y, monitorPosition.z + 1)
                    // controls.target.set(monitorPosition.x, monitorPosition.y, -3)
                    // scene.add(camera);

                    node.name = 'monitor';
                }

                // "Poster" 액자
                if (node.name === 'Plane221_1') {
                    const SCREEN = { w: 980, h: 1210 };
                    const pos = new THREE.Vector3();

                    node.getWorldPosition(pos);

                    const setPos = [pos.x, pos.y, pos.z + 0.049];

                    // content 생성
                    const posterEl = document.createElement('iframe');
                    posterEl.src = './content/poster.html';
                    posterEl.style.width = SCREEN.w + 'px';
                    posterEl.style.height = SCREEN.h + 'px';
                    posterEl.style.overflow = 'scroll';
                    posterEl.style.boxSizing = 'border-box';
                    posterEl.style.opacity = '1';

                    // CSS3DObject 생성
                    const cssObj = new CSS3DObject(posterEl);
                    cssObj.name = 'learning';
                    cssObj.position.set(...setPos);
                    cssObj.scale.set(...setScale(SCALE));
                    cssScene.add(cssObj);

                    // CSS3DObject를 표현하기 위한 Mesh
                    const geometry = new THREE.PlaneGeometry(SCREEN.w, SCREEN.h);
                    const material = new THREE.MeshLambertMaterial();
                    material.side = THREE.DoubleSide;
                    material.opacity = 0;
                    material.transparent = true;
                    material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                    material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                    material.emissiveIntensity = 0  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(...setPos);
                    mesh.scale.set(...setScale(SCALE));
                    mesh.name = 'monitor';
                    scene.add(mesh);

                    node.name = 'poster';
                }

                // "Learning" 액자
                if (node.name === 'Plane218_1') {
                    const SCREEN = { w: 520, h: 740 };
                    const pos = new THREE.Vector3();
                    node.getWorldPosition(pos);

                    const setPos = [pos.x, pos.y, pos.z + 0.02];

                    // content 생성
                    const learningEl = document.createElement('iframe');
                    learningEl.src = './content/learning.html'
                    learningEl.style.width = SCREEN.w + 'px';
                    learningEl.style.height = SCREEN.h + 'px';
                    learningEl.style.overflow = 'scroll';
                    learningEl.style.boxSizing = 'border-box';
                    learningEl.style.opacity = '1';

                    // CSS3DObject 생성
                    const cssObj = new CSS3DObject(learningEl);
                    cssObj.name = 'learning';
                    cssObj.position.set(...setPos);
                    cssObj.scale.set(...setScale(SCALE));
                    cssScene.add(cssObj);

                    // CSS3DObject를 표현하기 위한 Mesh
                    const geometry = new THREE.PlaneGeometry(SCREEN.w, SCREEN.h);
                    const material = new THREE.MeshLambertMaterial();
                    material.side = THREE.DoubleSide;
                    material.opacity = 0;
                    material.transparent = true;
                    material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                    material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                    material.emissiveIntensity = 0  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(...setPos);
                    mesh.scale.set(...setScale(SCALE));
                    mesh.name = 'learning';
                    scene.add(mesh);

                    node.name = 'learning';
                }

                // "Skills" 액자
                if (node.name === 'Plane220_1') {
                    const SCREEN = { w: 553, h: 333 };
                    const pos = new THREE.Vector3();
                    node.getWorldPosition(pos);

                    const setPos = [pos.x, pos.y, pos.z + 0.02];

                    // content 생성
                    const skillsEl = document.createElement('iframe');
                    skillsEl.src = './content/skills.html'
                    skillsEl.style.width = SCREEN.w + 'px';
                    skillsEl.style.height = SCREEN.h + 'px';
                    skillsEl.style.overflow = 'scroll';
                    skillsEl.style.boxSizing = 'border-box';
                    skillsEl.style.opacity = '1';

                    // CSS3DObject 생성
                    const cssObj = new CSS3DObject(skillsEl);
                    cssObj.name = 'skills';
                    cssObj.position.set(...setPos);
                    cssObj.scale.set(...setScale(SCALE));
                    cssScene.add(cssObj);

                    // CSS3DObject를 표현하기 위한 Mesh
                    const geometry = new THREE.PlaneGeometry(SCREEN.w, SCREEN.h);
                    const material = new THREE.MeshLambertMaterial();
                    material.side = THREE.DoubleSide;
                    material.opacity = 0;
                    material.transparent = true;
                    material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                    material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                    material.emissiveIntensity = 0  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(...setPos);
                    mesh.scale.set(...setScale(SCALE));
                    mesh.name = 'skills';
                    scene.add(mesh);

                    node.name = 'skills';
                }

                // 거울
                if (node.name === 'Plane219_1') {
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

                    node.name = 'mirror';
                }

                node.material = new THREE.MeshPhysicalMaterial({
                    color: node.material.color,
                    map: node.material.map,
                    normalMap: node.material.normalMap,
                    toneMapped: node.material.toneMapped,
                    emissive: node.material.emissive,
                    emissiveMap: node.material.emissiveMap,
                    emissiveIntensity: node.material.emissiveIntensity,
                    opacity: node.material.opacity,
                    transparent: node.material.transparent,
                    side: node.material.side,
                    depthTest: node.material.depthTest,
                    depthWrite: node.material.depthWrite,
                    vertexColors: node.material.vertexColors,
                    userData: node.material.userData,
                    flatShading: false,
                    //shininess: 1000,
                    //specular  : 30,
                });

                targetMeshes.push(node);
            }
        });
        scene.add(model);
    });
}