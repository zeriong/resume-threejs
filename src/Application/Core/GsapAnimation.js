import gsap from 'gsap';
import Application from '../Application';
import * as THREE from 'three';
import {dialogText} from '../Utills/Constants';

export default class GsapAnimation {
    constructor() {
        this.isInContent = false;
        this.isInGuestBook = false;
        this.currentContent = '';
        this.listCount = 0;
        this.isActivePrev = false;
        this.typingTimeout = null;

        // Elements
        this.webgl = document.querySelector('#webgl');
        this.dialogBox = document.querySelector('#dialogBox');
        this.returnToOrbitBtn = document.querySelector('#returnToOrbitBtn');
        this.contentMenuBtns = document.querySelector('#contentMenuBtns');
        this.playStart = document.querySelector('#playStart');
        this.nextBtn = document.querySelector('#nextBtn');
        this.prevBtn = document.querySelector('#prevBtn');
        this.dialogContent = document.querySelector('.dialog-content');

        this.cursorWrap = document.createElement('div');
        this.dialogCursor = document.createElement('span');
        this.dialogCursor.id = 'dialogCursor';

        // addEventListeners
        this.playStart.addEventListener('click', () => this.playStartAnimation());
        this.returnToOrbitBtn.addEventListener('click', () => this.returnToOrbit());
        this.nextBtn.addEventListener('click', () => this.toNext());
        this.prevBtn.addEventListener('click', () => this.toPrev());

        // 버튼 hover styles
        this.prevBtn.addEventListener('mouseenter', () => {
            if (this.isMovingCam) return;
            if (this.isActivePrev) this.prevBtn.style.backgroundColor = "rgb(95, 104, 110)";
        });
        this.prevBtn.addEventListener('mouseleave', () => {
            if (this.isMovingCam) return;
            if (this.isActivePrev) this.prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
        });
    }

    toContent(target, isBtn) {
        // HTML과 상호작용 불가하도록 설정
        this.webgl.style.zIndex = 0;
        // get instance
        const app = Application.getInstance();

        // 첫시작 aboutMe 끝날 시 자유시점모드 버튼 이름 skip -> back 변경
        if (app.isStart && this.currentContent === 'projects') {
            app.isStart = false;
            this.returnToOrbitBtn.innerHTML = 'Back';
        }

        // getContentPositions를 통해 포지션 등록
        const currentPosition = app.positions.getContentPositions().find((val) => val.current === target);

        // 의자, 방명록 next/prev 버튼 투명화
        if (target !== 'guestBook' && !isBtn && !this.isInContent) {
            this.convertTransparent('zoomIn', 0, undefined, 0.2, 1000);
        } else if (target === 'guestBook' && !this.isInContent) this.convertTransparent('zoomIn');

        // 방명록에서 벗어날 경우
        if (target !== 'guestBook' && this.isInGuestBook) this.isInGuestBook = false;
        // 컨텐츠가 방명록인 경우
        if (target === 'guestBook') {
            this.isInGuestBook = true;
        }

        gsap.to(app.camera.instance.position, {
            ...currentPosition.cameraPosition, duration: 1, ease: 'power1.inOut',
            onStart: () => {
                if (!isBtn) this.currentContent = target;
                this.isInContent = true;
                this.isMovingCam = true;
                app.camera.orbitControls.enabled = false;
                this.controlLimitBreak(app.camera.orbitControls); // down control 제한 해제

                // 포스터인 경우 next/prev 버튼 x, 버튼 스케일 up
                if (target === 'poster') {
                    this.contentMenuBtns.style.bottom = '-80px';
                    // transition duration 기다린 후 적용
                    setTimeout(() => {
                        this.nextBtn.style.display = 'none';
                        this.prevBtn.style.display = 'none';
                        this.contentMenuBtns.style.justifyContent = 'center';
                        this.returnToOrbitBtn.style.scale = 1.2;
                    }, 300);
                }
            },
            onComplete: () => {
                // 컨텐츠 nav menu 모바일 대응
                if (app.sizes.width <= 497) {
                    this.contentMenuBtns.style.bottom = '10px';
                } else {
                    this.contentMenuBtns.style.bottom = '30px';
                }
                // aboutMe 컨텐츠인경우 대화상자 나타남
                if (target === 'aboutMe') return this.appearDialog();
                // next/prev 버튼조작이 아닌 방명록 이동이면 애니메이션 끝난 후 이벤트 허용(isMovingCam)
                else if (target === 'guestBook' && !isBtn) {
                    return setTimeout(() => {
                        this.isMovingCam = false;
                    }, 1000);
                }
                this.isMovingCam = false;
                // projects 컨텐츠의 경우 HTML과 상호작용 가능하도록 zIndex 낮춤
                if (target === 'projects') this.webgl.style.zIndex = -1;
            }
        });
        gsap.to(app.camera.orbitControls.target, {
            ...currentPosition.controlsTarget, duration: 1, ease: 'power1.inOut',
        });
    }

    // orbitControls 모드로 전환
    returnToOrbit() {
        // 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (this.isMovingCam) return;

        // get instance
        const app = Application.getInstance();

        this.breakTimeout(app.raycaster.timeout1, () => app.raycaster.controlPopup('hidden'));
        app.raycaster.timeout1 = null;
        this.breakTimeout(app.raycaster.timeout2, () => app.raycaster.controlPopup('hidden'));
        app.raycaster.timeout2 = null;
        this.breakTimeout(this.typingTimeout, () => setTimeout(() => this.dialogContent.innerHTML = '', 1000));
        this.typingTimeout = null;

        // 의자 투명화 매서드
        this.convertTransparent('zoomOut');
        gsap.to(app.camera.instance.position, {
            duration: 1, ease: 'power1.inOut',
            // set position
            ...app.positions.getReturnToOrbitPositions(),
            onStart: () => {
                this.isMovingCam = true;
                // 메뉴버튼 사라짐 (poster의 경우 transition 기다린 후 속성 되돌림)
                if (this.currentContent === 'poster') {
                    this.contentMenuBtns.style.bottom = '-80px';
                    // 기존 속성으로
                    setTimeout(() => {
                        this.nextBtn.style.display = 'block';
                        this.prevBtn.style.display = 'block';
                        this.contentMenuBtns.style.justifyContent = 'space-between';
                        this.returnToOrbitBtn.style.scale = 1;
                    }, 300);
                }
                else this.contentMenuBtns.style.bottom = '-70px';

                // aboutMe의 경우 대화상자 사라지는 애니메이션 적용
                if (this.currentContent === 'aboutMe') this.disappearDialog();
            },
            onComplete: () => {
                // 버튼이름 변경
                if (app.isStart) {
                    app.isStart = false;
                    this.returnToOrbitBtn.innerHTML = 'Back';
                }
                this.isInContent = false;
                this.isMovingCam = false;
                app.camera.orbitControls.enabled = true;
                this.webgl.style.zIndex = 0;
                this.controlLimitSet(app.camera.orbitControls); // control 제한

                // 초기화
                this.listCount = 0;
                this.isInGuestBook = false;
                // prev 버튼 비활성화
                this.prevBtnSwitch();
            }
        });
        gsap.to(app.camera.orbitControls.target, {
            x: 1, y: 1.5, z: 2, duration: 1, ease: 'power1.inOut',
        });
    }

    // Start로 시작
    playStartAnimation() {
        // 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (this.isMovingCam) return;
        
        // 로딩창 사라짐
        const loadingEl = document.querySelector('#loading');
        loadingEl.style.opacity = 0;
        setTimeout(() => {
            loadingEl.style.display = 'none';
        },200);

        // get instance
        const app = Application.getInstance();
        const contentList = app.positions.getContentPositions();
        // start 시 aboutMe으로 설정
        this.currentContent = 'aboutMe';

        gsap.to(app.camera.instance.position, {
            duration: 2, ease: 'power1.inOut',
            // set position
            ...app.positions.getStartAnimationPositions(),
            onStart: () => {
                this.isMovingCam = true;
                this.isInContent = true;
                app.camera.orbitControls.enabled = false;
                app.isStart = true;
                this.controlLimitBreak(app.camera.orbitControls); // down control 제한 해제
                this.convertTransparent('zoomIn', 3000, 1.5, 2);
            },
            onComplete: () => {
                gsap.to(app.camera.instance.position, {
                    ...contentList[0].cameraPosition, duration: 1.5, ease: 'power1.inOut',
                    onComplete: () => {
                        // 컨텐츠 nav menu 모바일 대응
                        if (app.sizes.width <= 497) {
                            this.contentMenuBtns.style.bottom = '10px';
                        } else {
                            this.contentMenuBtns.style.bottom = '30px';
                        }
                        this.dialogBox.style.display = 'flex';
                        this.appearDialog();
                    }
                });
                gsap.to(app.camera.orbitControls.target, {
                    ...contentList[0].controlsTarget, duration: 1.5, ease: 'power1.inOut',
                });
            }
        });
    }

    // Next 버튼 클릭 매서드
    toNext() {
        // 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (this.isMovingCam) return;
        // get instance
        const app = Application.getInstance();
        // 타이핑이 진행중일 때 타이핑 스킵
        if (this.typingTimeout !== null) {
            if (this.currentContent === 'aboutMe') this.skipTyping(dialogText);
            return;
        }
        // get position list
        const positionList = app.positions.getContentPositions();
        // get raycaster
        const raycaster = app.raycaster;

        // list count
        if (positionList.length - 1 > this.listCount) this.listCount++;
        // prev 버튼 활성화
        this.prevBtnSwitch();
        // current content position
        const currentPosition = positionList.find(val => val.current === this.currentContent);
        // aboutMe -> projects 넘어갈 때
        if (this.currentContent === 'aboutMe') {
            this.currentContent = currentPosition.next;
            this.isMovingCam = true;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.disappearDialog(currentPosition.next, true);
            return;
        }
        // guestBook toast alarm control
        if (currentPosition.next === 'guestBook') {
            raycaster.playGuestBookToast();
        } else if (raycaster.timeout1 !== null || raycaster.timeout2 !== null) {
            this.breakTimeout(raycaster.timeout1, () => raycaster.controlPopup('hidden'));
            raycaster.timeout1 = null;
            this.breakTimeout(raycaster.timeout2, () => raycaster.controlPopup('hidden'));
            raycaster.timeout2 = null;
        }
        // 마지막대화를 제외한 애니메이션 일괄 처리
        this.currentContent = currentPosition.next;
        this.toContent(currentPosition.next, true);
    }

    // Prev 버튼 클릭 매서드
    toPrev() {
        // 버튼이 비활성화이거나 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (!this.isActivePrev || this.isMovingCam) return;
        // get instance
        const app = Application.getInstance();

        // 타이핑이 진행중일 때 타이핑 스킵
        if (this.typingTimeout !== null) {
            if (this.currentContent === 'aboutMe') this.skipTyping(dialogText);
            return;
        }
        // get position list
        const positionList = app.positions.getContentPositions();
        // get raycaster
        const raycaster = app.raycaster;

        // list count
        if (positionList.length > this.listCount) this.listCount--;

        // count가 0이고 활성화상태라면 비활성화
        this.prevBtnSwitch();
        // current content position
        const currentPosition = positionList.find(val => val.current === this.currentContent);

        // guestBook toast alarm control
        if (currentPosition.prev === 'guestBook') {
            raycaster.playGuestBookToast();
        } else if (raycaster.timeout1 !== null || raycaster.timeout2 !== null) {
            this.breakTimeout(raycaster.timeout1, () => raycaster.controlPopup('hidden'));
            raycaster.timeout1 = null;
            this.breakTimeout(raycaster.timeout2, () => raycaster.controlPopup('hidden'));
            raycaster.timeout2 = null;
        }
        // aboutMe에서 나가기 애니메이션
        if (this.currentContent === 'aboutMe') {
            this.currentContent = currentPosition.prev;
            this.isMovingCam = true;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.disappearDialog(currentPosition.prev, true);
            return;
        }

        // aboutMe에서 나가기, 방명록에서 나가기 애니메이션을 제외한 애니메이션 일괄 처리
        this.currentContent = currentPosition.prev;
        this.toContent(currentPosition.prev, true);
    }

    // prev 버튼 활성화 여부 결정 매서드
    prevBtnSwitch() {
        if (this.listCount > 0 && !this.isActivePrev) {
            this.isActivePrev = true;
            this.prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
            this.prevBtn.style.color = '#fff';
        } else if (this.listCount === 0 && this.isActivePrev) {
            this.isActivePrev = false;
            this.prevBtn.style.backgroundColor = "rgb(185, 188, 190)";
            this.prevBtn.style.color = '#d3d3d3';
        }
    }

    /** 의자 등받이, 방명록 next/prev 버튼 mesh 투명 on/off */
    convertTransparent(
        type, ms = 0, chairDuration = 2,
        buttonDuration = 1, buttonTimeout = 1500
    ) {
        const intersectsMeshes = Application.getInstance().intersectsMeshes;
        setTimeout(() => {
            intersectsMeshes.forEach(mesh => {
                if (type === 'zoomIn') {
                    if (mesh.name === ('chair1') || mesh.name === ('chair2') || mesh.name === ('chair3')) {
                        gsap.to(mesh.material, { opacity: 0, duration: chairDuration });
                    }
                    if (mesh.name === ('prevReview') || mesh.name === ('nextReview')) {
                        setTimeout(() => {
                            gsap.to(mesh.material, { opacity: 1, duration: buttonDuration });
                        }, buttonTimeout);
                    }
                }
                if (type === 'zoomOut') {
                    if (mesh.name === ('chair1') || mesh.name === ('chair2') || mesh.name === ('chair3')) {
                        gsap.to(mesh.material, { opacity: 1, duration: chairDuration });
                    }
                    if (mesh.name === ('prevReview') || mesh.name === ('nextReview')) {
                        gsap.to(mesh.material, { opacity: 0, duration: buttonDuration });
                    }
                }
            });
        }, ms);
    }

    // about me 대화창 등장 매서드
    appearDialog() {
        // get instance
        const app = Application.getInstance();
        // 대화창 등장시 대화 초기화 후 등장
        this.dialogContent.textContent = '';
        this.dialogBox.style.display = 'flex';
        // transition을 기다린 후 실행
        setTimeout(() => {
            this.dialogBox.style.opacity = '1';

            setTimeout(() => {
                this.isMovingCam = false;

                // 대화창 생성시 반드시 step1, 타이핑이벤트 실행
                this.typing(dialogText);
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
            clearInterval(this.cursorInterval);
            this.cursorInterval = null;

            this.dialogBox.style.display = 'none';

            // 단순히 사라지는 이벤트인 경우 (타이핑모드가 아닌 경우)
            if (toWhere === undefined && isBtn === undefined) return;

            this.toContent(toWhere, isBtn);
        }, 320);
    }

    // 타이핑 실행 매서드
    typing(text, typingSpeed = 35) {
        let charIndex = 0;
        let content = ''

        this.cursorWrap.style.display = 'inline-block';
        this.cursorWrap.style.position = 'relative';
        this.cursorWrap.appendChild(this.dialogCursor);

        const typing = () => {
            // 태그 체크 문자열 추가
            if (text[charIndex] === "<") {
                // 태그가 끝날 때까지 루프
                while (text[charIndex] !== ">" && charIndex < text.length) {
                    content += text[charIndex++];
                }
                // 태그의 마지막 부분 추가 ('>')
                if (charIndex < text.length) {
                    content += text[charIndex++];
                }
            } else if (charIndex < text.length) {
                // 일반 문자 추가
                content += text[charIndex++];
            }

            this.dialogContent.innerHTML = content;
            this.dialogContent.appendChild(this.cursorWrap);

            if (this.cursorInterval !== null) {
                clearInterval(this.cursorInterval);
                this.cursorInterval = null;
            }
            if (charIndex < text.length) {
                this.typingTimeout = setTimeout(() => {
                    typing();
                    this.dialogContent.scrollTop = this.dialogContent.scrollHeight;
                }, typingSpeed);
            }
            if (charIndex >= text.length) {
                this.typingTimeout = null;
                this.cursorLoop();
            }
        }
        typing();
    }

    // 타이핑 스킵 매서드
    skipTyping(text) {
        this.dialogContent.innerHTML = text;
        this.dialogContent.appendChild(this.cursorWrap);
        this.cursorLoop();
        clearTimeout(this.typingTimeout);
        this.typingTimeout = null;
    }

    // 커서 깜빡임 루프 매서드
    cursorLoop() {
        this.cursorInterval = setInterval(() => {
            this.dialogCursor.classList.toggle('toggleCursor');
        }, 500);
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
    // 방명록, 타이핑 setTimeout 해제 매서드
    breakTimeout(timeout, func) {
        if (timeout !== null) clearTimeout(timeout);
        func();
    }
}