import Application from '../Application';
import * as THREE from 'three';
import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer';
import {MODEL_ROOM_OBJECT_POSITIONS, MODEL_ROOM_OBJECT_SCALE, MODEL_ROOM_OBJECT_SIZES} from "../common/constants";

export default class Room {
    constructor() {
        this.init();
    }

    init() {
        const app = Application.getInstance();
        const raycaster = app.raycaster;

        const _this = this;
        app.loader.fbxLoader.load('/assets/models/room.fbx',function(model){
            model.rotation.y = THREE.MathUtils.degToRad(-90);
            model.position.x = 0;
            model.position.y = 0;
            model.position.z = 0;
            //model.scale.set(0.01, 0.01, 0.01);

            model.traverse((child) => {
                if (child.isMesh) {
                    // 재질 설정
                    child.material = new THREE.MeshStandardMaterial({
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
                        //vertexColors: child.material.vertexColors, // fbx 파일에는 없음
                        userData: child.material.userData,
                    });

                    // 블라인드
                    if (child.name === 'polySurface854') {
                        child.material.transparent = true;
                        child.material.opacity = 0.6;
                        child.receiveShadow = true;
                    } else {
                        child.castShadow = false;
                        child.receiveShadow = false;
                    }

                    // 모니터 스크린
                    if (child.name === 'polySurface575') {

                        // 웹뷰 생성
                        _this.createWebview('monitor', './pages/projects.html', MODEL_ROOM_OBJECT_SIZES.MONITOR, MODEL_ROOM_OBJECT_POSITIONS.MONITOR)

                        child.name = 'monitor';

                        raycaster.targetMeshes.push(child)
                    }

                    // 포스터 액자
                    if (child.name === 'polySurface602') {
                        // texture img
                        const texture = app.loader.textureLoader.load('/assets/images/poster.jpg');
                        texture.encoding = THREE.sRGBEncoding;
                        const geometry = new THREE.PlaneGeometry(MODEL_ROOM_OBJECT_SIZES.POSTER.w, MODEL_ROOM_OBJECT_SIZES.POSTER.h);
                        const material = new THREE.MeshBasicMaterial({ map: texture });
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.position.x = MODEL_ROOM_OBJECT_POSITIONS.POSTER.x;
                        mesh.position.y = MODEL_ROOM_OBJECT_POSITIONS.POSTER.y;
                        mesh.position.z = MODEL_ROOM_OBJECT_POSITIONS.POSTER.z;
                        mesh.scale.set(...MODEL_ROOM_OBJECT_SCALE);
                        mesh.name = 'poster';
                        app.scene.add(mesh);

                        child.name = 'poster';

                        raycaster.targetMeshes.push(child);
                    }

                    // 세로 액자
                    if (child.name === 'polySurface584') {

                        // 웹뷰 생성
                        _this.createWebview('frame1', './pages/roadmap.html', MODEL_ROOM_OBJECT_SIZES.FRAME1, MODEL_ROOM_OBJECT_POSITIONS.FRAME1)

                        child.name = 'frame1';

                        raycaster.targetMeshes.push(child);
                    }

                    // 가로 액자
                    if (child.name === 'polySurface576') {

                        // 웹뷰 생성
                        _this.createWebview('frame2', './pages/skills.html', MODEL_ROOM_OBJECT_SIZES.FRAME2, MODEL_ROOM_OBJECT_POSITIONS.FRAME2)

                        child.name = 'frame2';

                        raycaster.targetMeshes.push(child);
                    }

                    // 의자
                    if (child.name === 'polySurface482') {
                        child.material.transparent = true;
                        child.material.opacity = 1;
                        child.name = 'chair';
                        raycaster.targetMeshes.push(child);
                    }
                }
            })

            app.scene.add(model);
        })

        // // 문 가림용 반투명 매쉬
        // const doorCoverGeometry = new THREE.BoxGeometry(100, 0.2, 260);
        // const doorCoverMaterial = new THREE.MeshBasicMaterial({ color: 0xfff9f0, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
        // const doorCoverMesh = new THREE.Mesh(doorCoverGeometry, doorCoverMaterial);
        // doorCoverMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        // doorCoverMesh.rotation.z = THREE.MathUtils.degToRad(90);
        // doorCoverMesh.position.x = 2.9;
        // doorCoverMesh.position.y = 1.5;
        // doorCoverMesh.position.z = 3.3;
        // doorCoverMesh.scale.set(0.01, 0.01, 0.01);
        // app.scene.add(doorCoverMesh);
        //
        // // 창문 가림용 반투명 매쉬
        // const windowCoverGeometry = new THREE.BoxGeometry(150, 0.2, 200);
        // const windowCoverMaterial = new THREE.MeshBasicMaterial({ color: 0xfff9f0, transparent: true, opacity: 1.0, side: THREE.DoubleSide });
        // const windowCoverMesh = new THREE.Mesh(windowCoverGeometry, windowCoverMaterial);
        // windowCoverMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        // windowCoverMesh.rotation.z = THREE.MathUtils.degToRad(90);
        // windowCoverMesh.position.x = 3;
        // windowCoverMesh.position.y = 2.1;
        // windowCoverMesh.position.z = 1.1;
        // windowCoverMesh.scale.set(0.01, 0.01, 0.01);
        // app.scene.add(windowCoverMesh);
    }

    createWebview(name, src, sizes, positions) {
        const app = Application.getInstance();

        // iframe 생성
        const iframe = this.createWebviewIframe(src, sizes);

        // CSS3DObject 생성
        const cssObj = this.createCSS3DObject(name, iframe, positions);
        app.cssScene.add(cssObj);

        // CSS3DObject를 표현하기 위한 Mesh 생성, 반환
        const mesh = this.createWebviewMesh(name, sizes, positions );
        app.scene.add(mesh);
    }

    createWebviewIframe(src, sizes) {
        const iframe = document.createElement('iframe');
        iframe.style.width = (sizes.w) + 'px';
        iframe.style.height = (sizes.h) + 'px';
        iframe.style.border = '0px';
        iframe.style.overflow = 'scroll';
        iframe.style.boxSizing = 'border-box';
        iframe.style.opacity = '1';
        iframe.src = src;

        return iframe;
    }

    createCSS3DObject(name, el, positions) {
        const cssObj = new CSS3DObject(el);
        cssObj.name = name;
        cssObj.position.x = positions.x;
        cssObj.position.y = positions.y;
        cssObj.position.z = positions.z;
        cssObj.scale.set(...MODEL_ROOM_OBJECT_SCALE);

        return cssObj;
    }

    createWebviewMesh(name, sizes, positions) {
        // CSS3DObject를 표현하기 위한 Mesh
        const geometry = new THREE.PlaneGeometry(sizes.w, sizes.h);
        const material = new THREE.MeshLambertMaterial;
        material.side = THREE.DoubleSide;
        material.opacity = 0;
        material.transparent = true;
        material.blending = THREE.NoBlending;  // CSS3DObject를 투과 해주는 옵션
        material.emissive = 0x0033ff;  // 반사되는 빛의 색상 (반사 색)
        material.emissiveIntensity = 0;  // 반사되는 빛의 강도 (0부터 1 사이의 값)

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = positions.x;
        mesh.position.y = positions.y;
        mesh.position.z = positions.z;
        mesh.scale.set(...MODEL_ROOM_OBJECT_SCALE);
        mesh.name = name;

        return mesh;
    }
}