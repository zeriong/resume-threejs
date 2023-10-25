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
    const webgl = document.querySelector('#webgl');
    const skipBtn = document.querySelector('#skipBtn');
    const dialogBox = document.querySelector('#dialogBox');
    const contentMenuBtns = document.querySelector('#contentMenuBtns');
    const playStart = document.querySelector('#playStart'); // 로딩 후 play 시작버튼
    const playSkip = document.querySelector('#playSkip'); // 로딩 후 skip 시작버튼

    // 컨텐츠 리스트
    const contentList = [
        { current: 'aboutMe1', next: 'aboutMe2', prev: 'poster' },
        { current: 'aboutMe2', next: 'projects', prev: 'aboutMe1' },
        { current: 'projects', next: 'learning', prev: 'aboutMe1' },
        { current: 'learning', next: 'skills', prev: 'projects' },
        { current: 'skills', next: 'poster', prev: 'learning' },
        { current: 'poster', next: 'aboutMe1', prev: 'skills' },
    ];

    // 대화상자 컨텐츠
    const dialogList = {
        step1: '1. 안녕하세요 프론트엔드 엔지니어 제리옹입니다. 동적인 그래픽 구현을 즐깁니다.',
        step2: '2. 열심히 하겠습니다.',
    }

    // 컨텐츠 리스트화 하여 next htmls & prev content를 구현하기 위한 변수
    let currentContent = '';
    // 컨텐츠 show 상태 여부
    let isInContent = false;
    // 카메라 무빙 상태 여부
    let isMovingCam = false;
    // 로딩화면 완료 후 start or skip 버튼 여부
    let isStart = false;

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


    /** ----------------------------------------- gsap function start -------------------------------------------- */
    // gsap functions
    const aboutMeGsap = (target) => {
        gsap.to(camera.position, {
            x: dinoPos.x, y: dinoPos.y + 0.4, z: dinoPos.z + 2.5 + fixRayCasterCamPos,
            duration: 2,
            ease: 'power1.inOut',
            onStart: () => {
                if (target) currentContent = target.name;
                dialogContent.innerHTML = dialogList.step1;
                isInContent = true;
                isMovingCam = true;
                controls.enabled = false;
                controlLimitBreak(); // down control 제한 해제
            },
            onComplete: () => {
                contentMenuBtns.style.bottom = '30px';
                dialogBox.style.display = 'block';

                setTimeout(() => {
                    isMovingCam = false;
                    dialogBox.style.opacity = '1';

                    setTimeout(() => {
                        // todo: 타이핑 이벤트 시작 함수 insert
                        console.log('타이핑 이벤트 시작');
                    }, 300);

                }, 300);
            }
        });
        gsap.to(controls.target, {
            x: dinoPos.x, y: dinoPos.y + 0.2, z: dinoPos.z,
            duration: 2,
            ease: 'power1.inOut',
        });
    }
    const projectsGsap = (target) => {
        gsap.to(camera.position, {
            x: projectsPos.x, y: projectsPos.y, z: projectsPos.z + 1.9 + fixRayCasterCamPos,
            duration: 2,
            ease: 'power1.inOut',
            onStart: () => {
                if (target) currentContent = target.name;
                isInContent = true;
                isMovingCam = true;
                controls.enabled = false;
                controlLimitBreak(); // down control 제한 해제
            },
            onComplete: () => {
                isMovingCam = false;
                contentMenuBtns.style.bottom = '30px';
                webgl.style.zIndex = -1;
            }
        });
        gsap.to(controls.target, {
            x: projectsPos.x, y: projectsPos.y, z: projectsPos.z,
            duration: 2,
            ease: 'power1.inOut',
        });
    }
    const posterGsap = (target) => {
        gsap.to(camera.position, {
            x: posterPos.x, y: posterPos.y, z: posterPos.z + 4 + fixRayCasterCamPos,
            duration: 2,
            ease: 'power1.inOut',
            onStart: () => {
                if (target) currentContent = target.name;
                isInContent = true;
                isMovingCam = true;
                controls.enabled = false;
                controlLimitBreak(); // down control 제한 해제
            },
            onComplete: () => {
                isMovingCam = false;
                contentMenuBtns.style.bottom = '30px';
                webgl.style.zIndex = -1;
            }
        });
        gsap.to(controls.target, {
            x: posterPos.x, y: posterPos.y, z:posterPos.z,
            duration: 2,
            ease: 'power1.inOut',
        });
    }
    const learningGsap = (target) => {
        gsap.to(camera.position, {
            x: learningPos.x, y: learningPos.y, z: learningPos.z + 3,
            duration: 2,
            ease: 'power1.inOut',
            onStart: () => {
                if (target) currentContent = target.name;
                isInContent = true;
                isMovingCam = true;
                controls.enabled = false;
                controlLimitBreak(); // down control 제한 해제
            },
            onComplete: () => {
                isMovingCam = false;
                contentMenuBtns.style.bottom = '30px';
                webgl.style.zIndex = -1;
            }
        });
        gsap.to(controls.target, {
            x: learningPos.x, y: learningPos.y, z: learningPos.z,
            duration: 2,
            ease: 'power1.inOut',
        });
    }
    const skillsGsap = (target) => {
        let repairSkillsZ = fixRayCasterCamPos;
        if (fixRayCasterCamPos >= 1.32) {
            repairSkillsZ = 1.32;
        }

        gsap.to(camera.position, {
            x: skillsPos.x, y: skillsPos.y, z: skillsPos.z + 1.6 + repairSkillsZ,
            duration: 2,
            ease: 'power1.inOut',
            onStart: () => {
                if (target) currentContent = target.name;
                isInContent = true;
                isMovingCam = true;
                controls.enabled = false;
                controlLimitBreak(); // control 제한 해제
            },
            onComplete: () => {
                isMovingCam = false;
                contentMenuBtns.style.bottom = '30px';
                webgl.style.zIndex = -1;
            }
        });
        gsap.to(controls.target, {
            x: skillsPos.x, y: skillsPos.y, z: skillsPos.z,
            duration: 2,
            ease: 'power1.inOut',
        });
    }
    const playStartGsap = () => {
        // 초기 start 눌러 시작할 경우 aboutMe로 설정
        currentContent = 'aboutMe1';

        gsap.to(camera.position, {
            x: (deviceWidth <= 420) ? (-18 * fixCamPos) : (0.5 * fixCamPos),
            y: (deviceWidth <= 420) ? (14.4 * fixCamPos + 5) : (5 * fixCamPos),
            z: (deviceWidth <= 420) ? (19.2 * fixCamPos) : (27 * fixCamPos),
            duration: 3,
            ease: 'power1.inOut',
            onStart: () => {
                isMovingCam = true;
                isStart = true;
                isInContent = true;
                controls.enabled = false;
                controlLimitBreak(); // down control 제한 해제
            },
            onComplete: () => {
                gsap.to(camera.position, {
                    x: dinoPos.x, y: dinoPos.y + 0.4, z: dinoPos.z + 2.5 + fixRayCasterCamPos,
                    duration: 1.5,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        contentMenuBtns.style.bottom = '30px';
                        dialogBox.style.display = 'block';

                        setTimeout(() => {
                            isMovingCam = false;
                            dialogBox.style.opacity = '1';

                            setTimeout(() => {
                                // todo: 타이핑 이벤트 시작 함수 insert
                                console.log('타이핑 이벤트 시작');
                            }, 500);

                        }, 300);
                    }
                });
                gsap.to(controls.target, {
                    x: dinoPos.x, y: dinoPos.y + 0.2, z: dinoPos.z,
                    duration: 1.5,
                    ease: 'power1.inOut',
                });
            }
        });
    }
    const backGsap = () => {
        gsap.to(camera.position, {
            // todo: main.js 에서 repairZoom 적용
            x: (deviceWidth <= 420) ? (-2.96 * fixCamPos) : (-18 * fixCamPos),
            y: (deviceWidth <= 420) ? (10.63 * fixCamPos) : (14.4 * fixCamPos),
            z: (deviceWidth <= 420) ? (30.98 * fixCamPos) : (19.2 * fixCamPos),
            duration: 2,
            ease: 'power1.inOut',
            onStart: () => {
                isMovingCam = true;

                if (isStart) {
                    isStart = false;
                    skipBtn.innerHTML = 'Back';
                }

                contentMenuBtns.style.bottom = '-70px';

                if (currentContent === 'aboutMe1' || 'aboutMe2') {
                    dialogBox.style.opacity = '0';

                    setTimeout(() => {
                        dialogBox.style.display = 'none';
                    }, 300);
                }
            },
            onComplete: () => {
                isInContent = false;
                isMovingCam = false;
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
    }
    const startSkipGsap = () => {
        skipBtn.innerHTML = 'Back';
        gsap.to(camera.position, {
            x: (deviceWidth <= 420) ? (-2.96 * fixCamPos) : (-18 * fixCamPos),
            y: (deviceWidth <= 420) ? (10.63 * fixCamPos) : (14.4 * fixCamPos),
            z: (deviceWidth <= 420) ? (30.98 * fixCamPos) : (19.2 * fixCamPos),
            duration: 0,
        });
    }

    /** ----------------------------------------- gsap function end -------------------------------------------- */


    // meshes 감지 함수
    function checkIntersects() {
        // gsap play중이거나 드래그인 경우 이벤트 x
        if (isInContent || mouseMoved) return;
        rayCaster.setFromCamera(mouse, camera); // 카메라 기준으로 ray 관통

        const intersects = rayCaster.intersectObjects(targetMeshes); // rayCaster가 meshes에 담긴 mesh를 통과하면 객체에 담음
        if (!intersects[0]) return; // intersects에 담긴 item이 없다면 return;

        // 기본적으로 rayCaster는 관통하는 모든 item을 담기 때문에 가장 처음 관통한 item(intersects[0])을 식별
        const target = intersects[0].object;

        // 모델링 클릭 카메라 줌인 무빙 애니메이션
        if (target.name === 'aboutMe1') aboutMeGsap(target);
        if (target.name === 'projects') projectsGsap(target);
        if (target.name === 'poster') posterGsap(target);
        if (target.name === 'learning') learningGsap(target);
        if (target.name === 'skills') skillsGsap(target);

        // 링크 메뉴 클릭 이벤트
        if (target.name === 'github') window.open('https://github.com/zeriong/','_blank');
        if (target.name === 'blog') window.open('https://zeriong.tistory.com/','_blank');
    }

    // 마우스 드래그 시 발생하는 rayCaster 방지
    let mouseMoved, clickStartX, clickStartY;
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
        checkIntersects();
    });

    // Skip(Back) 버튼 이벤트
    skipBtn.addEventListener('click', backGsap);
    // play start 이벤트
    playStart.addEventListener('click', playStartGsap);
    // play skip 이벤트
    playSkip.addEventListener('click', startSkipGsap);




    // 컨텐트 메뉴버튼 컨트롤
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const dialogContent = document.querySelector('.dialog-htmls');
    const contentLength = contentList.length;
    let isActivePrev = false;
    let listCount = 0;

    // todo: 구현 우선순위
    // 기본동작: next누르면 count++ , prev누르면 count--
    // next누르면 currentContent = contentList.find((val) => val.current === currentContent).next;
    // prev는 마지막에 .prev
    // 타이핑이 시작할 때 특정 변수를 true만들고, true일땐 next눌러도 count하지 않고 즉시 텍스트 모두 렌더링하고 특정 변수 false로 변환, 이후로는 next정상작동
    // count가 1보다 클 때 prev 지속
    // count가 length보다 커지면 더이상 카운트안하고 이로 인해 prev는 지속 active

    // next 버튼 이벤트
    nextBtn.addEventListener('click', () => {
        if (isMovingCam) return;

        if (contentLength > listCount) {
            listCount++;
            if (isStart) {
                isStart = false;
                skipBtn.innerHTML = 'Back';
            }
            if (!isActivePrev) {
                isActivePrev = true;
                prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
                prevBtn.style.color = 'white';
            }
        }

        const current = contentList.find(val => val.current === currentContent);

        if (currentContent === 'poster') {
            currentContent = current.next;
            aboutMeGsap();
            return;
        }
        if (currentContent === 'skills') {
            currentContent = current.next;
            posterGsap();
            return;
        }
        console.log('넥스트 커런트~~~~~',current)
        if (currentContent === 'learning') {
            currentContent = current.next;
            skillsGsap();
            return;
        }
        if (currentContent === 'projects') {
            currentContent = current.next;
            learningGsap();
            return;
        }
        if (currentContent === 'aboutMe2') {
            currentContent = current.next;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            dialogBox.style.opacity = '0';

            setTimeout(() => {
                dialogBox.style.display = 'none';
                projectsGsap();
            }, 300);
            return;
        }
        if (currentContent === 'aboutMe1') {
            currentContent = current.next;

            // todo: 타이핑 이벤트 추가
            dialogContent.innerHTML = dialogList.step2;
        }
    });

    // prev 버튼 이벤트
    prevBtn.addEventListener('click', () => {
        if (listCount === 0 || isMovingCam) return console.log('안돼')
        if (contentLength > listCount) listCount--;
        // aboutMe의 경우 2가지 step이 존재하기 때문에 한번 더 감소
        if (currentContent === 'projects') listCount--;

        // 버튼 비활성화
        if (listCount === 0 && isActivePrev) {
            isActivePrev = false;
            prevBtn.style.backgroundColor = "rgb(185, 188, 190)";
            prevBtn.style.color = '#d3d3d3';
        }

        const current = contentList.find(val => val.current === currentContent);

        if (currentContent === 'aboutMe1') {
            currentContent = current.prev;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            dialogBox.style.opacity = '0';

            setTimeout(() => {
                dialogBox.style.display = 'none';
                posterGsap();
            }, 300);

            return;
        }
        // todo: 타이핑이벤트 추가하여 내용만 변경
        if (currentContent === 'aboutMe2') {
            currentContent = current.prev;
            dialogContent.innerHTML = dialogList.step1;
            return;
        }
        if (currentContent === 'projects') {
            currentContent = current.prev;
            aboutMeGsap();
            return;
        }
        if (currentContent === 'learning') {
            currentContent = current.prev;
            projectsGsap();
            return;
        }
        if (currentContent === 'skills') {
            currentContent = current.prev;
            learningGsap();
            return;
        }
        if (currentContent === 'poster') {
            currentContent = current.prev;
            skillsGsap();
        }
    });

    // prev 버튼 활성화 시 hover 애니메이션
    prevBtn.addEventListener('mouseenter', () => {
        if (isMovingCam) return;
        if (isActivePrev) {
            prevBtn.style.backgroundColor = "rgb(95, 104, 110)";
        }
    });
    prevBtn.addEventListener('mouseleave', () => {
        if (isMovingCam) return;
        if (isActivePrev) {
            prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
        }
    });






    // 테스트 이벤트
    const testEvent = document.querySelector('#test');

    function testHandler() {
        console.log('테스트')
    }

    testEvent.addEventListener('click', testHandler);
}




















