import * as THREE from 'three';
import Application from '../Application';

export default class AboutMe {
    constructor() {
        const app = Application.getInstance();
        this.intersectsMeshes = app.intersectsMeshes;
        this.scene = app.scene;
        this.loader = app.loader;
        this.position = new THREE.Vector3();

        this.aboutMeLoad();
    }

    aboutMeLoad() {
        this.loader.gltfLoader.load('/models/dino.glb', (glb) => {
            const model = glb.scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.castShadow = true;
            model.receiveShadow = true;
            model.position.x = 1;
            model.position.y = 1;
            model.position.z = 0.5;
            model.rotation.y = THREE.MathUtils.degToRad(270);

            model.children.map(mesh => {
                mesh.name = 'aboutMe1';
                this.intersectsMeshes.push(mesh);
            });

            model.name = 'aboutMe1';
            model.getWorldPosition(this.position);
            this.intersectsMeshes.push(model);
            this.scene.add(model);
        })
    }
}