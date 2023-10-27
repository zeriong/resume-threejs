import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.roomInitScaleArr = new Array(3).fill(0.001);
        this.roomSizes = {
            monitor: { width: 879, height: 438 },
            learning: { width: 520, height: 740 },
            skills: { width: 553, height: 333 },
            poster: { width: 980, height: 1210 },
        }

        this.setCameraPosition();

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.trigger('resize');
        });
    }

    setCameraPosition() {
        const fixCamPosition = () => {
            if (this.width >= 1400) return 1;
            return (1400 - this.width) * (this.width <= 420 ? 0.0003 : 0.0007) + 1;
        }
        this.cameraPosition = [
            (this.width <= 420) ? (-2.96 * fixCamPosition()) : (-24 * fixCamPosition()),
            (this.width <= 420) ? (10.63 * fixCamPosition()) : (14.4 * fixCamPosition()),
            (this.width <= 420) ? (30.98 * fixCamPosition()) : (14 * fixCamPosition()),
        ]
    }
}