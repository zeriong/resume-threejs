import Application from '../Application';
import * as THREE from 'three';

export default class Environment {
    #lightParticleGeometry = null

    lightParticleMaterial = null

    constructor() {
        this.init();
    }

    init() {
        const app = Application.getInstance();

        const floorGeometry = new THREE.PlaneGeometry(8000, 8000);
        const floorMaterial = new THREE.MeshPhysicalMaterial({ color: 0x9AB8CE, clearcoat: 0.6, clearcoatRoughness: 0.4, metalness: 0.8 });
        const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        floorMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        floorMesh.position.y = 0;

        // light particle(빛가루) 매쉬
        this.lightParticleMaterial = new THREE.PointsMaterial({ size: 0.05, blending: THREE.AdditiveBlending, color: 0xffff00 });
        const lightParticleCount = 80;
        const lightParticlePostions = new Float32Array(lightParticleCount * 3);

        for(let i = 0; i < lightParticleCount * 3; i += 3) {
            lightParticlePostions[i] = (Math.random() - 0.5) * 500;
            lightParticlePostions[i + 1] = Math.random() * 800;  // 높이 0 ~ 12
            lightParticlePostions[i + 2] = (Math.random() - 0.5) * 500;
        }
        this.#lightParticleGeometry = new THREE.BufferGeometry();
        this.#lightParticleGeometry.setAttribute('position', new THREE.BufferAttribute(lightParticlePostions, 3));
        const lightParticleMesh = new THREE.Points(this.#lightParticleGeometry, this.lightParticleMaterial);
        lightParticleMesh.position.set(0, 0, 0);

        app.scene.add(lightParticleMesh, floorMesh);
    }

    // 빛가루 애니메이션
    update() {
        const runLightPositions = this.#lightParticleGeometry.attributes.position.array;

        for(let i = 0; i < runLightPositions.length; i += 3) {
            runLightPositions[i + 1] -= 0.35;  // 천천히 아래로 이동
            if (runLightPositions[i + 1] < 0) runLightPositions[i + 1] = 800;
        }

        this.#lightParticleGeometry.attributes.position.needsUpdate = true;  // 위치 업데이트
    }
}