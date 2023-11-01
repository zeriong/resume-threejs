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
}