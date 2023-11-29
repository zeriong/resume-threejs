import Application from '../Application';

export default class UI {
    #isPlay;
    #removeNavOpen;

    constructor() {
        this.#isPlay = true;

        this.#init();
    }

    #init() {
        const app = Application.getInstance();

        const guestBookBtn = document.querySelector('#guestBookBtn');
        const soundBtn = document.querySelector('#soundBtn');
        const guestBookToolTip = document.querySelector('#guestBookToolTip');
        const soundToolTip = document.querySelector('#soundToolTip');
        const soundOn = document.querySelector('#soundOn');
        const soundOff = document.querySelector('#soundOff');

        // 모바일인 경우 nav 메뉴 추가
        if (app.windowSizes.width <= 497) {
            const contentsController = app.contentsController;
            const navMenuBtn = document.querySelector('#navMenuBtn');
            const navMenuBack = document.querySelector('#navMenuBack');
            const navMenu = document.querySelector('#navMenu');

            // 모바일인 경우 버튼 활성화
            navMenuBtn.style.display = 'flex';

            // nav메뉴 Open 클래스 toggle 함수
            const toggleNavOpen = () => {
                if (contentsController.isInContent) return;
                navMenuBack.classList.toggle('navOpen');
                navMenu.classList.toggle('navOpen');
            }
            // nav메뉴 Open 클래스 remove 함수
            const removeNavOpen = () => {
                navMenuBack.classList.remove('navOpen');
                navMenu.classList.remove('navOpen');
            }
            // 깃허브 링크 함수
            const linkGithub = () => window.open('https://github.com/zeriong/','_blank');
            // 블로그 링크 함수
            const linkBlog = () => window.open('https://zeriong.tistory.com/','_blank');

            // 이벤트 등록
            navMenuBtn.addEventListener('click', toggleNavOpen);
            navMenuBack.addEventListener('click', () => {
                if (navMenu.classList.contains('navOpen') && navMenuBack.classList.contains('navOpen')) removeNavOpen();
            });
            // 카메라 무빙 애니메이션 이벤트 등록
            app.contents.getList().map(item => {
                if (item.navMenuId) {
                    // 컨텐츠 이동함수
                    const toContent = () => {
                        if (contentsController.isInContent) return;
                        removeNavOpen();
                        setTimeout(() => {
                            contentsController.toContent(item.name);
                        }, 200);
                    }
                    // 각 메뉴에 이벤트 등록
                    document.querySelector(`#${item.navMenuId}`).addEventListener('click', toContent);
                }
            });
            // 링크메뉴 이벤트 등록
            document.querySelector('#navGithub').addEventListener('click', linkGithub);
            document.querySelector('#navBlog').addEventListener('click', linkBlog);
        }

        // 모바일이 아닌 경우만 방명록 & 사운드 버튼 툴팁, hover 이벤트
        if (app.windowSizes.width > 497) {
            guestBookBtn.addEventListener('mouseenter' ,() => {
                guestBookBtn.style.backgroundColor = '#363636';
                guestBookToolTip.style.opacity = 1;
                guestBookToolTip.style.visibility = 'visible';
            });
            guestBookBtn.addEventListener('mouseleave' ,() => {
                guestBookBtn.style.backgroundColor = '#252525';
                guestBookToolTip.style.opacity = 0;
                guestBookToolTip.style.visibility = 'hidden';
            });
            soundBtn.addEventListener('mouseenter' ,() => {
                soundBtn.style.backgroundColor = '#363636';
                soundToolTip.style.opacity = 1;
                soundToolTip.style.visibility = 'visible';
            });
            soundBtn.addEventListener('mouseleave' ,() => {
                soundBtn.style.backgroundColor = '#252525';
                soundToolTip.style.opacity = 0;
                soundToolTip.style.visibility = 'hidden';
            });
        }

        // 사운드버튼 클릭 시 아이콘 토글 이벤트
        soundBtn.addEventListener('click', () => {
            if (this.#isPlay) {
                this.#isPlay = false;
                app.audio.sound.pause();
                soundOff.style.display = 'block';
                soundOn.style.display = 'none';
            } else {
                this.#isPlay = true;
                app.audio.sound.play();
                soundOff.style.display = 'none';
                soundOn.style.display = 'block';
            }
        });
    }
}