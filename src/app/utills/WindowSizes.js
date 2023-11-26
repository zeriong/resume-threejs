import Application from '../Application';
import {debounce} from "../common/libs";

export default class WindowSizes {
    constructor() {
        const app = Application.getInstance();
        this.update();

        const debouncedResize = debounce(() => {
            this.update();
            app.resize();
        }, 300);

        window.addEventListener('resize', debouncedResize);
    }

    update() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}