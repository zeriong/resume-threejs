import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {
	floor2Geometry, floor2Material,
	floorGeometry,
	floorMaterial,
	particleGeometry,
	particleMaterial,
	runLightParticle
} from './module/geometryAndMaterial';
import {
	drawLgPoster, drawMdPoster,
	drawMonitor, drawSmPoster,
} from './module/canvases';
import dat from 'dat.gui';
import {setLights} from './module/lights';
import {modelsLoad} from './module/loads';
import {setRayCaster} from './module/rayCaster';
import {setSize} from './module/libs';

// Dat GUI
const gui = new dat.GUI();

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});

// 모델링 렌더링 전에 보이지 않도록 설정
canvas.style.display = 'none'

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true; // 그림자 설정
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 맵 타입 설정

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 1, 8000);
camera.position.set(14, 12, 14);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 카메라 컨트롤 시 smooth 적용 (draw 함수에 controls.update() 를 넣어야 함)
controls.maxDistance = 25; // 멀어지는 최대거리를 설정
controls.minDistance = 5; // 가까워지는 최소거리 설정
controls.mouseButtons.RIGHT = null; // 마우스 오른쪽 드래그로 중심 축 변경 잠금
controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 바닥 아래를 볼 수 없도록 제한

setLights(scene);  // set Lights
modelsLoad(canvas, scene, renderer, camera);// Models Load
setRayCaster(canvas, camera, controls);  // set RayCaster

// Mesh
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = THREE.MathUtils.degToRad(-90);
floor.position.y = 0;
const floor2 = new THREE.Mesh(floor2Geometry, floor2Material);
floor2.rotation.x = THREE.MathUtils.degToRad(-90);
floor2.position.x = 3;
floor2.position.z = 0;
floor2.position.y = 0.001;
floor2.receiveShadow = true;
scene.add(floor, floor2);

const lightParticle = new THREE.Points(particleGeometry, particleMaterial);
scene.add(lightParticle);

// AxesHelper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// Draw
const clock = new THREE.Clock(); // 디바이스 스펙 차이로 생기는 이슈를 보정하기 위한 시간값 객체
function draw() {
	const time = clock.getElapsedTime(); // 경과시간

	// 조명 위치를 원형으로 배회하며 테스팅
	// directionalLight.position.x = Math.cos(time) * 5;
	// directionalLight.position.z = Math.sin(time) * 5;

	drawMonitor();
	drawLgPoster();
	drawMdPoster();
	drawSmPoster();
	runLightParticle();

	controls.update();
	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

gui.add(camera.position, 'x', -10, 10, 0.01);
gui.add(camera.position, 'y', -10, 10, 0.01);
gui.add(camera.position, 'z', -10, 10, 0.01);

gui.add(camera.rotation, 'x', -10, 10, 0.01).name('카메라 X 회전');
gui.add(camera.rotation, 'y', -10, 10, 0.01).name('카메라 Y 회전');
gui.add(camera.rotation, 'z', -10, 10, 0.01).name('카메라 Z 회전');

// resize 시 동적으로 scale 변경
window.addEventListener('resize', () => setSize(renderer, scene, camera));

draw();








// 임시 영역
const click = document.querySelector('#click');
let toggle = false;
click.addEventListener('click', () => {
	console.log('검댕이 클릭 이벤트');
	// if (toggle) {
	// 	click.innerHTML = '중앙이야';
	// 	click.style.top = '50%';
	// 	toggle = false;
	// } else {
	// 	click.innerHTML = '위에 있어';
	// 	click.style.top = 0;
	// 	toggle = true;
	// }
})
// click.addEventListener('mousedown', () => {
// 	console.log('검댕이 마우스 다운 이벤트');
// })
// click.addEventListener('mouseup', () => {
// 	console.log('검댕이 마우스 업 이벤트');
// })
// click.addEventListener('wheel', () => {
// 	console.log('검댕이 마우스 휠');
// })
// click.addEventListener('mousemove', () => {
// 	console.log('검댕이 마우스 Move!');
// })
const input = document.querySelector('#input');
input.addEventListener('input', (e) => {
	input.innerHTML = e.target.value;
})
