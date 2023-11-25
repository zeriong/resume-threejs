import * as THREE from 'three';
import Application from '../Application';

export default class Doll {
    constructor() {
        const app = Application.getInstance();
        this.intersectsMeshes = app.intersectsMeshes; // raycaster 감지 배열
        this.scene = app.scene;
        this.loader = app.loader;
        this.position = new THREE.Vector3();

        this.aboutMeLoad();
    }

    aboutMeLoad() {
        this.loader.gltfLoader.load('/assets/models/dino.glb', (glb) => {
            const model = glb.scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.castShadow = true;
            model.receiveShadow = true;
            model.position.x = 1;
            model.position.y = 1;
            model.position.z = 0.5;
            model.rotation.y = THREE.MathUtils.degToRad(270);

            // 모델링이 가진 모든 mesh를 raycaster에 감지되도록 등록
            model.children.map(mesh => {
                mesh.name = 'aboutMe';
                this.intersectsMeshes.push(mesh);
            });

            model.name = 'aboutMe';
            model.getWorldPosition(this.position); // 모델링에서 position 추출
            this.intersectsMeshes.push(model);
            this.scene.add(model);
        });
    }
}