import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader';


export default function drawThree() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
	renderer.shadowMap.enabled = true; // 그림자 설정
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 맵 타입 설정

	// Scene
	const scene = new THREE.Scene();
	scene.background = new THREE.Color('skyblue');

	// Loader
	const loader = new GLTFLoader();

	loader.load('/models/room.glb', (glb) => {
		const model = glb.scene;
		model.castShadow = true;
		model.receiveShadow = true;
		model.position.y = -0.2;

		// 모델링에 포함된 모든 mesh의 그림자 표현
		model.children.map(mesh => {
			mesh.castShadow = true;
			mesh.receiveShadow = true;

			mesh.children.map(meshChildren => {
				meshChildren.castShadow = true;
				meshChildren.receiveShadow = true;
			});
		});

		scene.add(model);
		console.log(model);
	});

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.x = 3;
	camera.position.y = 5;
	camera.position.z = 5;
	camera.lookAt(0,0,0);
	scene.add(camera);

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

	// Geometry & Material
	const floorGeometry = new THREE.PlaneGeometry(15, 15, 50);
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: 'white',
		side: THREE.DoubleSide,
	});

	// Mesh
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);

	floor.rotation.x = THREE.MathUtils.degToRad(-90);
	floor.receiveShadow = true;

	scene.add(floor);

	// AxesHelper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	// 디바이스 스펙 차이로 생기는 이슈를 보정하기 위한 시간값 객체
	const clock = new THREE.Clock();

	function draw() {
		const time = clock.getElapsedTime(); // 경과시간

		// 조명 위치를 원형으로 배회하며 테스팅
		directionalLight.position.x = Math.cos(time) * 5;
		directionalLight.position.z = Math.sin(time) * 5;

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	// resize 이벤트
	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	window.addEventListener('resize', setSize);

	draw();
}
