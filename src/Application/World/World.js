import Dino from './Dino';
import Room from './Room';
import Fonts from './Fonts';

export default class World {
    constructor() {
        this.dino = new Dino();
        this.room = new Room();
        this.fonts = new Fonts();
    }

    update() {
        console.log('update-world');
    }
}