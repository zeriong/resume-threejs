import * as THREE from 'three';
import {lgPosterMaterial, mdPosterMaterial, monitorMaterial, smPosterMaterial} from './geometryAndMaterial';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


export const meshes = [];
export const monitorPosition = new THREE.Vector3();

export function modelsLoad(canvas, scene) {
    // 로드매니저
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
        // 모델링이 로드되면 보이게
        canvas.style.display = 'block';
    }

    const loader = new GLTFLoader(loadingManager);

    // Room 로드
    loader.load('/models/room.glb', (glb) => {
        const model = glb.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        // model.position.y = -0.2;

        // 모델링에 포함된 모든 mesh의 그림자 표현
        model.traverse(node => {
            if (node instanceof THREE.Mesh && node.material instanceof THREE.MeshStandardMaterial) {
                // 블라인드
                if (node.name === 'Plane089' || node.name === 'Plane090') {
                    node.material.transparent = true;
                    node.material.opacity = 0.9;

                    // 연출을 위해 블라인드의 그림자 생성 제외
                    node.receiveShadow = true;
                } else {
                    node.receiveShadow = true;
                    node.castShadow = true;
                }

                if (node.name === 'Plane202_3') {  // 모니터
                    node.material = monitorMaterial;
                    node.name = 'monitor';
                    node.getWorldPosition(monitorPosition);
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
                meshes.push(node);
            }
        });
        scene.add(model);
        console.log(model);
    });

    // Dino 로드
    loader.load('/models/dino.glb', (glb) => {
        const model = glb.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        model.position.x = -1.3;
        model.position.y = 1;
        model.position.z = 0;

        model.children.map(mesh => {
            mesh.name = 'dino';
            meshes.push(mesh);
        })

        model.name = 'dino';
        meshes.push(model);
        scene.add(model);
    });

    // 폰트 Bold 로드
    const fontLoad = new FontLoader();
    fontLoad.load('/font/Pretendard_Bold.json', (font) => {
        // console.log(font)
        const boldGeometry = new TextGeometry('Hello, Three.js bold', {
            font: font,       // 외부 CDN에서 로드한 폰트 사용
            size: 0.2,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        });
        const boldMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const boldMesh = new THREE.Mesh(boldGeometry, boldMaterial);
        boldMesh.position.set(0, 3, 0);
        // scene.add(boldMesh);
    });

    // 폰트 Semi Bold 로드
    fontLoad.load('/font/Pretendard SemiBold_Regular.json', (font) => {
        const semiBoldGeometry = new TextGeometry('Hello, Three.js semi bold', {
            font: font,       // 외부 CDN에서 로드한 폰트 사용
            size: 0.2,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        });
        const semiBoldMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const semiBoldMesh = new THREE.Mesh(semiBoldGeometry, semiBoldMaterial);
        semiBoldMesh.position.set(0, 3, 0);
        // scene.add(semiBoldMesh);
    });

    // 폰트 Medium 로드
    fontLoad.load('/font/Pretendard Medium_Regular.json', (font) => {
        const mediumGeometry = new TextGeometry('Hello, Three.js Medium', {
            font: font,       // 외부 CDN에서 로드한 폰트 사용
            size: 0.2,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        });
        const mediumMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mediumMesh = new THREE.Mesh(mediumGeometry, mediumMaterial);
        mediumMesh.position.set(0, 3, 0);
        // scene.add(mediumMesh);
    });

    // 폰트 Regular 로드
    fontLoad.load('/font/Pretendard_Regular.json', (font) => {
        const regularGeometry = new TextGeometry('Hello, Three.js Regular', {
            font: font,       // 외부 CDN에서 로드한 폰트 사용
            size: 0.2,
            height: 0.05,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        });
        const regularMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const regularMesh = new THREE.Mesh(regularGeometry, regularMaterial);
        regularMesh.position.set(0, 3, 0);
        scene.add(regularMesh);
    });

    // 폰트 Thin 로드
    fontLoad.load('/font/Pretendard Thin_Regular.json', (font) => {
        const thinGeometry = new TextGeometry('Hello, Three.js Regular', {
            font: font,       // 외부 CDN에서 로드한 폰트 사용
            size: 0.2,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        });
        const thinMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const thinMesh = new THREE.Mesh(thinGeometry, thinMaterial);
        thinMesh.position.set(0, 3, 0);
        // scene.add(thinMesh);
    });
}
