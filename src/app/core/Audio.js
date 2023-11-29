import * as THREE from 'three';
import Application from '../Application';

export default class Audio {
    constructor() {
        const app = Application.getInstance();

        // 오디오 리스너 생성
        const listner = new THREE.AudioListener();
        app.camera.instance.add(listner);

        // 오디오 전역 생성
        this.sound = new THREE.Audio(listner);

        this.init();
    }

    init() {
        const app = Application.getInstance();
        app.loader.audioLoader.load('/assets/audio/bgm.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(0.15);
        });
    }
}