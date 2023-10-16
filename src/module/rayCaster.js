import * as THREE from 'three';
import {meshes, monitorPosition} from './loads';
import gsap from 'gsap';

export const setRayCaster = (canvas, camera, controls) => {
    // RayCaster
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 컨트롤 제한
    const downControlLimitSet = () => controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
    // 컨트롤 제한 해제
    const downControlLimitBreak = () => controls.maxPolarAngle = THREE.MathUtils.degToRad(360);

    // gsap play 여부
    let isPlay = false;

    // mesh 감지 함수
    function checkIntersects() {
        // gsap play중이거나 드래그인 경우 이벤트 x
        if (isPlay || mouseMoved) return;
        rayCaster.setFromCamera(mouse, camera); // 카메라 기준으로 ray 관통

        const intersects = rayCaster.intersectObjects(meshes); // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intesrsects[0])을 식별
        const name = intersects[0].object.name;

        /** ------ 모델링 클릭 카메라 줌인 무빙 애니메이션 ------ */
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

        /** ------ 메뉴 클릭 이벤트 ------ */
        if (name === 'github') {
            console.log('github');
            window.open('https://github.com/zeriong/','_blank');
        }
        if (name === 'projects') console.log('projects');
        if (name === 'aboutMe') console.log('aboutMe');
        if (name === 'skills') console.log('skills');
        if (name === 'learning') console.log('learning');
        if (name === 'blog') console.log('blog');
    }

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
}