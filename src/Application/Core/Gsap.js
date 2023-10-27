import gsap from 'gsap';
import Application from '../Application';
import * as THREE from 'three';

export default class Gsap {
    constructor() {
        const app = Application.getInstance();
        this.sizes = app.sizes;
        this.isInContent = false;
        this.fixCameraPosition = this.cameraPositionFixer();
        this.currentContent = '';
        this.listCount = 0;
        this.isActivePrev = false;

        // Elements
        this.webgl = document.querySelector('#webgl');
        this.dialogBox = document.querySelector('#dialogBox');
        this.dialogContent = document.querySelector('.dialog-content');
        this.returnToOrbitBtn = document.querySelector('#returnToOrbitBtn');
        this.contentMenuBtns = document.querySelector('#contentMenuBtns');
        this.playStart = document.querySelector('#playStart');
        this.playSkip = document.querySelector('#playSkip');
        this.nextBtn = document.querySelector('#nextBtn');
        this.prevBtn = document.querySelector('#prevBtn');


        this.dialogList = {
            step1: '1. 안녕하세요 프론트엔드 엔지니어 제리옹입니다. 동적인 그래픽 구현을 즐깁니다.',
            step2: '2. 열심히 하겠습니다.',
        }

        // 버튼 hover styles
        this.prevBtn.addEventListener('mouseenter', () => {
            if (this.isMovingCam) return;
            if (this.isActivePrev) this.prevBtn.style.backgroundColor = "rgb(95, 104, 110)";
        });
        this.prevBtn.addEventListener('mouseleave', () => {
            if (this.isMovingCam) return;
            if (this.isActivePrev) this.prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
        });

        this.playStart.addEventListener('click', () => this.playStartAnimation());
        this.playSkip.addEventListener('click', () => this.playAnimationSkip());
        this.returnToOrbitBtn.addEventListener('click', () => this.returnToOrbit());
        this.nextBtn.addEventListener('click', () => this.toNext());
        this.prevBtn.addEventListener('click', () => this.toPrev());
    }

    toContent(target, isBtn) {
        // getRequireInstance를 사용하여 최신데이터 사용
        const { camera, controls, contentList } = this.getRequireInstance();

        const current = contentList.find((val) => val.current === target);

        this.convertChairTransParent('invisible');

        gsap.to(camera.position, {
            ...current.cameraPosition, duration: 2, ease: 'power1.inOut',
            onStart: () => {
                if (!isBtn) this.currentContent = target;
                this.dialogContent.innerHTML = this.dialogList.step1;
                this.isInContent = true;
                this.isMovingCam = true;
                controls.enabled = false;
                this.controlLimitBreak(controls); // down control 제한 해제
            },
            onComplete: () => {
                this.contentMenuBtns.style.bottom = '30px';
                this.dialogBox.style.display = 'block';
                if (target === 'aboutMe1') this.appearDialog();
                else this.isMovingCam = false;
            }
        });
        gsap.to(controls.target, {
            ...current.controlsTarget, duration: 2, ease: 'power1.inOut',
        });
    }

    // orbitControls 모드로 전환
    returnToOrbit() {
        if (this.isMovingCam) return;
        this.listCount = 0;

        // prev 버튼 비활성화
        this.offPrev();

        this.convertChairTransParent('visible');

        const { app, camera, controls } = this.getRequireInstance();
        gsap.to(camera.position, {
            duration: 2, ease: 'power1.inOut',
            x: (this.sizes.width <= 420) ? (-2.96 * this.fixCameraPosition) : (-18 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (10.63 * this.fixCameraPosition) : (14.4 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (30.98 * this.fixCameraPosition) : (19.2 * this.fixCameraPosition),
            onStart: () => {
                this.isMovingCam = true;

                if (app.isStart) {
                    app.isStart = false;
                    this.returnToOrbitBtn.innerHTML = 'Back';
                }

                this.contentMenuBtns.style.bottom = '-70px';
                if (this.currentContent === 'aboutMe1' || 'aboutMe2') this.disappearDialog();
            },
            onComplete: () => {
                this.isInContent = false;
                this.isMovingCam = false;
                controls.enabled = true;
                this.webgl.style.zIndex = 0;
                this.controlLimitSet(controls); // control 제한
            }
        });
        gsap.to(controls.target, {
            x: 1, y: 1, z: 2,
            duration: 2,
            ease: 'power1.inOut',
        });
    }

    // Start로 시작
    playStartAnimation() {
        const { app, controls, camera, contentList } = this.getRequireInstance();
        // 초기 start 눌러 시작할 경우 aboutMe1로 설정
        this.currentContent = 'aboutMe1';

        gsap.to(camera.position, {
            duration: 3, ease: 'power1.inOut',
            x: (this.sizes.width <= 420) ? (-18 * this.fixCameraPosition) : (0.5 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (14.4 * this.fixCameraPosition + 5) : (5 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (19.2 * this.fixCameraPosition) : (27 * this.fixCameraPosition),
            onStart: () => {
                this.isMovingCam = true;
                this.isInContent = true;
                controls.enabled = false;
                app.isStart = true;
                this.controlLimitBreak(controls); // down control 제한 해제
                this.convertChairTransParent('invisible', 3000, 1.5);
            },
            onComplete: () => {
                gsap.to(camera.position, {
                    ...contentList[0].cameraPosition, duration: 1.5, ease: 'power1.inOut',
                    onComplete: () => {
                        this.isMovingCam = false;
                        this.contentMenuBtns.style.bottom = '30px';
                        this.dialogBox.style.display = 'block';
                        this.appearDialog();
                    }
                });
                gsap.to(controls.target, {
                    ...contentList[0].controlsTarget, duration: 1.5, ease: 'power1.inOut',
                });
            }
        });
    }

    // Skip으로 시작
    playAnimationSkip() {
        this.returnToOrbitBtn.innerHTML = 'Back';
        gsap.to(Application.getInstance().camera.instance.position, {
            x: (this.sizes.width <= 420) ? (-2.96 * this.fixCameraPosition) : (-18 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (10.63 * this.fixCameraPosition) : (14.4 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (30.98 * this.fixCameraPosition) : (19.2 * this.fixCameraPosition),
            duration: 0,
        });
    }

    // Next 버튼 클릭 매서드
    toNext() {
        if (this.isMovingCam) return;

        const { app, contentList, camera, controls } = this.getRequireInstance();

        if (contentList.length > this.listCount) {
            this.listCount++;
            if (app.isStart) {
                app.isStart = false;
                this.returnToOrbitBtn.innerHTML = 'Back';
            }

        }

        // prev 버튼 활성화
        this.onPrev();

        const current = contentList.find(val => val.current === this.currentContent);

        if (this.currentContent === 'aboutMe2') {
            this.currentContent = current.next;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.dialogBox.style.opacity = '0';
            this.isMovingCam = true;
            setTimeout(() => {
                this.dialogBox.style.display = 'none';
                this.toContent(current.next, true);
            }, 300);
            return;
        }
        if (this.currentContent === 'aboutMe1') {
            this.currentContent = current.next;

            // todo: 타이핑 이벤트 추가
            this.dialogContent.innerHTML = this.dialogList.step2;
            return;
        }

        this.toContent(current.next, true);
        this.currentContent = current.next;
    }

    // Prev 버튼 클릭 매서드
    toPrev() {
        if (this.listCount === 0 || this.isMovingCam) return console.log('안돼')

        const { app, contentList, camera, controls } = this.getRequireInstance();

        if (contentList.length > this.listCount) this.listCount--;
        // aboutMe의 경우 2가지 step이 존재하기 때문에 한번 더 감소
        if (this.currentContent === 'projects') this.listCount--;

        // count가 0이고 활성화상태라면 비활성화
        this.offPrev();

        const current = contentList.find(val => val.current === this.currentContent);

        if (this.currentContent === 'aboutMe1') {
            this.currentContent = current.prev;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.dialogBox.style.opacity = '0';
            this.isMovingCam = true;
            setTimeout(() => {
                this.dialogBox.style.display = 'none';
                this.toContent(current.prev, true);
            }, 300);

            return;
        }
        if (this.currentContent === 'aboutMe2') {
            // todo: 타이핑이벤트 추가하여 내용만 변경
            this.currentContent = current.prev;
            this.dialogContent.innerHTML = this.dialogList.step1;
            return;
        }

        this.toContent(current.prev, true);
        this.currentContent = current.prev;
    }

    // 버튼 활성화 매서드
    onPrev() {
        if (!this.isActivePrev) {
            this.isActivePrev = true;
            this.prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
            this.prevBtn.style.color = 'white';
        }
    }

    // 버튼 비활성화 매서드
    offPrev() {
        if (this.listCount === 0 && this.isActivePrev) {
            this.isActivePrev = false;
            this.prevBtn.style.backgroundColor = "rgb(185, 188, 190)";
            this.prevBtn.style.color = '#d3d3d3';
        }
    }

    // 의자 등받이 투명화 on/off
    convertChairTransParent(type, ms = 0, duration = 2) {
        const intersectsMeshes = Application.getInstance().intersectsMeshes;
        if (type === 'invisible') {
            setTimeout(() => {
                intersectsMeshes.forEach(mesh => {
                    if (mesh.name === ('chair1') || mesh.name === ('chair2') || mesh.name === ('chair3')) {
                        gsap.to(mesh.material, { transparent: true, opacity: 0, duration });
                    }
                });
            }, ms);
        }
        if (type === 'visible') {
            intersectsMeshes.forEach(mesh => {
                if (mesh.name === ('chair1') || mesh.name === ('chair2') || mesh.name === ('chair3')) {
                    gsap.to(mesh.material, { transparent: false, opacity: 1, duration });
                }
            });
        }
    }

    // about me 대화창 등장 매서드
    appearDialog() {
        setTimeout(() => {
            this.dialogBox.style.opacity = '1';

            setTimeout(() => {
                this.isMovingCam = false;

                // todo: 타이핑 이벤트 시작 매서드 insert
                console.log('타이핑 이벤트 시작');
            }, 300);

        }, 300);
    }

    // about me 대화창 사라지는 매서드
    disappearDialog() {
        this.dialogBox.style.opacity = '0';
        setTimeout(() => this.dialogBox.style.display = 'none', 300);
    }

    // 컨트롤 제한 (컨텐츠에서 zoom in 모드에서 벗어나면 다시 제한)
    controlLimitSet(controls) {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(80);
        controls.minDistance = 5; // 가까워지는 최소거리 설정
    }

    // 컨트롤 제한 해제 (카메라 무빙 이벤트 시 제한 해제 필요)
    controlLimitBreak (controls) {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(360);
        controls.minDistance = 0; // 가까워지는 최소거리 설정
    }

    cameraPositionFixer() {
        if (this.sizes.width >= 1400) return 1;
        return (1400 - this.sizes.width) * (this.sizes.width <= 420 ? 0.0003 : 0.0007) + 1;
    }

    // 카메라, 컨트롤의 인스턴스 + 각 컨텐츠 포지션을 최신 데이터로 생성
    getRequireInstance() {
        const app = Application.getInstance();
        const camera = app.camera.instance;
        const controls = app.camera.orbitControls;
        const world = app.world;
        const monitorCamPositionFixer = () => {
            if ( this.sizes.width <= 530) return 4;
            if (this.sizes.width <= 740) return 3;
            return 1.9;
        }
        const fixMonitorPosition = monitorCamPositionFixer();

        const contentList = [
            // about me 첫번째 대화
            {
                current: 'aboutMe1', next: 'aboutMe2', prev: 'poster',
                cameraPosition: {
                    x: (world.dinoPosition.x), y: (world.dinoPosition.y + 0.4), z: (world.dinoPosition.z + 2.5 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (world.dinoPosition.x), y: (world.dinoPosition.y + 0.2), z: (world.dinoPosition.z)
                }
            },

            // about me 두번째 대화 (카메라 무빙 애니메이션 x)
            { current: 'aboutMe2', next: 'projects', prev: 'aboutMe1' },

            {
                current: 'projects', next: 'learning', prev: 'aboutMe1',
                cameraPosition: {
                    x: (world.projectsPosition.x), y: (world.projectsPosition.y), z: (world.projectsPosition.z + fixMonitorPosition + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (world.projectsPosition.x), y: (world.projectsPosition.y), z: (world.projectsPosition.z)
                }
            },

            // learning
            {
                current: 'learning', next: 'skills', prev: 'projects',
                cameraPosition: {
                    x: (world.learningPosition.x), y: (world.learningPosition.y), z: (world.learningPosition.z + 3)
                },
                controlsTarget: {
                    x: (world.learningPosition.x), y: (world.learningPosition.y), z: (world.learningPosition.z)
                }
            },

            // skills
            {
                current: 'skills', next: 'poster', prev: 'learning',
                cameraPosition: {
                    x: (world.skillsPosition.x),
                    y: (world.skillsPosition.y),
                    z: (world.skillsPosition.z + 1.6 + (this.fixCameraPosition > 1.32 ? 1.32 : this.fixCameraPosition))
                },
                controlsTarget: {
                    x: (world.skillsPosition.x), y: (world.skillsPosition.y), z: (world.skillsPosition.z)
                }
            },

            // poster
            {
                current: 'poster', next: 'aboutMe1', prev: 'skills',
                cameraPosition: {
                    x: (world.posterPosition.x), y: (world.posterPosition.y), z: (world.posterPosition.z + 4 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (world.posterPosition.x), y: (world.posterPosition.y), z: (world.posterPosition.z)
                }
            },
        ];

        return { camera, controls, contentList, app }
    }
}