import * as THREE from 'three';
import {lgPosterMaterial, mdPosterMaterial, monitorMaterial, smPosterMaterial} from '../meshes/Meshes';
import {monitorPosition} from './MainLoader';
import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer';

export const SCREEN_SIZE = { width: 879, height: 438 };

export function loadRoom(scene, cssScene, loader, targetMeshes) {
    // Room 로드
    loader.load('/models/room.glb', (glb) => {
        const model = glb.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        // model.position.y = -0.2;

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
                    const scale = new THREE.Vector3();
                    node.name = 'monitor';
                    node.getWorldPosition(monitorPosition);

                    // iframe 생성
                    const iframe = document.createElement('iframe');
                    iframe.src = '/html.html';
                    // iframe.style.width = `${SCREEN_SIZE.width}px`;
                    // iframe.style.height = `${SCREEN_SIZE.height}px`;
                    iframe.style.width = `100px`;
                    iframe.style.height = `200px`;
                    console.log('이프레임 높이',iframe.style.height)
                    console.log('이프레임 너비',iframe.style.width)
                    iframe.style.boxSizing = 'border-box';
                    iframe.style.opacity = '1';
                    iframe.className = 'monitor';
                    iframe.id = 'screen';
                    iframe.title = 'screen';
                    console.log('iframe: ',iframe);

                    // CSS3DObject 생성
                    const cssObject = new CSS3DObject(iframe);
                    // cssObject.position.x = monitorPosition.x + 0.026;
                    // cssObject.position.y = monitorPosition.y + 0.066;
                    // cssObject.position.z = monitorPosition.y;
                    cssObject.name = 'monitor';
                    cssObject.position.copy(monitorPosition);
                    cssObject.scale.set(0.01,0.01,0.01);
                    cssObject.rotation.y = THREE.MathUtils.degToRad(90);
                    cssScene.add(cssObject);

                    console.log('cssObj: ',cssObject);

                    // CSS3DObject의 뒷면을 가리기 위한 PlaneMesh
                    const geometry = new THREE.PlaneGeometry(800, 800);
                    const material = new THREE.MeshLambertMaterial();
                    // material.color = new THREE.Color('#fff');
                    material.side = THREE.DoubleSide;
                    material.opacity = 0;
                    material.transparent = true;
                    material.blending = THREE.NoBlending;  // CSS3DObject를 가리는 옵션
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.copy(monitorPosition);
                    // mesh.position.x = monitorPosition.x - 0.12;
                    mesh.rotation.y = THREE.MathUtils.degToRad(90);
                    mesh.scale.set(0.01,0.01,0.01);
                    // scene.add(mesh);
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
        console.log(model);
    });
}