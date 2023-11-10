import Application from '../Application';
import * as THREE from 'three';

export default class Environment {
    constructor() {
        this.application = Application.getInstance();
        this.scene = this.application.scene;

        // 바닥 매쉬
        this.floorGeometry = new THREE.PlaneGeometry(120, 120, 120, 120);
        this.floorMaterial = new THREE.MeshPhysicalMaterial({ color: 0x9AB8CE, clearcoat: 0.6, clearcoatRoughness: 0.4, metalness: 0.8 });
        this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);

        // 문 반투명 매쉬
        this.doorCoverGeometry = new THREE.BoxGeometry(100, 0.2, 460);
        this.doorCoverMaterial = new THREE.MeshBasicMaterial({ color: 0xffEEDD, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
        this.doorCoverMesh = new THREE.Mesh(this.doorCoverGeometry, this.doorCoverMaterial);

        // light particle(빛가루) 매쉬
        this.lightParticleGeometry = new THREE.BufferGeometry();
        this.lightParticleMaterial = new THREE.PointsMaterial({ size: 0.05, blending: THREE.AdditiveBlending, transparent: true, color: 0xffff00 });
        this.lightParticleCount = 60;
        this.lightParticlePostions = new Float32Array(this.lightParticleCount * 3);

        this.setMeshes();
    }

    setMeshes() {
        // floor
        this.floorMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        this.floorMesh.position.y = 0;

        // door cover
        this.doorCoverMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        this.doorCoverMesh.rotation.z = THREE.MathUtils.degToRad(90);
        this.doorCoverMesh.position.x = 2.9;
        this.doorCoverMesh.position.y = 0.5;
        this.doorCoverMesh.position.z = 3.3;
        this.doorCoverMesh.scale.set(0.01, 0.01, 0.01);

        // light particle
        for(let i = 0; i < this.lightParticleCount * 3; i += 3) {
            this.lightParticlePostions[i] = (Math.random() - 0.5) * 5;
            this.lightParticlePostions[i + 1] = Math.random() * 8;  // 높이 0 ~ 8
            this.lightParticlePostions[i + 2] = (Math.random() - 0.5) * 5;
        }
        this.lightParticleGeometry.setAttribute('position', new THREE.BufferAttribute(this.lightParticlePostions, 3));
        this.lightParticleMesh = new THREE.Points(this.lightParticleGeometry, this.lightParticleMaterial);
        this.lightParticleMesh.position.set(1, 0, 2);

        this.scene.add(this.floorMesh, this.doorCoverMesh, this.lightParticleMesh);
    }

    // 빛가루 내리는 애니메이션 렌더링 매서드
    update() {
        const runLightPositions = this.lightParticleGeometry.attributes.position.array;

        for(let i = 0; i < runLightPositions.length; i += 3) {
            runLightPositions[i + 1] -= 0.0035;  // 천천히 아래로 이동
            if (runLightPositions[i + 1] < 0) runLightPositions[i + 1] = 5;
        }

        this.lightParticleGeometry.attributes.position.needsUpdate = true;  // 위치 업데이트
    }
}