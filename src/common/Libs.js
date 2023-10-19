export function setSize(renderer, cssRenderer, scene, camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}