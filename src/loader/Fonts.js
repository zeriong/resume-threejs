import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

export function loadFonts(scene, targetMeshes) {

    /* 폰트 로드
    * bold: Pretendard_Bold.json
    * semiBold: Pretendard_SemiBold_Regular.json
    * medium: Pretendard_Medium_Regular.json
    * regular: Pretendard_Regular.json
    * thin: Pretendard_Thin_Regular.json
    * */

    const fontLoader = new FontLoader();

    const nameGroup = new THREE.Group();  // zeriong, engineer 판넬 그룹
    const menuGroup = new THREE.Group();  // 메뉴 판넬 그룹
    const totalGroup = new THREE.Group();  // 전체 그룹

    // "zeriong" meshes
    fontLoader.load('/fontjson/Pretendard_Bold.json', (font) => {
        // name meshes
        const nameGeometry = new TextGeometry('ZERIONG', {
            font: font,
            size: 0.32,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const nameMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial);
        nameMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        nameMesh.rotation.z = THREE.MathUtils.degToRad(90);
        nameMesh.rotation.y = THREE.MathUtils.degToRad(90);
        nameMesh.position.set(2.8, 0.45, 0);
        nameMesh.castShadow = true;
        nameGroup.add(nameMesh);

        // about me meshes
        const aboutMePos = new THREE.Vector3();
        const aboutMeGeometry = new TextGeometry('About Me', {
            font: font,
            size: 0.18,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const aboutMeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const aboutMeMesh = new THREE.Mesh(aboutMeGeometry, aboutMeMaterial);
        aboutMeMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        aboutMeMesh.rotation.z = THREE.MathUtils.degToRad(90);
        aboutMeMesh.rotation.y = THREE.MathUtils.degToRad(90);
        aboutMeMesh.position.set(-1.9, 3, 3.4);
        aboutMeMesh.castShadow = true;
        aboutMeMesh.name = 'aboutMe1';
        aboutMeMesh.getWorldPosition(aboutMePos);
        // click area 해당 mesh를 clone하여 모두 적용
        const CALC_POS = { y: 0.089, z: 0.55 } // position: (y = +), (z = -)
        const aboutMeAreaGeometry = new THREE.PlaneGeometry(1.3, 0.3, 1, 1);
        const aboutMeAreaMaterial = new THREE.MeshStandardMaterial({ opacity: 0, transparent: true });
        const clickAreaMesh = new THREE.Mesh(aboutMeAreaGeometry, aboutMeAreaMaterial);
        clickAreaMesh.position.set(aboutMePos.x, aboutMePos.y + CALC_POS.y, aboutMePos.z - CALC_POS.z);
        clickAreaMesh.rotation.y = THREE.MathUtils.degToRad(90);
        clickAreaMesh.name = 'aboutMe1';
        menuGroup.add(aboutMeMesh, clickAreaMesh);
        targetMeshes.push(aboutMeMesh, clickAreaMesh);

        // projects meshes
        const projectsPos = new THREE.Vector3();
        const projectsGeometry = new TextGeometry('Projects', {
            font: font,
            size: 0.18,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const projectsMaterial = aboutMeMaterial.clone();
        const projectsMesh = new THREE.Mesh(projectsGeometry, projectsMaterial);
        projectsMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        projectsMesh.rotation.z = THREE.MathUtils.degToRad(90);
        projectsMesh.rotation.y = THREE.MathUtils.degToRad(90);
        projectsMesh.position.set(-1.9, 2.5, 3.4);
        projectsMesh.castShadow = true;
        projectsMesh.name = 'projects';
        projectsMesh.getWorldPosition(projectsPos);
        // click area
        const projectsAreaMesh = clickAreaMesh.clone();
        projectsAreaMesh.position.set(projectsPos.x, projectsPos.y + CALC_POS.y, projectsPos.z - CALC_POS.z);
        projectsAreaMesh.name = 'projects';
        menuGroup.add(projectsMesh, projectsAreaMesh);
        targetMeshes.push(projectsMesh, projectsAreaMesh);

        // learning meshes
        const learningPos = new THREE.Vector3();
        const learningGeometry = new TextGeometry('Learning', {
            font: font,
            size: 0.18,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const learningMaterial = aboutMeMaterial.clone();
        const learningMesh = new THREE.Mesh(learningGeometry, learningMaterial);
        learningMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        learningMesh.rotation.z = THREE.MathUtils.degToRad(90);
        learningMesh.rotation.y = THREE.MathUtils.degToRad(90);
        learningMesh.position.set(-1.9, 2.0, 3.4);
        learningMesh.castShadow = true;
        learningMesh.name = 'learning';
        learningMesh.getWorldPosition(learningPos);
        menuGroup.add(learningMesh);
        targetMeshes.push(learningMesh);
        // click area
        const learningAreaMesh = clickAreaMesh.clone();
        learningAreaMesh.position.set(learningPos.x, learningPos.y + CALC_POS.y, learningPos.z - CALC_POS.z);
        learningAreaMesh.name = 'learning';
        menuGroup.add(learningMesh, learningAreaMesh);
        targetMeshes.push(learningMesh, learningAreaMesh);

        // Skills meshes
        const skillsPos = new THREE.Vector3();
        const skillsGeometry = new TextGeometry('Skills', {
            font: font,
            size: 0.18,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const skillsMaterial = aboutMeMaterial.clone();
        const skillsMesh = new THREE.Mesh(skillsGeometry, skillsMaterial);
        skillsMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        skillsMesh.rotation.z = THREE.MathUtils.degToRad(90);
        skillsMesh.rotation.y = THREE.MathUtils.degToRad(90);
        skillsMesh.position.set(-1.9, 1.5, 3.4);
        skillsMesh.castShadow = true;
        skillsMesh.name = 'skills';
        skillsMesh.getWorldPosition(skillsPos);
        menuGroup.add(skillsMesh);
        targetMeshes.push(skillsMesh);
        // click area
        const skillsAreaMesh = clickAreaMesh.clone();
        skillsAreaMesh.position.set(skillsPos.x, skillsPos.y + CALC_POS.y, skillsPos.z - CALC_POS.z);
        skillsAreaMesh.name = 'skills';
        menuGroup.add(skillsMesh, skillsAreaMesh);
        targetMeshes.push(skillsMesh, skillsAreaMesh);

        // Github meshes
        const githubPos = new THREE.Vector3();
        const githubGeometry = new TextGeometry('Github', {
            font: font,
            size: 0.18,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const githubMaterial = aboutMeMaterial.clone();
        const githubMesh = new THREE.Mesh(githubGeometry, githubMaterial);
        githubMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        githubMesh.rotation.z = THREE.MathUtils.degToRad(90);
        githubMesh.rotation.y = THREE.MathUtils.degToRad(90);
        githubMesh.position.set(-1.9, 1.0, 3.4);
        githubMesh.castShadow = true;
        githubMesh.name = 'github';
        githubMesh.getWorldPosition(githubPos);
        // click area
        const githubAreaMesh = clickAreaMesh.clone();
        githubAreaMesh.position.set(githubPos.x, githubPos.y + CALC_POS.y, githubPos.z - CALC_POS.z);
        githubAreaMesh.name = 'github';
        menuGroup.add(githubMesh, githubAreaMesh);
        targetMeshes.push(githubMesh, githubAreaMesh);

        // Blog meshes
        const blogPos = new THREE.Vector3();
        const blogGeometry = new TextGeometry('Blog', {
            font: font,
            size: 0.18,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const blogMaterial = aboutMeMaterial.clone();
        const blogMesh = new THREE.Mesh(blogGeometry, blogMaterial);
        blogMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        blogMesh.rotation.z = THREE.MathUtils.degToRad(90);
        blogMesh.rotation.y = THREE.MathUtils.degToRad(90);
        blogMesh.position.set(-1.9, 0.5, 3.4);
        blogMesh.castShadow = true;
        blogMesh.name = 'blog';
        blogMesh.getWorldPosition(blogPos);
        // click area
        const blogAreaMesh = clickAreaMesh.clone();
        blogAreaMesh.position.set(blogPos.x, blogPos.y + CALC_POS.y, blogPos.z - CALC_POS.z);
        blogAreaMesh.name = 'blog';
        menuGroup.add(blogMesh, blogAreaMesh);
        targetMeshes.push(blogMesh, blogAreaMesh);
    });

    // "Frontend Engineer" meshes
    fontLoader.load('/fontjson/Pretendard_Regular.json', (font) => {
        const positionGeometry = new TextGeometry('Frontend Engineer', {
            font: font,
            size: 0.165,
            height: 0.001,
            curveSegments: 5,
            bevelSegments: 5,
        });
        const positionMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const positionMesh = new THREE.Mesh(positionGeometry, positionMaterial);
        positionMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        positionMesh.rotation.z = THREE.MathUtils.degToRad(90);
        positionMesh.rotation.y = THREE.MathUtils.degToRad(90);
        positionMesh.position.set(2.8, 0.2, 0);
        positionMesh.castShadow = true;
        nameGroup.add(positionMesh);
    });

    totalGroup.add(menuGroup, nameGroup);
    totalGroup.rotation.y = THREE.MathUtils.degToRad(-90);
    totalGroup.position.x = 1;
    totalGroup.position.z = 2;
    scene.add(totalGroup);
}