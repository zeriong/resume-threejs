import Application from '../Application';

export default class EventModule {
    constructor() {
        this.app = Application.getInstance();

        // variables
        this.typingSkip = false;
        this.typingTimout = null;
        this.cursorInterval = null;

        this.onSound = true;
        this.onGuestBook = false;

        // Elements
        this.dialogContent = document.querySelector('.dialog-content');
        this.cursorWrap = document.createElement('div');
        this.dialogCursor = document.createElement('span');
        this.dialogCursor.id = 'dialogCursor';

        this.soundBtn = document.querySelector('#soundBtn');
        this.soundOn = document.querySelector('#soundOn');
        this.soundOff = document.querySelector('#soundOff');
        this.guestBookBtn = document.querySelector('#guestBookBtn');

        // Events
        this.soundBtn.addEventListener('click', () => {
            console.log('사운드 클리!')
            if (this.onSound) {
                this.onSound = false;
                this.soundOff.style.display = 'block';
                this.soundOn.style.display = 'none';
            } else {
                this.onSound = true;
                this.soundOff.style.display = 'none';
                this.soundOn.style.display = 'block';
            }
        })
    }

    typing(text, typingSpeed = 25) {
        let charIndex = 0;
        let content = ''

        this.cursorWrap.style.display = 'inline-block';
        this.cursorWrap.style.position = 'relative';
        this.cursorWrap.appendChild(this.dialogCursor);

        const typing = () => {
            let txt = text[charIndex++];
            content += txt === '\n' ? `<br/>` : txt;

            this.dialogContent.innerHTML = content;
            this.dialogContent.appendChild(this.cursorWrap);

            if (this.cursorInterval !== null) {
                clearInterval(this.cursorInterval);
                this.cursorInterval = null;
            }
            if (charIndex < text.length) {
                this.typingTimout = setTimeout(() => {
                    typing();
                }, typingSpeed);
            }
            if (charIndex >= text.length) {
                this.typingTimout = null;
                this.cursorLoop();
            }
        }
        typing();
    }

    skipTyping(text) {
        this.dialogContent.innerHTML = text.replace(/\n/g, `<br/>`);
        this.dialogContent.appendChild(this.cursorWrap);
        this.cursorLoop();
        clearTimeout(this.typingTimout);
        this.typingTimout = null;
    }

    cursorLoop() {
        this.cursorInterval = setInterval(() => {
            this.dialogCursor.classList.toggle('toggleCursor');
        }, 500);
    }

    playSound() {
        if (this.onSound) {
            console.log('사운드 플레이');
        }
    }
}