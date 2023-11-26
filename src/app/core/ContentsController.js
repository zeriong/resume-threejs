export default class ContentsController {
    #listCount = 0
    #isActivePrev = false
    #typingTimeout = null
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

    isInContent = false
    isInGuestBook = false
    currentContent = null

    constructor() {

    }
}