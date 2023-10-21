import * as THREE from 'three';
import {targetMeshes} from '../loader/MainLoader';
import gsap from 'gsap';
import {monitorPosition} from '../loader/Room';

export const skillsPos = new THREE.Vector3();

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
        if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intesrsects[0])을 식별
        const target = intersects[0].object;

        /** ------ 모델링 클릭 카메라 줌인 무빙 애니메이션 ------ */
        if (target.name === 'dino') {
            console.log('디노에요')
            gsap.to(camera.position, {
                x: 1, y: 1.4, z: 3,
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
                x: 1, y: 1.1, z: -2,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'monitor') {
            console.log('모니터', intersects[0]);

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
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'poster') {
            console.log('poster', intersects[0]);

            const position = new THREE.Vector3();
            target.getWorldPosition(position);

            gsap.to(camera.position, {
                x: position.x, y: position.y, z: position.z + 3,
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
                x: position.x, y: position.y, z: -2,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'learning') {
            console.log('learning', intersects[0])

            const position = new THREE.Vector3();
            target.getWorldPosition(position);

            gsap.to(camera.position, {
                x: position.x, y: position.y, z: position.z + 2,
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
                x: position.x, y: position.y, z: -3,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'skills') {
            console.log('skills', intersects[0])

            target.getWorldPosition(skillsPos);

            gsap.to(camera.position, {
                x: skillsPos.x, y: skillsPos.y, z: skillsPos.z + 1,
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
                x: skillsPos.x, y: skillsPos.y, z: -3.5,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        /** ------ 메뉴 클릭 이벤트 ------ */
        if (target === 'github') {
            console.log('github');
            window.open('https://github.com/zeriong/','_blank');
        }
        if (target === 'projects') console.log('projects');
        if (target === 'aboutMe') console.log('aboutMe');
        if (target === 'skills') console.log('skills');
        if (target === 'learning') console.log('learning');
        if (target === 'blog') console.log('blog');
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
        // console.log('클릭감지~',e)
    });

    // Back 버튼 이벤트
    backBtn.addEventListener('click', () => {
        backBtn.style.bottom = '-120px';
        window.getSelection().removeAllRanges()
        gsap.to(camera.position, {
            x: -13, y: 12, z: 16,
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
            x: 1, y: 1, z: 2,
            duration: 2,
            ease: 'power1.inOut',
        });
    });
}