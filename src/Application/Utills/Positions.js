import Sizes from './Sizes';
import Application from '../Application';
import Room from '../World/Room';
import Dino from '../World/Dino';

export default class Positions {
    constructor() {
        this.app = Application.getInstance();
        this.sizes = this.app.sizes;
        this.world = this.app.world;

        this.projectsPosition = this.world.projectsPosition;
        this.learningPosition = this.world.learningPosition;
        this.skillsPosition = this.world.skillsPosition;
        this.posterPosition = this.world.posterPosition;

        this.dinoPosition = this.world.dinoPosition;

        this.fixCameraPosition = this.cameraPositionFixer();
        this.fixMonitorPosition = this.monitorCamPositionFixer();
    }

    // OrbitControls default 시점
    returnToOrbitPositions() {
        return {
            x: (this.sizes.width <= 420) ? (-2.96 * this.fixCameraPosition) : (-18 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (10.63 * this.fixCameraPosition) : (14.4 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (30.98 * this.fixCameraPosition) : (19.2 * this.fixCameraPosition),
        }
    }

    // Play Start 애니메이션 카메라 포지션
    playStartAnimationPositions() {
        return {
            x: (this.sizes.width <= 420) ? (-18 * this.fixCameraPosition) : (0.5 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (14.4 * this.fixCameraPosition + 5) : (5 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (19.2 * this.fixCameraPosition) : (27 * this.fixCameraPosition),
        }
    }

    cameraPositionFixer() {
        if (this.sizes.width >= 1400) return 1;
        return (1400 - this.sizes.width) * (this.sizes.width <= 420 ? 0.0003 : 0.0007) + 1;
    }

    monitorCamPositionFixer () {
        if ( this.sizes.width <= 530) return 4;
        if (this.sizes.width <= 740) return 3;
        return 1.9;
    }

    getContentPositions() {
        return [
            // about me 첫번째 대화
            {
                current: 'aboutMe1', next: 'aboutMe2', prev: 'poster',
                cameraPosition: {
                    x: (this.dinoPosition.x), y: (this.dinoPosition.y + 0.4), z: (this.dinoPosition.z + 2.5 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.dinoPosition.x), y: (this.dinoPosition.y + 0.2), z: (this.dinoPosition.z)
                }
            },

            // about me 두번째 대화 (카메라 무빙 애니메이션 x)
            { current: 'aboutMe2', next: 'projects', prev: 'aboutMe1' },

            {
                current: 'projects', next: 'learning', prev: 'aboutMe1',
                cameraPosition: {
                    x: (this.projectsPosition.x), y: (this.projectsPosition.y), z: (this.projectsPosition.z + this.fixMonitorPosition + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.projectsPosition.x), y: (this.projectsPosition.y), z: (this.projectsPosition.z)
                }
            },

            // learning
            {
                current: 'learning', next: 'skills', prev: 'projects',
                cameraPosition: {
                    x: (this.learningPosition.x), y: (this.learningPosition.y), z: (this.learningPosition.z + 3)
                },
                controlsTarget: {
                    x: (this.learningPosition.x), y: (this.learningPosition.y), z: (this.learningPosition.z)
                }
            },

            // skills
            {
                current: 'skills', next: 'poster', prev: 'learning',
                cameraPosition: {
                    x: (this.skillsPosition.x),
                    y: (this.skillsPosition.y),
                    z: (this.skillsPosition.z + 1.6 + (this.fixCameraPosition > 1.32 ? 1.32 : this.fixCameraPosition))
                },
                controlsTarget: {
                    x: (this.skillsPosition.x), y: (this.skillsPosition.y), z: (this.skillsPosition.z)
                }
            },

            // poster
            {
                current: 'poster', next: 'aboutMe1', prev: 'skills',
                cameraPosition: {
                    x: (this.posterPosition.x), y: (this.posterPosition.y), z: (this.posterPosition.z + 4 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.posterPosition.x), y: (this.posterPosition.y), z: (this.posterPosition.z)
                }
            },
        ];
    }
}