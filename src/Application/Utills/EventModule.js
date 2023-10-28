import Application from '../Application';

export default class EventModule {
    constructor() {
        this.app = Application.getInstance();

        // typing
        this.typingSkip = false;
        this.typingTimout = null;
        this.cursorInterval = null;

        // Elements
        this.dialogContent = document.querySelector('.dialog-content');
        this.cursorWrap = document.createElement('div');
        this.dialogCursor = document.createElement('span');
        this.dialogCursor.id = 'dialogCursor';
    }

    typing(text, typingSpeed = 50) {
        let charIndex = 0;

        // 타이핑 커서도 함께 넣어 렌더링

        this.cursorWrap.style.display = 'inline-block';
        this.cursorWrap.style.position = 'relative';
        this.cursorWrap.appendChild(this.dialogCursor);

        const typing = () => {
            let txt = text[charIndex++];
            this.dialogContent.textContent += txt
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
                console.log('끝')
            }
        }
        typing();
    }

    skipTyping(text) {
        this.dialogContent.textContent = text;
        this.dialogContent.appendChild(this.cursorWrap);
        this.cursorLoop();
        clearTimeout(this.typingTimout);
        this.typingTimout = null;
    }

    cursorLoop() {
        console.log('안되나?')
        this.cursorInterval = setInterval(() => {
            this.dialogCursor.classList.toggle('toggleCursor');
        }, 500);
    }
}