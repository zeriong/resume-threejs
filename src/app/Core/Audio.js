import * as THREE from 'three';
import Application from '../Application';

export default class Audio {
    constructor() {
        this.app = Application.getInstance();
        this.listner = new THREE.AudioListener(); // 오디오 리스터 생성
        this.app.camera.instance.add(this.listner); // 카메라에 오디오 추가
        this.sound = new THREE.Audio(this.listner); // 오디오 전역 생성

        this.setAudio();
    }

    setAudio() {
        this.app.loader.audioLoader.load('/assets/audio/bgm.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(true);
            this.sound.setVolume(0.2);
        });
    }
}