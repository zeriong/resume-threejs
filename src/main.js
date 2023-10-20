import './main.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {runLightParticle, setMeshes} from './meshes/Meshes';
import dat from 'dat.gui';
import {setLights} from './lights/Lights';
import {modelsLoad} from './loader/MainLoader';
import {setRayCaster} from './rayCaster/RayCaster';
import {setSize} from './common/Libs';
import {CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer';
console.log('main.js start!!!!!!!!!!!!!!!!!!!!!!!!!')
console.log('main.js content: ', document.querySelector('#hi').style)
// Dat GUI
const gui = new dat.GUI();

// Three Canvas, HTML
const webgl = document.querySelector('#webgl');
const css3DObject = document.querySelector(`#css3DObject`);
webgl.style.display = 'none'  // 모델링 렌더링 전에 보이지 않도록 설정

// Renderer
const renderer = new THREE.WebGLRenderer({
	color: new THREE.Color('black'),
	antialias: true,
	alpha: true,
	powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true; // 그림자 설정
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 맵 타입 설정
renderer.domElement.style.position = 'absolute';
webgl.appendChild(renderer.domElement);

// CSS 3D Renderer
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
css3DObject.appendChild(cssRenderer.domElement);

const scene = new THREE.Scene();  // Scene
const cssScene = new THREE.Scene();  // CSS Scene

// Camera
const camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 1, 8000);
camera.position.set(-22.5, 18, 24);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true; // 카메라 컨트롤 시 smooth 적용 (draw 함수에 controls.update() 를 넣어야 함)
controls.maxDistance = 40; // 멀어지는 최대거리를 설정
controls.minDistance = 5; // 가까워지는 최소거리 설정
controls.mouseButtons.RIGHT = null; // 마우스 오른쪽 드래그로 중심 축 변경 잠금
controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 바닥 아래를 볼 수 없도록 제한
controls.target.set(1,1,2)

setLights(scene);  // set Lights
modelsLoad(webgl, scene, cssScene, cssRenderer.domElement);// Models Load
setRayCaster(renderer.domElement, camera, controls);  // set RayCaster
setMeshes(scene);  // set Meshes

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

	runLightParticle();
	controls.update();
	renderer.render(scene, camera);
	cssRenderer.render(cssScene, camera);

	requestAnimationFrame(draw);
}

gui.add(camera.position, 'x', -10, 100, 0.01);
gui.add(camera.position, 'y', -10, 100, 0.01);
gui.add(camera.position, 'z', -10, 100, 0.01);

gui.add(camera.rotation, 'x', -10, 100, 0.01).name('카메라 X 회전');
gui.add(camera.rotation, 'y', -10, 100, 0.01).name('카메라 Y 회전');
gui.add(camera.rotation, 'z', -10, 100, 0.01).name('카메라 Z 회전');

// resize 시 동적으로 scale 변경
window.addEventListener('resize', () => setSize(renderer, cssRenderer, scene, camera));

draw();
