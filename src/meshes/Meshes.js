import * as THREE from 'three';

// Floor
const floorGeometry = new THREE.PlaneGeometry(120, 120, 120, 120);
const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x9AB8CE,
    clearcoat: 0.6,
    clearcoatRoughness: 0.4,
    metalness: 0.8,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = THREE.MathUtils.degToRad(-90);
floor.position.y = 0;

// room dom
// const domGeometry = new THREE.BoxGeometry(70, 70, 70, 1);
// const domMaterial = new THREE.MeshStandardMaterial({ color: 'black', side: THREE.BackSide });
// const dom = new THREE.Mesh(domGeometry, domMaterial);
// dom.position.y = -1;

// 빛 가루 파티클
const particleGeometry = new THREE.BufferGeometry();
const particlesCount = 60;
const positions = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 5;
    positions[i + 1] = Math.random() * 8;  // 높이 0 ~ 8
    positions[i + 2] = (Math.random() - 0.5) * 5;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    blending: THREE.AdditiveBlending,  // 산술 블렌딩을 사용하여 빛의 누적 효과를 만듭니다
    transparent: true,
    color: 0xffff00,  // 노란색 빛으로 설정
});

// 빛 가루 이벤트
export const runLightParticle = () => {
    const positions = particleGeometry.attributes.position.array;
    for(let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.0035;  // 천천히 아래로 이동
        if (positions[i + 1] < 0) positions[i + 1] = 5;
    }
    particleGeometry.attributes.position.needsUpdate = true;  // 위치 업데이트
}
const lightParticle = new THREE.Points(particleGeometry, particleMaterial);
lightParticle.position.set(1, 0, 2);

// 반투명 door cover
const doorCoverGeometry = new THREE.BoxGeometry(100, 0.2, 460);
const doorCoverMaterial = new THREE.MeshBasicMaterial({ color: 0xffEEDD, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
const doorCover = new THREE.Mesh(doorCoverGeometry, doorCoverMaterial);
//doorCover.castShadow = true;
doorCover.rotation.x = THREE.MathUtils.degToRad(-90);
doorCover.rotation.z = THREE.MathUtils.degToRad(90);
doorCover.position.x = 2.9;
doorCover.position.y = 0.5;
doorCover.position.z = 3.3;
doorCover.scale.set(0.01, 0.01, 0.01);

export const setMeshes = (scene) => {
    scene.add(doorCover, floor, lightParticle);
}
