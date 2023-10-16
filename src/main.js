import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {
	floorGeometry,
	floorMaterial,
	particleGeometry,
	particleMaterial,
	runLightParticle
} from './geometryAndMaterial';
import {
	drawLgPoster, drawMdPoster,
	drawMonitor, drawSmPoster,
} from './canvases';
import dat from 'dat.gui';
import gsap from 'gsap';
import {setLights} from './lights';
import {meshes, modelsLoad, monitorPosition} from './loads';

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
const downControlLimitSet = () => {
	// 바닥 아래를 볼 수 없도록 제한
	controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
}
const downControlLimitBreak = () => {
	// 제한 해제
	controls.maxPolarAngle = THREE.MathUtils.degToRad(360);
}
downControlLimitSet();

// Models Load
modelsLoad(canvas, scene);

// set Lights
setLights(scene);

// Mesh
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = THREE.MathUtils.degToRad(-90);
floor.position.y = 0;
scene.add(floor);

const lightParticle = new THREE.Points(particleGeometry, particleMaterial);
scene.add(lightParticle);

// AxesHelper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// RayCaster
const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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

// gsap play 여부
let isPlay = false;

gui.add(camera.position, 'x', -10, 10, 0.01);
gui.add(camera.position, 'y', -10, 10, 0.01);
gui.add(camera.position, 'z', -10, 10, 0.01);

gui.add(camera.rotation, 'x', -10, 10, 0.01).name('카메라 X 회전');
gui.add(camera.rotation, 'y', -10, 10, 0.01).name('카메라 Y 회전');
gui.add(camera.rotation, 'z', -10, 10, 0.01).name('카메라 Z 회전');

// mesh 감지 함수
function checkIntersects() {
	if (isPlay) return;
	rayCaster.setFromCamera(mouse, camera); // 카메라 기준으로 ray 관통

	const intersects = rayCaster.intersectObjects(meshes); // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
	if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

	// 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intesrsects[0])을 식별
	const name = intersects[0].object.name;

	if (name === 'dino') {
		gsap.to(camera.position, {
			x: -1.5, y: 1.27, z: 0,
			duration: 2,
			ease: 'power1.inOut',
			onStart: () => {
				isPlay = true;
				controls.enabled = false;
				downControlLimitBreak(); // down control 제한 해제
			},
			onComplete: () => {
				backBtn.style.bottom = '40px';
			}
		});
		gsap.to(controls.target, {
			x: -4, y: 1.25, z: 0,
			duration: 2,
			ease: 'power1.inOut',
		});
	}

	if (name === 'monitor') {
		gsap.to(camera.position, {
			x: monitorPosition.x, y: monitorPosition.y, z: monitorPosition.z,
			duration: 2,
			ease: 'power1.inOut',
			onStart: () => {
				isPlay = true;
				controls.enabled = false;
				downControlLimitBreak(); // down control 제한 해제
			},
			onComplete: () => {
				backBtn.style.bottom = '40px';
			}
		});
		gsap.to(controls.target, {
			x: -5, y: 1.2, z: -0.7,
			// x: monitorPosition.x, y: monitorPosition.y, z: monitorPosition.z,
			duration: 2,
			ease: 'power1.inOut',
		});
	}
}

// resize 시 동적으로 scale 변경
function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
window.addEventListener('resize', setSize);

// 마우스 드래그 시 발생하는 rayCaster 방지
let mouseMoved;
let clickStartX;
let clickStartY;
canvas.addEventListener('mousedown', e => {
	clickStartX = e.clientX;
	clickStartY = e.clientY;
});
canvas.addEventListener('mouseup', e => {
	const gapX = Math.abs(e.clientX - clickStartX);
	const gapY = Math.abs(e.clientY - clickStartY);
	mouseMoved = gapX > 5 || gapY > 5;
});

// mesh 감지 클릭 이벤트
canvas.addEventListener('click', e => {
	// 마우스 클릭 위치 정교화
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
	// console.log(mouse);
	checkIntersects();
});

const backBtn = document.querySelector('#back-btn');

// Back 버튼 이벤트
backBtn.addEventListener('click', () => {
	backBtn.style.bottom = '-120px';
	gsap.to(camera.position, {
		x: 14, y: 12, z: 14,
		duration: 1.5,
		ease: 'power1.inOut',
		onComplete: () => {
			isPlay = false;
			controls.enabled = true;
			downControlLimitSet(); // down control 제한
		}
	});
	gsap.to(controls.target, {
		x: 0, y: 0, z: 0,
		duration: 2,
		ease: 'power1.inOut',
	});
});

draw();








// 임시 영역
const click = document.querySelector('#click');
let toggle = false;
click.addEventListener('click', () => {
	if (toggle) {
		click.style.top = '50%';
		toggle = false;
	} else {
		click.style.top = 0;
		toggle = true;
	}
})