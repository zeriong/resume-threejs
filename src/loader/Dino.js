import * as THREE from 'three';

export function loadDino(scene, loader, targetMeshes) {
    // Dino 로드
    loader.load('/models/dino.glb', (glb) => {
        const model = glb.scene;
        model.scale.set(0.1, 0.1, 0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        model.position.x = 0;
        model.position.y = 1;
        model.position.z = -1.3;
        model.rotation.y = THREE.MathUtils.degToRad(270);

        model.children.map(mesh => {
            mesh.name = 'dino';
            targetMeshes.push(mesh);
        });

        model.name = 'dino';
        targetMeshes.push(model);
        scene.add(model);
    });
}