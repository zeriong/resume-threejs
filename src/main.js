import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls';
import {particleGeometry, particleMaterial, runLightParticle, setMeshes} from './meshes/Meshes';
import dat from 'dat.gui';
import {setLights} from './lights/Lights';
import {modelsLoad} from './loader/MainLoader';
import {setRayCaster} from './rayCaster/RayCaster';
import {setSize} from './common/Libs';
import {CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer';
import {RenderPass} from 'three/addons/postprocessing/RenderPass';
import {ShaderPass} from "three/addons/postprocessing/ShaderPass";
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass';

/**
 * 반응형: 1400px 이하일때 적용해야함
 * 특정 변수 생성 후 렌더링 후 window.width 담는녀석 넣기
 * 1400... 기준으로 생각해보자
 * (1400 - 현재 width) x ...
 * */

// 브라우저 width
export const deviceWidth = window.innerWidth;
console.log('deviceWidth입니다~~~ : ', deviceWidth);

// 반응형 대응 rayCaster camera position (z축에 더할 값 생성)
const repairRayCasterCameraPos = () => {
	if (deviceWidth >= 1400) return 0;
	return (1400 - deviceWidth) * 0.003;
}
export const fixRayCasterCamPos = repairRayCasterCameraPos();

// 반응형 대응 camera position (모든 축에 곱할 값 생성) todo: 적용
const repairCameraPos = () => {
	if (deviceWidth >= 1400) return 1;
	return (1400 - deviceWidth) * (deviceWidth <= 420 ? 0.0003 : 0.0007) + 1;
}
export const fixCamPos = repairCameraPos();

// Dat GUI
const gui = new dat.GUI();

// Three Canvas, HTML
const webgl = document.querySelector('#webgl');
const css3DObject = document.querySelector(`#css3DObject`);
webgl.style.display = 'none'  // 모델링 렌더링 전에 보이지 않도록 설정

// Renderer
const renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true,
	powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true; // 그림자 설정
renderer.shadowMap.type = THREE.VSMShadowMap; // 그림자 맵 타입 설정
renderer.domElement.style.position = 'absolute';
webgl.appendChild(renderer.domElement);

// CSS 3D Renderer
const cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
css3DObject.appendChild(cssRenderer.domElement);

const scene = new THREE.Scene();  // Scene
scene.background = new THREE.Color(0x61657a);

const cssScene = new THREE.Scene();  // CSS Scene

// Camera todo: 작업 끝나고 export 제거 후 주석 제거
export const camera = new THREE.PerspectiveCamera(24, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-29.9, 23.76, 31.68); // 모바일 적합 포지션
// camera.position.set(-18, 14.4, 19.2); // default pc 적합 포지션
// 입장 애니메이션 시작지점 (pc)
camera.position.set(
	(deviceWidth <= 420) ? (-2.96 * fixCamPos) : (-24 * fixCamPos),
	(deviceWidth <= 420) ? (10.63 * fixCamPos) : (14.4 * fixCamPos),
	(deviceWidth <= 420) ? (30.98 * fixCamPos) : (14 * fixCamPos),
);

scene.add(camera);

// Controls todo: 작업 끝나고 export 제거 후 target주석 제거
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true; // 카메라 컨트롤 시 smooth 적용 (draw 함수에 controls.update() 를 넣어야 함)
controls.maxDistance = 100; // 멀어지는 최대거리를 설정
controls.minDistance = 5; // 가까워지는 최소거리 설정
controls.mouseButtons.RIGHT = null; // 마우스 오른쪽 드래그로 중심 축 변경 잠금
controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 바닥 아래를 볼 수 없도록 제한
controls.target.set(1,1,2)

// EffectComposer
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const CustomShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"saturation": { value: 1.0 },
		"contrast": { value: 1.0 },
		"brightness": { value: 0.0 },
		"colorTint": { value: new THREE.Color(0xffffff) }  // 특정 색감 유니폼 추가
	},
	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
		"    vUv = uv;",
		"    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
		"}"
	].join('\n'),
	fragmentShader: [
		"uniform sampler2D tDiffuse;",
		"uniform float saturation;",
		"uniform float contrast;",
		"uniform float brightness;",
		"uniform vec3 colorTint;",  // 특정 색감 유니폼 사용
		"varying vec2 vUv;",
		"void main() {",
		"    vec4 color = texture2D(tDiffuse, vUv);",
		"    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));",
		"    vec3 satColor = mix(vec3(gray), color.rgb, saturation);",
		"    vec3 tintedColor = satColor * colorTint;",  // 특정 색감 적용
		"    vec3 mid = vec3(0.5);",
		"    vec3 conColor = mix(mid, tintedColor, contrast);",  // 대비 개선
		"    gl_FragColor = vec4(conColor + brightness, color.a);",
		"}"
	].join('\n')
};


const customPass = new ShaderPass(CustomShader);
customPass.uniforms.saturation.value = 0.9;  // 채도
customPass.uniforms.contrast.value = 0.9;    // 대비
customPass.uniforms.brightness.value = 0.0;  // 밝기
composer.addPass(customPass);

const smaaPass = new SMAAPass();
composer.addPass(smaaPass);

setLights(scene);  // set Lights
modelsLoad(webgl, scene, cssScene, cssRenderer.domElement);// Models Load
setRayCaster(renderer.domElement, camera, controls);  // set RayCaster
setMeshes(scene);  // set Meshes

// AxesHelper
const axesHelper = new THREE.AxesHelper(10);
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
	// renderer.render(scene, camera);
	composer.render();
	cssRenderer.render(cssScene, camera);

	requestAnimationFrame(draw);
}

// gui.add(camera.position, 'x', -10, 100, 0.01);
// gui.add(camera.position, 'y', -10, 100, 0.01);
// gui.add(camera.position, 'z', -10, 100, 0.01);
//
// gui.add(camera.rotation, 'x', -10, 100, 0.01).name('카메라 X 회전');
// gui.add(camera.rotation, 'y', -10, 100, 0.01).name('카메라 Y 회전');
// gui.add(camera.rotation, 'z', -10, 100, 0.01).name('카메라 Z 회전');

// resize 시 동적으로 scale 변경
window.addEventListener('resize', () => setSize(renderer, cssRenderer, scene, camera));

draw();
