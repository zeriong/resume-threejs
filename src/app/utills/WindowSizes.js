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

        // html을 보여주는 CSS3DObject 기본 scale 비율
        this.roomInitScale = new Array(3).fill(0.001);

        // html을 보여주는 CSS3DObject mesh의 크기
        this.roomSizes = {
            monitor: {width: 877, height: 545},
            roadMap: {width: 520, height: 743},
            skills: {width: 553, height: 480},
            poster: {width: 986, height: 1500},
        }

        window.addEventListener('resize', debouncedResize);
    }

    update() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
}