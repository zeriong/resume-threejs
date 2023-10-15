import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {
	floorGeometry,
	floorMaterial,
	lgPosterMaterial,
	mdPosterMaterial,
	monitorMaterial, smPosterMaterial
} from './geometryAndMaterial';
import {
	drawLgPoster, drawMdPoster,
	drawMonitor, drawSmPoster,
} from './canvases';
import dat from 'dat.gui';
import gsap from 'gsap';

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
scene.background = new THREE.Color('skyblue');

// Loader
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
	// 모델링이 로드되면 보이게
	canvas.style.display = 'block';
	console.log( 'Loading complete!');
}
const loader = new GLTFLoader(loadingManager);
const meshes = [];
loader.load('/models/room.glb', (glb) => {
	const model = glb.scene;
	model.castShadow = true;
	model.receiveShadow = true;
	model.position.y = -0.2;

	// 모델링에 포함된 모든 mesh의 그림자 표현
	model.children.map(mesh => {
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		meshes.push(mesh);
		mesh.children.map(meshChildren => {
			if (meshChildren.name === 'Plane202_3') {  // 모니터
				meshChildren.material = monitorMaterial;
				meshChildren.name = 'monitor';
			}
			if (meshChildren.name === 'Plane221_1') {  // lg 포스터
				meshChildren.material = lgPosterMaterial;
				meshChildren.name = 'lgPoster';
			}
			if (meshChildren.name === 'Plane218_1') {  // md 포스터
				meshChildren.material = mdPosterMaterial;
				meshChildren.name = 'mdPoster';
			}
			if (meshChildren.name === 'Plane220_1') {  // sm 포스터
				meshChildren.material = smPosterMaterial;
				meshChildren.name = 'smPoster';
			}
			if (meshChildren.name === 'Plane219_1') {
				// 1. 미러큐브 구현을 통한 거울
				// 2. 포지션과 좌표를 카피하여 Reflector mesh로 덮어쓰기
				meshChildren.name = 'mirror';
			}
			meshes.push(meshChildren);
			meshChildren.castShadow = true;
			meshChildren.receiveShadow = true;
		});
	});
	scene.add(model);
	console.log(model);
});
loader.load('/models/dino.glb', (glb) => {
	const model = glb.scene;
	model.scale.set(0.08, 0.08, 0.08);
	model.castShadow = true;
	model.receiveShadow = true;
	model.position.x = -1.6;
	model.position.y = 0.8342;
	model.position.z = 0.15;

	model.children.map(mesh => {
		mesh.name = 'dino';
		meshes.push(mesh);
	})

	model.name = 'dino';
	meshes.push(model);
	scene.add(model);
});

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(3,5,3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 카메라 컨트롤 시 smooth 적용 (draw 함수에 controls.update() 를 넣어야 함)
controls.maxDistance = 9; // 멀어지는 최대거리를 설정
controls.minDistance = 3.5; // 가까워지는 최소거리 설정
controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 바닥 아래를 볼 수 없도록 제한
controls.mouseButtons.RIGHT = null; // 마우스 오른쪽 드래그로 중심 축 변경 잠금

// Light
const ambientLight = new THREE.AmbientLight('white', 2);
const directionalLight = new THREE.DirectionalLight('white', 1);
// Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

directionalLight.castShadow = true; // 그림자 생성 설정
directionalLight.position.x = 4.3;
directionalLight.position.y = 4.3;
directionalLight.position.z = -4;
scene.add(ambientLight, directionalLight, directionalLightHelper);

// Mesh
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
console.log('지오메트리',floorGeometry)

floor.rotation.x = THREE.MathUtils.degToRad(-90);
floor.receiveShadow = true;
scene.add(floor);

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

	controls.update();
	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

// gsap play 여부
let isPlay = false;

gui.add(camera.position, 'x', -10, 10, 0.01)
gui.add(camera.position, 'y', -10, 10, 0.01)
gui.add(camera.position, 'z', -10, 10, 0.01)

gui.add(camera.rotation, 'x', -10, 10, 0.01).name('카메라 X 회전')
gui.add(camera.rotation, 'y', -10, 10, 0.01).name('카메라 Y 회전')
gui.add(camera.rotation, 'z', -10, 10, 0.01).name('카메라 Z 회전')

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
			x: 0, y: 0, z: 0,
			duration: 2,
			ease: 'power1.inOut',
			onStart: () => {
				isPlay = true;
				controls.enabled = false;
			},
			onComplete: () => {
				backBtn.style.bottom = '40px';
			}
		});
		gsap.to(controls.target, {
			x: -10.05, y: -0.45, z: 0.95,
			duration: 2,
			ease: 'power1.inOut',
			onComplete: () => {
				camera.lookAt(-1.6,10,0.15);
			}
		});
	}

	if (name === 'monitor') {
		gsap.to(camera.position, {
			x: -1, y: 1, z: -1,
			duration: 2,
			ease: 'power1.inOut',
			onStart: () => {
				isPlay = true;
				controls.enabled = false;
			},
			onComplete: () => {
				backBtn.style.bottom = '40px';
			}
		});
		gsap.to(controls.target, {
			x: -5, y: -0.45, z: 0.95,
			duration: 2,
			ease: 'power1.inOut',
			onComplete: () => {
				camera.lookAt(-1.6,10,0.15);
			}
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
		x: 3, y: 5, z: 3,
		duration: 1.5,
		ease: 'power2.inOut',
		onComplete: () => {
			isPlay = false;
			controls.enabled = true;
		}
	});
	gsap.to(controls.target, {
		x: 0, y: 0, z: 0,
		duration: 2,
		ease: 'power1.inOut'
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