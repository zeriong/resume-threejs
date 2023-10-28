import Application from '../Application';

export default class Sizes {
    constructor() {
        this.app = Application.getInstance();
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.roomInitScale = new Array(3).fill(0.001);
        this.roomSizes = {
            monitor: { width: 879, height: 438 },
            learning: { width: 520, height: 740 },
            skills: { width: 553, height: 333 },
            poster: { width: 980, height: 1210 },
        }

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.app.resize();
        });
    }


}