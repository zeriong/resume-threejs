import * as THREE from 'three';
import {targetMeshes} from '../loader/MainLoader';
import gsap from 'gsap';
import {learningPos, projectsPos, posterPos, skillsPos} from '../loader/Room';
import {dinoPos} from '../loader/Dino';
import {deviceWidth, fixCamPos, fixRayCasterCamPos} from '../main';

export const setRayCaster = (renderDom, camera, controls) => {
    // RayCaster
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // QuerySelectors
    const backBtn = document.querySelector('#back-btn');
    const dialogBox = document.querySelector('#dialogBox');
    const webgl = document.querySelector('#webgl');

    let isAboutMe = false;

    // 컨트롤 제한
    const controlLimitSet = () => {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
        controls.minDistance = 5; // 가까워지는 최소거리 설정
    }
    // 컨트롤 제한 해제
    const controlLimitBreak = () => {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(360);
        controls.minDistance = 0; // 가까워지는 최소거리 설정
    }

    // gsap play 여부
    let isPlay = false;

    // meshes 감지 함수
    function checkIntersects() {
        // gsap play중이거나 드래그인 경우 이벤트 x
        if (isPlay || mouseMoved) return;
        rayCaster.setFromCamera(mouse, camera); // 카메라 기준으로 ray 관통

        const intersects = rayCaster.intersectObjects(targetMeshes); // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intersects[0])을 식별
        const target = intersects[0].object;

        /** ------ 모델링 클릭 카메라 줌인 무빙 애니메이션 ------ */
        if (target.name === 'aboutMe') {
            console.log('aboutMe!!!!')
            gsap.to(camera.position, {
                x: dinoPos.x, y: dinoPos.y + 0.4, z: dinoPos.z + 2.5 + fixRayCasterCamPos,
                duration: 2,
                ease: 'power1.inOut',
                onStart: () => {
                    isPlay = true;
                    isAboutMe = true;
                    controls.enabled = false;
                    controlLimitBreak(); // down control 제한 해제
                },
                onComplete: () => {
                    backBtn.style.bottom = '40px';
                    dialogBox.style.bottom = '20px';
                }
            });
            gsap.to(controls.target, {
                x: dinoPos.x, y: dinoPos.y + 0.2, z: dinoPos.z,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'projects') {
            console.log('projects', intersects[0]);

            gsap.to(camera.position, {
                x: projectsPos.x, y: projectsPos.y, z: projectsPos.z + 1.9 + fixRayCasterCamPos,
                duration: 2,
                ease: 'power1.inOut',
                onStart: () => {
                    isPlay = true;
                    controls.enabled = false;
                    controlLimitBreak(); // down control 제한 해제
                },
                onComplete: () => {
                    backBtn.style.bottom = '40px';
                    webgl.style.zIndex = -1;
                }
            });
            gsap.to(controls.target, {
                x: projectsPos.x, y: projectsPos.y, z: projectsPos.z,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'poster') {
            console.log('poster', intersects[0]);

            gsap.to(camera.position, {
                x: posterPos.x, y: posterPos.y, z: posterPos.z + 4 + fixRayCasterCamPos,
                duration: 2,
                ease: 'power1.inOut',
                onStart: () => {
                    isPlay = true;
                    controls.enabled = false;
                    controlLimitBreak(); // down control 제한 해제
                },
                onComplete: () => {
                    backBtn.style.bottom = '40px';
                    webgl.style.zIndex = -1;
                }
            });
            gsap.to(controls.target, {
                x: posterPos.x, y: posterPos.y, z:posterPos.z,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'learning') {
            console.log('learning', intersects[0])

            gsap.to(camera.position, {
                x: learningPos.x, y: learningPos.y, z: learningPos.z + 3,
                duration: 2,
                ease: 'power1.inOut',
                onStart: () => {
                    isPlay = true;
                    controls.enabled = false;
                    controlLimitBreak(); // down control 제한 해제
                },
                onComplete: () => {
                    backBtn.style.bottom = '40px';
                    webgl.style.zIndex = -1;
                }
            });
            gsap.to(controls.target, {
                x: learningPos.x, y: learningPos.y, z: learningPos.z,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        if (target.name === 'skills') {
            console.log('skills', intersects[0])
            let repairSkillsZ = fixRayCasterCamPos;
            if (fixRayCasterCamPos >= 1.32) {
                repairSkillsZ = 1.32;
            }
            console.log(repairSkillsZ)

            gsap.to(camera.position, {
                x: skillsPos.x, y: skillsPos.y, z: skillsPos.z + 1.6 + repairSkillsZ,
                duration: 2,
                ease: 'power1.inOut',
                onStart: () => {
                    isPlay = true;
                    controls.enabled = false;
                    controlLimitBreak(); // control 제한 해제
                },
                onComplete: () => {
                    backBtn.style.bottom = '40px';
                    webgl.style.zIndex = -1;
                }
            });
            gsap.to(controls.target, {
                x: skillsPos.x, y: skillsPos.y, z: skillsPos.z,
                duration: 2,
                ease: 'power1.inOut',
            });
        }

        /** ------ 링크 메뉴 클릭 이벤트 ------ */
        if (target.name === 'github') {
            console.log('github');
            window.open('https://github.com/zeriong/','_blank');
        }
        if (target.name === 'blog') {
            console.log('blog');
            window.open('https://zeriong.tistory.com/','_blank');
        }
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
        if (isAboutMe) {
            dialogBox.style.bottom = '-30%';
            isAboutMe = false;
        }
        backBtn.style.bottom = '-120px';

        gsap.to(camera.position, {
            // todo: main.js 에서 repairZoom 적용
            x: -18, y: 14.4, z: 19.2,
            duration: 2,
            ease: 'power1.inOut',
            onComplete: () => {
                isPlay = false;
                controls.enabled = true;
                webgl.style.zIndex = 0;
                controlLimitSet(); // control 제한
            }
        });
        gsap.to(controls.target, {
            x: 1, y: 1, z: 2,
            duration: 2,
            ease: 'power1.inOut',
        });
    });
    backBtn.addEventListener('mouseenter', () => {
        backBtn.style.color = 'rgb(37 99 235)';
        backBtn.style.backgroundColor = 'white';
    });
    backBtn.addEventListener('mouseleave', () => {
        backBtn.style.color = 'white';
        backBtn.style.backgroundColor = 'rgb(37 99 235)';
    });

    // 로딩 후 시작버튼 이벤트(객체지향 구조로 변경 시 분리 필요)
    const playStart = document.querySelector('#playStart');
    playStart.addEventListener('click', () => {
        gsap.to(camera.position, {
            x: (deviceWidth <= 420) ? (-18 * fixCamPos) : (0.5 * fixCamPos),
            y: (deviceWidth <= 420) ? (14.4 * fixCamPos) : (5 * fixCamPos),
            z: (deviceWidth <= 420) ? (19.2 * fixCamPos) : (27 * fixCamPos),
            duration: 3,
            ease: 'power1.inOut',
            onComplete: () => {
                gsap.to(camera.position, {
                    x: dinoPos.x, y: dinoPos.y + 0.4, z: dinoPos.z + 2.5 + fixRayCasterCamPos,
                    duration: 1.5,
                    ease: 'power1.inOut',
                    onStart: () => {
                        isPlay = true;
                        isAboutMe = true;
                        controls.enabled = false;
                        controlLimitBreak(); // down control 제한 해제
                    },
                    onComplete: () => {
                        backBtn.style.bottom = '40px';
                        dialogBox.style.bottom = '20px';
                    }
                });
                gsap.to(controls.target, {
                    x: dinoPos.x, y: dinoPos.y + 0.2, z: dinoPos.z,
                    duration: 1.5,
                    ease: 'power1.inOut',
                });
            }
        })
    })

    // 테스트 이벤트
    const testEvent = document.querySelector('#test');
    testEvent.addEventListener('click', () => {
        const repair_Zoom = repairCameraPos();
        console.log('repairZoom: ',repair_Zoom)
        console.log(camera.position)
    });
}

