import gsap from 'gsap';
import Application from '../Application';
import * as THREE from 'three';

export default class GsapAnimation {
    constructor() {
        this.isInContent = false;
        this.currentContent = '';
        this.listCount = 0;
        this.isActivePrev = false;

        // Elements
        this.webgl = document.querySelector('#webgl');
        this.dialogBox = document.querySelector('#dialogBox');
        this.returnToOrbitBtn = document.querySelector('#returnToOrbitBtn');
        this.contentMenuBtns = document.querySelector('#contentMenuBtns');
        this.playStart = document.querySelector('#playStart');
        this.playSkip = document.querySelector('#playSkip');
        this.nextBtn = document.querySelector('#nextBtn');
        this.prevBtn = document.querySelector('#prevBtn');
        this.dialogContent = document.querySelector('.dialog-content');


        this.dialogTextList = {
            step1: '1. 안녕하세요 프론트엔드 엔지니어\n 제리옹입니다. 동적인 그래픽 구현을\n 즐깁니다.',
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
        this.webgl.style.zIndex = 0;
        // get instance
        const app = Application.getInstance();
        // getContentPositions를 통해 포지션 등록
        const contentList = app.positions.getContentPositions();

        const current = contentList.find((val) => val.current === target);

        this.convertChairTransParent('invisible');

        gsap.to(app.camera.instance.position, {
            ...current.cameraPosition, duration: 1, ease: 'power1.inOut',
            onStart: () => {
                if (!isBtn) this.currentContent = target;
                this.isInContent = true;
                this.isMovingCam = true;
                app.camera.orbitControls.enabled = false;
                this.controlLimitBreak(app.camera.orbitControls); // down control 제한 해제
            },
            onComplete: () => {
                this.contentMenuBtns.style.bottom = '30px';
                this.dialogBox.style.display = 'block';
                if (target === 'aboutMe1') this.appearDialog();
                else this.isMovingCam = false;
                this.webgl.style.zIndex = -1;
            }
        });
        gsap.to(app.camera.orbitControls.target, {
            ...current.controlsTarget, duration: 1, ease: 'power1.inOut',
        });
    }

    // orbitControls 모드로 전환
    returnToOrbit() {
        // get instance
        const app = Application.getInstance();

        if (this.isMovingCam) return;
        this.listCount = 0;

        // prev 버튼 비활성화
        this.offPrev();
        // 의자 투명화 매서드
        this.convertChairTransParent('visible');
        gsap.to(app.camera.instance.position, {
            duration: 1, ease: 'power1.inOut',
            // set position
            ...app.positions.getReturnToOrbitPositions(),
            onStart: () => {
                this.isMovingCam = true;

                // start 모드에 따라서 버튼이름 변경
                if (app.isStart) {
                    app.isStart = false;
                    this.returnToOrbitBtn.innerHTML = 'Back';
                }

                // 메뉴버튼 사라짐
                this.contentMenuBtns.style.bottom = '-70px';
                // aboutMe의 경우 대화상자 사라지는 애니메이션 적용
                if (this.currentContent === 'aboutMe1' || 'aboutMe2') this.disappearDialog();
            },
            onComplete: () => {
                this.isInContent = false;
                this.isMovingCam = false;
                app.camera.orbitControls.enabled = true;
                this.webgl.style.zIndex = 0;
                this.controlLimitSet(app.camera.orbitControls); // control 제한
            }
        });
        gsap.to(app.camera.orbitControls.target, {
            x: 1, y: 1, z: 2, duration: 1, ease: 'power1.inOut',
        });
    }

    // Start로 시작
    playStartAnimation() {
        if (this.isMovingCam) return;
        // get instance
        const app = Application.getInstance();
        const contentList = app.positions.getContentPositions();
        // 초기 start 눌러 시작할 경우 aboutMe1로 설정
        this.currentContent = 'aboutMe1';

        gsap.to(app.camera.instance.position, {
            duration: 2, ease: 'power1.inOut',
            // set position
            ...app.positions.getPlayStartAnimationPositions(),
            onStart: () => {
                this.isMovingCam = true;
                this.isInContent = true;
                app.camera.orbitControls.enabled = false;
                app.isStart = true;
                this.controlLimitBreak(app.camera.orbitControls); // down control 제한 해제
                this.convertChairTransParent('invisible', 3000, 1.5);
            },
            onComplete: () => {
                gsap.to(app.camera.instance.position, {
                    ...contentList[0].cameraPosition, duration: 1.5, ease: 'power1.inOut',
                    onComplete: () => {
                        this.isMovingCam = false;
                        this.contentMenuBtns.style.bottom = '30px';
                        this.dialogBox.style.display = 'block';
                        this.appearDialog();
                    }
                });
                gsap.to(app.camera.orbitControls.target, {
                    ...contentList[0].controlsTarget, duration: 1.5, ease: 'power1.inOut',
                });
            }
        });
    }

    // Skip으로 시작
    playAnimationSkip() {
        // get instance
        const app = Application.getInstance();
        this.returnToOrbitBtn.innerHTML = 'Back';
        gsap.to(app.camera.instance.position, {
            ...app.positions.getReturnToOrbitPositions(), duration: 0,
        });
    }

    // Next 버튼 클릭 매서드
    toNext() {
        // get instance
        const app = Application.getInstance();
        if (this.isMovingCam) return;
        // 타이핑이 진행중일 때 타이핑 스킵
        if (app.eventModule.typingTimout !== null) {
            if (this.currentContent === 'aboutMe1') app.eventModule.skipTyping(this.dialogTextList.step1);
            if (this.currentContent === 'aboutMe2') app.eventModule.skipTyping(this.dialogTextList.step2);
            return;
        }

        const contentList = app.positions.getContentPositions();

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
            this.isMovingCam = true;

            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.disappearDialog(current.next, true);
            return;
        }
        if (this.currentContent === 'aboutMe1') {
            this.currentContent = current.next;
            this.dialogContent.textContent = '';
            // 타이핑이벤트
            app.eventModule.typing(this.dialogTextList.step2);
            return;
        }

        this.toContent(current.next, true);
        this.currentContent = current.next;
    }

    // Prev 버튼 클릭 매서드
    toPrev() {
        // get instance
        const app = Application.getInstance();
        // 뒤로갈 컨텐츠가 없거나 카메라 무빙 애니메이션 진행중일 때
        if (this.listCount === 0 || this.isMovingCam) return;
        // 타이핑이 진행중일 때 타이핑 스킵
        if (app.eventModule.typingTimout !== null) {
            if (this.currentContent === 'aboutMe1') app.eventModule.skipTyping(this.dialogTextList.step1);
            if (this.currentContent === 'aboutMe2') app.eventModule.skipTyping(this.dialogTextList.step2);
            return;
        }

        const contentList = app.positions.getContentPositions();

        if (contentList.length > this.listCount) this.listCount--;
        // aboutMe의 경우 2가지 step이 존재하기 때문에 한번 더 감소
        if (this.currentContent === 'projects') this.listCount--;

        // count가 0이고 활성화상태라면 비활성화
        this.offPrev();

        const current = contentList.find(val => val.current === this.currentContent);

        if (this.currentContent === 'aboutMe1') {
            this.currentContent = current.prev;
            this.isMovingCam = true;

            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.disappearDialog(current.prev, true);
            return;
        }
        if (this.currentContent === 'aboutMe2') {
            this.currentContent = current.prev;
            this.dialogContent.textContent = '';
            // 타이핑이벤트
            app.eventModule.typing(this.dialogTextList.step1);
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
        // get instance
        const app = Application.getInstance();
        // 대화창 등장시 대화 초기화
        this.dialogContent.textContent = '';

        setTimeout(() => {
            this.dialogBox.style.opacity = '1';

            setTimeout(() => {
                this.isMovingCam = false;

                // 대화창 생성시 반드시 step1, 타이핑이벤트 실행
                app.eventModule.typing(this.dialogTextList.step1);

            }, 800);

        }, 300);
    }

    // about me 대화창 사라지는 매서드
    disappearDialog(toWhere, isBtn) {
        // get instance
        const app = Application.getInstance();
        this.dialogBox.style.opacity = '0';
        // 커서 깜빡임 루프 멈춤
        setTimeout(() => {
            clearInterval(app.eventModule.cursorInterval);
            app.eventModule.cursorInterval = null;

            this.dialogBox.style.display = 'none';

            // 단순히 사라지는 이벤트인 경우 (타이핑모드가 아닌 경우)
            if (toWhere === undefined && isBtn === undefined) return;

            this.toContent(toWhere, isBtn);
        }, 300);
    }

    // 컨트롤 제한 (컨텐츠에서 zoom in 모드에서 벗어나면 다시 제한)
    controlLimitSet(controls) {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 하단 시점 제한
        controls.minDistance = 5; // 가까워지는 최소거리 설정
    }

    // 컨트롤 제한 해제 (카메라 무빙 이벤트 시 제한 해제 필요)
    controlLimitBreak (controls) {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(360); // 하단 시점 제한해제
        controls.minDistance = 0; // 가까워지는 최소거리 설정
    }
}