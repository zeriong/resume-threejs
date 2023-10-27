import Dino from './Dino';
import Room from './Room';
import Fonts from './Fonts';
import Environment from './Environment';
import Application from '../Application';

export default class World {
    constructor() {
        const app = Application.getInstance();
        this.loader = app.loader;

        // position들은 raycaster에서 사용하기 위함
        this.room = new Room();
        this.projectsPosition = this.room.projectsPosition;
        this.learningPosition = this.room.learningPosition;
        this.skillsPosition = this.room.skillsPosition;
        this.posterPosition = this.room.posterPosition;

        this.dino = new Dino();
        this.dinoPosition = this.dino.position;

        this.fonts = new Fonts();
        this.environment = new Environment();
    }

    update() {
        this.environment.update();
    }
}