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

    /* 폰트 로드
    * bold: Pretendard_Bold.json
    * semiBold: Pretendard SemiBold_Regular.json
    * medium: Pretendard Medium_Regular.json
    * regular: Pretendard_Regular.json
    * thin: Pretendard Thin_Regular.json
    * */
    const fontLoad = new FontLoader();

    // zeriong, engineer 판넬 그룹
    const nameGroup = new THREE.Group();
    // 메뉴 판넬 그룹
    const menuGroup = new THREE.Group();
    // 전체 그룹
    const totalGroup = new THREE.Group();

    // "zeriong" mesh
    fontLoad.load('/font/Pretendard_Bold.json', (font) => {
        // name mesh
        const nameGeometry = new TextGeometry('ZERIONG', {
            font: font,
            size: 0.32,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const nameMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial);
        nameMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        nameMesh.rotation.z = THREE.MathUtils.degToRad(90);
        nameMesh.position.set(3, 0.25, 0);
        nameMesh.castShadow = true;
        nameGroup.add(nameMesh);

        // about me mesh
        const aboutMeGeometry = new TextGeometry('About Me', {
            font: font,
            size: 0.25,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const aboutMeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const aboutMeMesh = new THREE.Mesh(aboutMeGeometry, aboutMeMaterial);
        aboutMeMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        aboutMeMesh.position.set(-2, 0.25, 3);
        aboutMeMesh.castShadow = true;
        aboutMeMesh.name = 'aboutMe';
            // click area
        const aboutMeAreaGeometry = new THREE.PlaneGeometry(1.8, 0.4, 1, 1);
        const aboutMeAreaMaterial = new THREE.MeshStandardMaterial({ color: 'skyblue' });
        const aboutMeAreaMesh = new THREE.Mesh(aboutMeAreaGeometry, aboutMeAreaMaterial);
        aboutMeAreaMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        aboutMeAreaMesh.position.set(-1.2, 0.25, 2.9);
        aboutMeAreaMesh.receiveShadow = true;
        aboutMeAreaMesh.name = 'aboutMe';
        menuGroup.add(aboutMeMesh, aboutMeAreaMesh);
        meshes.push(aboutMeMesh, aboutMeAreaMesh);

        // projects mesh
        const projectsGeometry = new TextGeometry('Projects', {
            font: font,
            size: 0.25,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const projectsMaterial = aboutMeMaterial.clone();
        const projectsMesh = new THREE.Mesh(projectsGeometry, projectsMaterial);
        projectsMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        projectsMesh.position.set(0, 0.25, 3);
        projectsMesh.castShadow = true;
        projectsMesh.name = 'projects';
            // click area
        const projectsAreaMesh = aboutMeAreaMesh.clone();
        projectsAreaMesh.position.set(2, 0.25, 2.9);
        menuGroup.add(projectsMesh, projectsAreaMesh);
        meshes.push(projectsMesh, projectsAreaMesh);

        // learning mesh
        const learningGeometry = new TextGeometry('Learning', {
            font: font,
            size: 0.25,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const learningMaterial = aboutMeMaterial.clone();
        const learningMesh = new THREE.Mesh(learningGeometry, learningMaterial);
        learningMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        learningMesh.position.set(-2, 0.25, 4);
        learningMesh.castShadow = true;
        learningMesh.name = 'learning';
        menuGroup.add(learningMesh);
        meshes.push(learningMesh);

        // Skills mesh
        const skillsGeometry = new TextGeometry('Skills', {
            font: font,
            size: 0.25,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const skillsMaterial = aboutMeMaterial.clone();
        const skillsMesh = new THREE.Mesh(skillsGeometry, skillsMaterial);
        skillsMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        skillsMesh.position.set(0, 0.25, 4);
        skillsMesh.castShadow = true;
        skillsMesh.name = 'skills';
        menuGroup.add(skillsMesh);
        meshes.push(skillsMesh);

        // Github mesh
        const GithubGeometry = new TextGeometry('Github', {
            font: font,
            size: 0.25,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const GithubMaterial = aboutMeMaterial.clone();
        const GithubMesh = new THREE.Mesh(GithubGeometry, GithubMaterial);
        GithubMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        GithubMesh.position.set(-2, 0.25, 5);
        GithubMesh.castShadow = true;
        GithubMesh.name = 'github';
            // click area TODO: 클론지우고 생성자를 통해 생성하고 글자 크기에 맞도록 영역 크기 지정
        const githubAreaMesh = aboutMeAreaMesh.clone();
        githubAreaMesh.position.set(-1.2, 0.25, 4.9);
        githubAreaMesh.name = 'github';
        console.log('ㄱ깃허브 에어리어',githubAreaMesh.geometry.parameters.width)
        menuGroup.add(GithubMesh, githubAreaMesh);
        meshes.push(GithubMesh, githubAreaMesh);

        // Blog mesh
        const blogGeometry = new TextGeometry('Blog', {
            font: font,
            size: 0.25,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const blogMaterial = aboutMeMaterial.clone();
        const blogMesh = new THREE.Mesh(blogGeometry, blogMaterial);
        blogMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        blogMesh.position.set(0, 0.25, 5);
        blogMesh.castShadow = true;
        blogMesh.name = 'blog';
        menuGroup.add(blogMesh);
        meshes.push(blogMesh);

        scene.add(
            nameMesh, projectsMesh, skillsMesh, aboutMeMesh, learningMesh, GithubMesh, blogMesh,
            aboutMeAreaMesh, projectsAreaMesh, githubAreaMesh,
        );
    });

    // "Frontend Engineer" mesh
    fontLoad.load('/font/Pretendard_Regular.json', (font) => {
        const positionGeometry = new TextGeometry('Frontend Engineer', {
            font: font,
            size: 0.16,
            height: 0.012,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const positionMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const positionMesh = new THREE.Mesh(positionGeometry, positionMaterial);
        positionMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        positionMesh.rotation.z = THREE.MathUtils.degToRad(90);
        positionMesh.position.set(3.35, 0.25, -0.03);
        positionMesh.castShadow = true;
        nameGroup.add(positionMesh);

        scene.add(positionMesh);
    });

    totalGroup.add(menuGroup, nameGroup);
}
