import * as THREE from 'three';
import {targetMeshes} from '../loader/MainLoader';
import gsap from 'gsap';
import {monitorPosition} from '../loader/Room';

export const setRayCaster = (renderDom, camera, controls) => {
    // RayCaster
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // QuerySelectors
    const backBtn = document.querySelector('#back-btn');
    const webgl = document.querySelector('#webgl');

    // 컨트롤 제한
    const downControlLimitSet = () => controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
    // 컨트롤 제한 해제
    const downControlLimitBreak = () => controls.maxPolarAngle = THREE.MathUtils.degToRad(360);

    // gsap play 여부
    let isPlay = false;

    // meshes 감지 함수
    function checkIntersects() {
        // gsap play중이거나 드래그인 경우 이벤트 x
        if (isPlay || mouseMoved) return;
        rayCaster.setFromCamera(mouse, camera); // 카메라 기준으로 ray 관통

        const intersects = rayCaster.intersectObjects(targetMeshes); // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        console.log('meshes 입니다~', targetMeshes);
        console.log('intersects 입니다~', intersects);
        if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intesrsects[0])을 식별
        const name = intersects[0].object.name;

        console.log('야호~',intersects[0])

        /** ------ 모델링 클릭 카메라 줌인 무빙 애니메이션 ------ */
        if (name === 'dino') {
            console.log('디노에요')
            gsap.to(camera.position, {
                x: 0, y: 1.4, z: 1,
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
                x: 0, y: 1.1, z: -4,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (name === 'monitor') {
            console.log('모니터 정보', intersects[0])
            gsap.to(camera.position, {
                x: monitorPosition.x, y: monitorPosition.y, z: monitorPosition.z + 2,
                duration: 2,
                ease: 'power1.inOut',
                onStart: () => {
                    isPlay = true;
                    controls.enabled = false;
                    downControlLimitBreak(); // down control 제한 해제
                },
                onComplete: () => {
                    backBtn.style.bottom = '40px';
                    webgl.style.zIndex = -1;
                }
            });
            gsap.to(controls.target, {
                x: monitorPosition.x, y: monitorPosition.y, z: -5,
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
    renderDom.addEventListener('mousedown', e => {
        clickStartX = e.clientX;
        clickStartY = e.clientY;
    });
    renderDom.addEventListener('mouseup', e => {
        const gapX = Math.abs(e.clientX - clickStartX);
        const gapY = Math.abs(e.clientY - clickStartY);
        mouseMoved = gapX > 5 || gapY > 5;
    });

    // meshes 감지 클릭 이벤트
    renderDom.addEventListener('click', e => {
        // 마우스 클릭 위치 정교화
        mouse.x = e.clientX / renderDom.clientWidth * 2 - 1;
        mouse.y = -(e.clientY / renderDom.clientHeight * 2 - 1);
        // console.log(mouse);
        checkIntersects();
        console.log('클릭감지~',e)
    });

    // Back 버튼 이벤트
    backBtn.addEventListener('click', () => {
        backBtn.style.bottom = '-120px';
        gsap.to(camera.position, {
            x: -14, y: 12, z: 14,
            duration: 2,
            ease: 'power1.inOut',
            onComplete: () => {
                isPlay = false;
                controls.enabled = true;
                webgl.style.zIndex = 0;
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