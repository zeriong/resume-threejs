import Application from '../Application';

export default class UI {
    #isPlay;

    constructor() {
        this.#isPlay = true

        this.init();
    }

    init() {
        const app = Application.getInstance()

        const guestBookBtn = document.querySelector('#guestBookBtn');
        const soundBtn = document.querySelector('#soundBtn');
        const guestBookToolTip = document.querySelector('#guestBookToolTip');
        const soundToolTip = document.querySelector('#soundToolTip');
        const soundOn = document.querySelector('#soundOn');
        const soundOff = document.querySelector('#soundOff');

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