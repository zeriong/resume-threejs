export function loadDino(scene, loader, targetMeshes) {
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
            targetMeshes.push(mesh);
        })

        model.name = 'dino';
        targetMeshes.push(model);
        scene.add(model);
    });
}