import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

export function loadFonts(scene, targetMeshes) {

    /* 폰트 로드
    * bold: Pretendard_Bold.json
    * semiBold: Pretendard SemiBold_Regular.json
    * medium: Pretendard Medium_Regular.json
    * regular: Pretendard_Regular.json
    * thin: Pretendard Thin_Regular.json
    * */

    const fontLoader = new FontLoader();

    const nameGroup = new THREE.Group();  // zeriong, engineer 판넬 그룹
    const menuGroup = new THREE.Group();  // 메뉴 판넬 그룹
    const totalGroup = new THREE.Group();  // 전체 그룹

    // "zeriong" meshes
    fontLoader.load('/font/Pretendard_Bold.json', (font) => {
        // name meshes
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

        // about me meshes
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
        targetMeshes.push(aboutMeMesh, aboutMeAreaMesh);

        // projects meshes
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
        targetMeshes.push(projectsMesh, projectsAreaMesh);

        // learning meshes
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
        targetMeshes.push(learningMesh);

        // Skills meshes
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
        skillsMesh.name = 'menu-skills';
        menuGroup.add(skillsMesh);
        targetMeshes.push(skillsMesh);

        // Github meshes
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
        menuGroup.add(GithubMesh, githubAreaMesh);
        targetMeshes.push(GithubMesh, githubAreaMesh);

        // Blog meshes
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
        targetMeshes.push(blogMesh);
    });

    // "Frontend Engineer" meshes
    fontLoader.load('/font/Pretendard_Regular.json', (font) => {
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
    });

    totalGroup.add(menuGroup, nameGroup);
    totalGroup.rotation.y = THREE.MathUtils.degToRad(-90);
    totalGroup.position.x = 1;
    totalGroup.position.z = 2;
    scene.add(totalGroup)
}