import * as THREE from 'three';
import Application from '../Application';

export default class Doll {
    constructor() {
        this.position = new THREE.Vector3();

        this.init();
    }

    init() {
        const app = Application.getInstance()
        const raycaster = app.raycaster

        app.loader.gltfLoader.load('/assets/models/dino.glb', (glb) => {
            const model = glb.scene;
            model.scale.set(10, 10, 10);
            //model.castShadow = true;
            model.receiveShadow = true;
            model.position.x = 0;
            model.position.y = 100;
            model.position.z = -150;
            model.rotation.y = THREE.MathUtils.degToRad(270);

            // 모델링이 가진 모든 mesh를 raycaster에 감지되도록 등록
            model.children.map(mesh => {
                mesh.name = 'doll';
                raycaster.targetMeshes.push(mesh);
            });

            model.name = 'doll';
            model.getWorldPosition(this.position); // 모델링에서 position 추출

            raycaster.targetMeshes.push(model);
            app.scene.add(model);
        });
    }
}