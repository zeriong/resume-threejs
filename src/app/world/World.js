import Doll from './Doll';
import Room from './Room';
import Fonts from './Fonts';
import Environment from './Environment';

export default class World {
    constructor() {
        // positions에 등록
        this.room = new Room();
        this.projectsPosition = this.room.projectsPosition;
        this.historyPosition = this.room.roadMapPosition;
        this.skillsPosition = this.room.skillsPosition;
        this.posterPosition = this.room.posterPosition;

        this.aboutMe = new Doll();
        this.aboutMePosition = this.aboutMe.position;

        this.fonts = new Fonts();
        this.environment = new Environment();
    }

    update() {
        this.environment.update();
    }
}