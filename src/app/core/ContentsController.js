import gsap from 'gsap'
import Application from '../Application'
import * as THREE from 'three'
import {DIALOG_TEXT} from '../common/constants'
import World from "../world/World";

export default class ContentsController {
    #listCount = 0;
    #isActivePrev = false;
    #typingTimeout = null;
    #webgl;
    #playStart;
    #dialogBox;
    #returnToOrbitBtn;
    #contentMenuBtns;
    #nextBtn;
    #prevBtn;
    #dialogContent;
    #cursorWrap;
    #dialogCursor;

    isInContent = false;
    isInGuestBook = false;
    currentContent = null;

    constructor() {
        // Elements
        this.#webgl = document.querySelector('#webgl');
        this.#dialogBox = document.querySelector('#dialogBox');
        this.#returnToOrbitBtn = document.querySelector('#returnToOrbitBtn');
        this.#contentMenuBtns = document.querySelector('#contentMenuBtns');
        this.#playStart = document.querySelector('#playStart');
        this.#nextBtn = document.querySelector('#nextBtn');
        this.#prevBtn = document.querySelector('#prevBtn');
        this.#dialogContent = document.querySelector('.dialog-content');

        this.#cursorWrap = document.createElement('div');
        this.#dialogCursor = document.createElement('span');
        this.#dialogCursor.id = 'dialogCursor';

        this.#init();
    }


    #init() {
        // addEventListeners
        this.#playStart.addEventListener('click', () => this.#playStartAnimation());
        this.#returnToOrbitBtn.addEventListener('click', () => this.#returnToOrbit());
        this.#nextBtn.addEventListener('click', () => this.#toNext());
        this.#prevBtn.addEventListener('click', () => this.#toPrev());

        // 버튼 hover styles
        this.#prevBtn.addEventListener('mouseenter', () => {
            if (this.isMovingCam) return;
            if (this.#isActivePrev) this.#prevBtn.style.backgroundColor = "rgb(95, 104, 110)";
        })
        this.#prevBtn.addEventListener('mouseleave', () => {
            if (this.isMovingCam) return;
            if (this.#isActivePrev) this.#prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
        })
    }

    toContent(content, isBtn) {
        // get instance
        const app = Application.getInstance();
        const world = World.getInstance();

        // 모바일인 경우 nav 메뉴 사라짐
        if (app.windowSizes.width <= 497) {
            document.querySelector('#navMenuBtn').style.left = '-50px';
        }

        // content 전달 값이 문자열이라면 콘텐츠 오브젝트로 변환
        if (typeof content === "string") {
            content = app.contents.getList().find(item => item.name === content);
        }

        // HTML과 상호작용 불가하도록 설정
        this.#webgl.style.zIndex = 0;

        // 첫시작 aboutMe 끝날 시 자유시점모드 버튼 이름 skip -> back 변경
        if (app.isStart && this.currentContent.name === 'projects') {
            app.isStart = false;
            this.#returnToOrbitBtn.innerHTML = 'Back';
        }

        this.currentContent = content;

        // 콘텐츠에 따른 처리
        // 의자, 방명록 next/prev 버튼 투명화
        if (content.name !== 'guestBook' && !isBtn && !this.isInContent) {
            this.convertTransparent('zoomIn', 0, undefined, 0.2, 1000);
        }
        if (content.name === 'guestBook' && !this.isInContent) this.convertTransparent('zoomIn');
        // 방명록에서 벗어날 경우
        if (content.name !== 'guestBook' && this.isInGuestBook) this.isInGuestBook = false;
        // 컨텐츠가 방명록인 경우
        if (content.name === 'guestBook') this.isInGuestBook = true;

        gsap.to(app.camera.instance.position, {
            ...content.cameraPosition, duration: 1, ease: 'power1.inOut',
            onStart: () => {
                this.isInContent = true;
                this.isMovingCam = true;
                app.camera.orbitControls.enabled = false;
                this.#controlLimitBreak(app.camera.orbitControls); // down control 제한 해제

            },
            onComplete: () => {
                // 컨텐츠 nav menu 모바일 대응
                if (app.windowSizes.width <= 497) {
                    this.#contentMenuBtns.style.bottom = '10px';
                } else {
                    this.#contentMenuBtns.style.bottom = '30px';
                }
                // aboutMe 컨텐츠인경우 대화상자 나타남
                if (content.name === 'aboutMe') return this.#showDialog();
                // next/prev 버튼조작이 아닌 방명록 이동이면 애니메이션 끝난 후 이벤트 허용(isMovingCam)
                else if (content.name === 'guestBook' && !isBtn) {
                    return setTimeout(() => {
                        this.isMovingCam = false;
                    }, 1000);
                }
                this.isMovingCam = false;
                // 웹뷰 컨텐츠의 경우 HTML과 상호작용 가능하도록 zIndex 낮춤
                if (['projects', 'roadmap', 'skills'].includes(content.name)) this.#webgl.style.zIndex = -1;
            }
        })

        gsap.to(app.camera.orbitControls.target, {
            ...content.controlsTarget, duration: 1, ease: 'power1.inOut',
        })

        // 빛가루 투명화
        gsap.to(world.environment.lightParticleMaterial, {
            duration: 1, ease: 'power1.inOut', opacity: 0,
            onStart: () => world.environment.lightParticleMaterial.transparent = true,
        })
    }

    // Next 버튼 클릭 매서드
    #toNext() {
        // 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (this.isMovingCam) return;
        // get instance
        const app = Application.getInstance();
        const raycaster = app.raycaster;

        // 타이핑이 진행중일 때 타이핑 스킵
        if (this.#typingTimeout !== null) {
            if (this.currentContent.name === 'aboutMe') this.#skipTyping(DIALOG_TEXT);
            return
        }
        // get position list
        const positionList = app.contents.getList();

        // list count
        if (positionList.length - 1 > this.#listCount) this.#listCount++;
        // prev 버튼 활성화
        this.#prevBtnSwitch();

        // 다음 콘텐츠
        const nextContent = app.contents.next(this.currentContent);

        // 콘텐츠 변화에 따른 처리
        if (nextContent.name === 'guestBook') {
            raycaster.showGuestBookToast();
        } else if (raycaster.timeout1 !== null || raycaster.timeout2 !== null) {
            this.#breakTimeoutk(raycaster.timeout1, () => raycaster.controlPopup('hidden'));
            raycaster.timeout1 = null;
            this.#breakTimeoutk(raycaster.timeout2, () => raycaster.controlPopup('hidden'));
            raycaster.timeout2 = null;
        }

        // 콘텐츠 이동
        if (this.currentContent.name === 'aboutMe') { // aboutMe -> projects 넘어갈 때
            this.isMovingCam = true;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.hideDialog(nextContent, true);
        } else {
            this.toContent(nextContent, true);
        }

        this.currentContent = nextContent;
    }

    // Prev 버튼 클릭 매서드
    #toPrev() {
        // 버튼이 비활성화이거나 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (!this.#isActivePrev || this.isMovingCam) return;
        // get instance
        const app = Application.getInstance();
        const raycaster = app.raycaster;

        // get position list
        const positionList = app.contents.getList();

        // 타이핑이 진행중일 때 타이핑 스킵
        if (this.#typingTimeout !== null) {
            if (this.currentContent.name === 'aboutMe') this.#skipTyping(DIALOG_TEXT);
            return
        }

        // list count
        if (positionList.length > this.#listCount) this.#listCount--;
        // count가 0이고 활성화상태라면 비활성화
        this.#prevBtnSwitch();

        // 이전 콘텐츠
        const prevContent = app.contents.prev(this.currentContent);

        // 콘텐츠 변화에 따른 처리
        if (prevContent.name === 'guestBook') {
            raycaster.showGuestBookToast();
        } else if (raycaster.timeout1 !== null || raycaster.timeout2 !== null) {
            this.#breakTimeoutk(raycaster.timeout1, () => raycaster.controlPopup('hidden'));
            raycaster.timeout1 = null;
            this.#breakTimeoutk(raycaster.timeout2, () => raycaster.controlPopup('hidden'));
            raycaster.timeout2 = null;
        }

        // aboutMe에서 나가기 애니메이션
        if (this.currentContent.name === 'aboutMe') {
            this.isMovingCam = true;
            // 말풍선 사라지는 애니메이션 끝나고 이동
            this.hideDialog(prevContent, true);
        } else {
            this.toContent(prevContent, true);
        }

        this.currentContent = prevContent;
    }

    // prev 버튼 활성화 여부 결정 매서드
    #prevBtnSwitch() {
        if (this.#listCount > 0 && !this.#isActivePrev) {
            this.#isActivePrev = true;
            this.#prevBtn.style.backgroundColor = "rgb(108, 117, 125)";
            this.#prevBtn.style.color = '#fff';
        } else if (this.#listCount === 0 && this.#isActivePrev) {
            this.#isActivePrev = false;
            this.#prevBtn.style.backgroundColor = "rgb(185, 188, 190)";
            this.#prevBtn.style.color = '#d3d3d3';
        }
    }

    // orbitControls 모드로 전환
    #returnToOrbit() {
        // 카메라 무빙 애니메이션 진행중일 때 캔슬
        if (this.isMovingCam) return;

        // get instance
        const app = Application.getInstance();
        const world = World.getInstance();

        // 모바일인 경우 nav 메뉴 사라짐
        if (app.windowSizes.width <= 497) {
            document.querySelector('#navMenuBtn').style.left = '16px';
        }

        this.#breakTimeoutk(app.raycaster.timeout1, () => app.raycaster.controlPopup('hidden'));
        app.raycaster.timeout1 = null;
        this.#breakTimeoutk(app.raycaster.timeout2, () => app.raycaster.controlPopup('hidden'));
        app.raycaster.timeout2 = null;
        this.#breakTimeoutk(this.#typingTimeout, () => setTimeout(() => this.#dialogContent.innerHTML = '', 1000));
        this.#typingTimeout = null;

        // 의자 투명화 매서드
        this.convertTransparent('zoomOut');
        gsap.to(app.camera.instance.position, {
            duration: 1, ease: 'power1.inOut',
            // set position
            ...app.contents.getOrbitPositions(),
            onStart: () => {
                this.isMovingCam = true;
                // 메뉴버튼 사라짐 (poster의 경우 transition 기다린 후 속성 되돌림)
                if (this.currentContent.name === 'poster') {
                    this.#contentMenuBtns.style.bottom = '-80px';
                    // 기존 속성으로
                    setTimeout(() => {
                        this.#nextBtn.style.display = 'block';
                        this.#prevBtn.style.display = 'block';
                        this.#contentMenuBtns.style.justifyContent = 'space-between';
                        this.#returnToOrbitBtn.style.scale = 1;
                    }, 300);
                }
                else this.#contentMenuBtns.style.bottom = '-70px';

                // aboutMe의 경우 대화상자 사라지는 애니메이션 적용
                if (this.currentContent.name === 'aboutMe') this.hideDialog();
            },
            onComplete: () => {
                // 버튼이름 변경
                if (app.isStart) {
                    app.isStart = false;
                    this.#returnToOrbitBtn.innerHTML = 'Back';
                }
                this.isInContent = false;
                this.isMovingCam = false;
                app.camera.orbitControls.enabled = true;
                this.#webgl.style.zIndex = 0;
                this.#controlLimitSet(app.camera.orbitControls); // control 제한

                // 초기화
                this.#listCount = 0;
                this.isInGuestBook = false;
                // prev 버튼 비활성화
                this.#prevBtnSwitch();
            }
        })
        // 카메라 타겟 변경
        gsap.to(app.camera.orbitControls.target, {
            x: 1, y: 1.5, z: 2, duration: 1, ease: 'power1.inOut',
        })
        // 빛가루 투명화 해제
        gsap.to(world.environment.lightParticleMaterial, {
            duration: 1, ease: 'power1.inOut', opacity: 1,
            onComplete: () => world.environment.lightParticleMaterial.transparent = false,
        })
    }

    // Start로 시작
    #playStartAnimation() {
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
        const contents = app.contents.getList();
        const world = World.getInstance();

        // 모바일인 경우 nav 메뉴 사라짐
        if (app.windowSizes.width <= 497) {
            document.querySelector('#navMenuBtn').style.left = '-50px';
        }

        // start 시 aboutMe으로 설정
        this.currentContent = contents[0];

        // 첫 시작 오디오 재생 todo: 배포시 주석 해제
        setTimeout(() => app.audio.sound.play(),100);

        // 크게 도는 애니메이션
        gsap.to(app.camera.instance.position, {
            duration: 2, ease: 'power1.inOut',
            // set position
            ...app.contents.getStartPositions(),
            onStart: () => {
                this.isMovingCam = true;
                this.isInContent = true;
                app.camera.orbitControls.enabled = false;
                app.isStart = true;
                this.#controlLimitBreak(app.camera.orbitControls); // down control 제한 해제
                this.convertTransparent('zoomIn', 1900, 1.5, 1.5);
            },
            onComplete: () => {
                // aboutMe로 줌인 애니메이션
                gsap.to(app.camera.instance.position, {
                    ...contents[0].cameraPosition, duration: 1.5, ease: 'power1.inOut',
                    onComplete: () => {
                        // 컨텐츠 nav menu 모바일 대응
                        if (app.windowSizes.width <= 497) {
                            this.#contentMenuBtns.style.bottom = '10px';
                        } else {
                            this.#contentMenuBtns.style.bottom = '30px';
                        }
                        this.#dialogBox.style.display = 'flex';
                        this.#showDialog();
                    }
                })
                gsap.to(app.camera.orbitControls.target, {
                    ...contents[0].controlsTarget, duration: 1.5, ease: 'power1.inOut',
                })
                // 빛가루 투명화
                gsap.to(world.environment.lightParticleMaterial, {
                    duration: 1.5, ease: 'power1.inOut', opacity: 0,
                    onStart: () => world.environment.lightParticleMaterial.transparent = true,
                })
            }
        })
    }

    /** 의자 등받이, 방명록 next/prev 버튼 mesh 투명 on/off */
    convertTransparent(
        type, ms = 0, chairDuration = 2,
        buttonDuration = 1, buttonTimeout = 1500
    ) {
        const raycaster = Application.getInstance().raycaster;
        setTimeout(() => {
            raycaster.targetMeshes.forEach(mesh => {
                if (type === 'zoomIn') {
                    if (mesh.name === ('chair')) {
                        gsap.to(mesh.material, { opacity: 0, duration: chairDuration });
                    }
                    if (mesh.name === ('prevReview') || mesh.name === ('nextReview')) {
                        setTimeout(() => {
                            gsap.to(mesh.material, { opacity: 1, duration: buttonDuration });
                        }, buttonTimeout);
                    }
                }
                if (type === 'zoomOut') {
                    if (mesh.name === ('chair')) {
                        gsap.to(mesh.material, { opacity: 1, duration: chairDuration });
                    }
                    if (mesh.name === ('prevReview') || mesh.name === ('nextReview')) {
                        gsap.to(mesh.material, { opacity: 0, duration: buttonDuration });
                    }
                }
            })
        }, ms);
    }

    // about me 대화창 등장 매서드
    #showDialog() {
        // get instance
        const app = Application.getInstance();
        // 대화창 등장시 대화 초기화 후 등장
        this.#dialogContent.textContent = '';
        this.#dialogBox.style.display = 'flex';
        // transition을 기다린 후 실행
        setTimeout(() => {
            this.#dialogBox.style.opacity = '1';

            setTimeout(() => {
                this.isMovingCam = false;

                // 대화창 생성시 반드시 step1, 타이핑이벤트 실행
                this.#typing(DIALOG_TEXT);
            }, 800);

        }, 300);
    }

    // about me 대화창 사라지는 매서드
    hideDialog(toContents, isBtn) {
        // get instance
        const app = Application.getInstance();
        this.#dialogBox.style.opacity = '0';
        // 커서 깜빡임 루프 멈춤
        setTimeout(() => {
            clearInterval(this.cursorInterval);
            this.cursorInterval = null;

            this.#dialogBox.style.display = 'none';

            // 단순히 사라지는 이벤트인 경우 (타이핑모드가 아닌 경우)
            if (toContents === undefined && isBtn === undefined) return;

            this.toContent(toContents, isBtn);
        }, 320);
    }

    // 타이핑 실행 매서드
    #typing(text, typingSpeed = 35) {
        let charIndex = 0;
        let content = '';

        this.#cursorWrap.style.display = 'inline-block';
        this.#cursorWrap.style.position = 'relative';
        this.#cursorWrap.appendChild(this.#dialogCursor);

        const typing = () => {
            // 태그 체크 후 일괄적으로 문자열 추가
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

            // html에 문자열 삽입
            this.#dialogContent.innerHTML = content;
            this.#dialogContent.appendChild(this.#cursorWrap);

            // 타이핑중일 땐 커서 루프 정지
            if (this.cursorInterval !== null) {
                clearInterval(this.cursorInterval);
                this.cursorInterval = null;
            }
            // 문자열을 모두 html에 삽입할 때까지 타이핑 반복
            if (charIndex < text.length) {
                this.#typingTimeout = setTimeout(() => {
                    typing();
                    this.#dialogContent.scrollTop = this.#dialogContent.scrollHeight;
                }, typingSpeed);
            }
            // 모두 삽입되었을때 커서깜빡임 루프 작동
            if (charIndex >= text.length) {
                this.#typingTimeout = null;
                this.#cursorLoop();
            }
        }
        typing();
    }

    // 타이핑 스킵 매서드
    #skipTyping(text) {
        this.#dialogContent.innerHTML = text;
        this.#dialogContent.appendChild(this.#cursorWrap);
        this.#cursorLoop();
        clearTimeout(this.#typingTimeout);
        this.#typingTimeout = null;
    }

    // 커서 깜빡임 루프 매서드
    #cursorLoop() {
        this.cursorInterval = setInterval(() => {
            this.#dialogCursor.classList.toggle('toggleCursor');
        }, 500);
    }

    // 컨트롤 제한 (컨텐츠에서 zoom in 모드에서 벗어나면 다시 제한)
    #controlLimitSet(controls) {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // 하단 시점 제한
        controls.minDistance = 5; // 가까워지는 최소거리 설정
    }

    // 컨트롤 제한 해제 (카메라 무빙 이벤트 시 제한 해제 필요)
    #controlLimitBreak(controls) {
        controls.maxPolarAngle = THREE.MathUtils.degToRad(360); // 하단 시점 제한해제
        controls.minDistance = 0; // 가까워지는 최소거리 설정
    }
    // 방명록, 타이핑 setTimeout 해제 매서드
    #breakTimeoutk(timeout, func) {
        if (timeout !== null) clearTimeout(timeout);
        func();
    }
}