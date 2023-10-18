import * as THREE from 'three';
import {lgPosterMaterial, mdPosterMaterial, monitorMaterial, smPosterMaterial} from '../meshes/Meshes';
import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer';

export const SCREEN_SIZE = { w: 879, h: 438 };
const CSS_SCALE = new Array(3).fill(0.001);  // x, y, z
export const monitorPosition = new THREE.Vector3();

export function loadRoom(scene, cssScene, cssDomEl, loader, targetMeshes) {
    // Room 로드
    loader.load('/models/room.glb', (glb) => {
        const model = glb.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        model.rotation.y = THREE.MathUtils.degToRad(-90);
        console.log('모델입니다', model);

        // 모델링에 포함된 모든 mesh의 그림자 표현
        model.traverse(node => {
            if (node instanceof THREE.Mesh && node.material instanceof THREE.MeshStandardMaterial) {
                if (node.name === 'Plane089' || node.name === 'Plane090') {  // 블라인드
                    node.material.transparent = true;
                    node.material.opacity = 0.9;
                    node.receiveShadow = true;  // 연출을 위해 블라인드의 그림자 생성 제외
                } else {
                    node.receiveShadow = true;
                    node.castShadow = true;
                }

                if (node.name === 'Plane202_3') {  // 모니터

                    node.name = 'monitor';
                    node.getWorldPosition(monitorPosition);

                    // html의 바탕이 될 container
                    const container = document.createElement('div');
                    container.style.width = SCREEN_SIZE.w + 'px';
                    container.style.height = SCREEN_SIZE.h + 'px';
                    container.style.opacity = '1';
                    container.style.background = '#fff';
                    container.id = 'containerMan';

                    // iframe 생성
                    const iframe = document.createElement('iframe');
                    iframe.src = 'https://resume.zeriong.com/';
                    iframe.style.width = SCREEN_SIZE.w + 'px';
                    iframe.style.height = SCREEN_SIZE.h + 'px';
                    console.log('이프레임 높이',iframe.style.height)
                    console.log('이프레임 너비',iframe.style.width)
                    iframe.style.boxSizing = 'border-box';
                    iframe.style.opacity = '1';
                    iframe.className = 'monitor';
                    iframe.id = 'screen';
                    iframe.title = 'screen';
                    console.log('iframe: ',iframe);

                    // CSS3DObject 생성
                    const cssObj = new CSS3DObject(iframe);
                    cssObj.name = 'monitor';
                    cssObj.position.x = monitorPosition.x;
                    cssObj.position.y = monitorPosition.y + 0.066;
                    cssObj.position.z = monitorPosition.z + 0.026;
                    cssObj.scale.set(...CSS_SCALE);
                    // cssObj.rotation.y = THREE.MathUtils.degToRad(90);
                    console.log('이거슨?',cssObj);

                    // HTML 상호작용을 위한 요소
                    const htmlActionDom = cssDomEl.querySelector('div > div > div').children[0]; // matrix3d
                    const newMatrix3d = cssObj.matrixWorld.elements;
                    const array = [];
                    console.log('매트리스월드~~', newMatrix3d)



                    // htmlActionDom.style.matrix3d
                    console.log('htmlActionDom입니다~',htmlActionDom);

                    container.appendChild(iframe);
                    cssScene.add(cssObj);

                    console.log('cssObj: ',cssObj);

                    // CSS3DObject를 표현하기 위한 Mesh
                    const geometry = new THREE.PlaneGeometry(SCREEN_SIZE.w, SCREEN_SIZE.h);
                    const material = new THREE.MeshLambertMaterial();
                    // material.color = new THREE.Color('#fff');
                    material.side = THREE.DoubleSide;
                    material.opacity = 0;
                    material.transparent = true;
                    material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
                    material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
                    material.emissiveIntensity = 0  // 반사되는 빛의 강도 (0부터 1 사이의 값)
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x = monitorPosition.x;
                    mesh.position.y = monitorPosition.y + 0.066;
                    mesh.position.z = monitorPosition.z + 0.026;
                    // mesh.rotation.y = THREE.MathUtils.degToRad(90);
                    mesh.scale.set(...CSS_SCALE);
                    mesh.name = 'monitor';
                    scene.add(mesh);
                }
                if (node.name === 'Plane221_1') {  // lg 포스터
                    node.material = lgPosterMaterial;
                    node.name = 'lgPoster';
                }
                if (node.name === 'Plane218_1') {  // md 포스터
                    node.material = mdPosterMaterial;
                    node.name = 'mdPoster';
                }
                if (node.name === 'Plane220_1') {  // sm 포스터
                    node.material = smPosterMaterial;
                    node.name = 'smPoster';
                }
                if (node.name === 'Plane219_1') {
                    // 1. 미러큐브 구현을 통한 거울
                    // 2. 포지션과 좌표를 카피하여 Reflector mesh로 덮어쓰기
                    const scale = new THREE.Vector3();
                    const position = new THREE.Vector3();

                    node.getWorldPosition(position);
                    node.getWorldScale(scale);

                    console.log(position, scale);

                    node.name = 'mirror';
                }

                node.material = new THREE.MeshPhongMaterial({
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