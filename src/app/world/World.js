import Doll from './Doll';
import Room from './Room';
import Fonts from './Fonts';
import Environment from './Environment';
import Lights from "./Lights";
import GuestBook from "./GuestBook";

export default class World {

    // 싱글톤 패턴 적용
    static getInstance() {
        // 인스턴스가 없다면 새로 생성하고 있다면 인스턴스 반환
        if (!World.instance) new World();
        return World.instance;
    }

    constructor() {
        // 생성자에서 인스턴스 정의
        World.instance = this;
    }

    init() {
        this.lights = new Lights();
        this.room = new Room();
        this.doll = new Doll();
        this.fonts = new Fonts();
        this.environment = new Environment();
        this.guestBook = new GuestBook();

        return World.instance;
    }

    update() {
        this.environment.update();
    }
}