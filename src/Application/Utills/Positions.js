import Application from '../Application';

export default class Positions {
    constructor() {
        this.app = Application.getInstance();
        this.sizes = this.app.sizes;
        this.world = this.app.world;

        this.projectsPosition = this.world.projectsPosition;
        this.historyPosition = this.world.historyPosition;
        this.skillsPosition = this.world.skillsPosition;
        this.posterPosition = this.world.posterPosition;
        this.aboutMePosition = this.world.aboutMePosition;

        this.fixCameraPosition = this.getFixCameraPosition();
        this.fixMonitorPosition = this.getFixMonitorCamPosition();
        this.fixSkillsPosition = this.getFixSkillsPosition();
        this.fixHistoryPosition = this.getFixHistoryCamPosition();
    }

    // OrbitControls default 시점
    getReturnToOrbitPositions() {
        return {
            x: (this.sizes.width <= 420) ? (-2.96 * this.fixCameraPosition) : (-18 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (10.63 * this.fixCameraPosition) : (14.4 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (30.98 * this.fixCameraPosition) : (19.2 * this.fixCameraPosition),
        }
    }

    // Play Start 애니메이션 카메라 포지션
    getPlayStartAnimationPositions() {
        return {
            x: (this.sizes.width <= 420) ? (-18 * this.fixCameraPosition) : (0.5 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (14.4 * this.fixCameraPosition + 5) : (5 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (19.2 * this.fixCameraPosition) : (27 * this.fixCameraPosition),
        }
    }

    getFixCameraPosition() {
        if (this.sizes.width >= 1400) return 1;
        return (1400 - this.sizes.width) * (this.sizes.width <= 420 ? 0.0003 : 0.0001) + 1;
    }

    getFixSkillsPosition() {
        if (this.sizes.width >= 1400) return 0;
        if (this.sizes.width <= 420) {
            const value = (1400 - this.sizes.width) * 0.0003 + 1;
            if (value > 1.32) return 1.32;
            return value;
        }
        return (1400 - this.sizes.width) * 0.0007 + 0.5;
    }

    getFixMonitorCamPosition() {
        if (this.sizes.width <= 530) return 4;
        if (this.sizes.width <= 740) return 3;
        if (this.sizes.width <= 1400) return 1.9;
        if (this.sizes.width <= 1920) return 1.3;
        return 1.3
    }

    getFixHistoryCamPosition() {
        if (this.sizes.width <= 740) return 3;
        return 2.5
    }

    getGuestBookPosition() {
        // origin: cam = ( 0.5 / 2 / 2.2 ) , target = ( 1 / 2 / 2.2 )
        return {
            cameraPosition: {
                x: 0.5, y: 2, z: 2.2
            },
            controlsTarget: {
                x: 1, y: 2, z: 2.2
            }
        }
    }

    getContentPositions() {
        return [
            // about me 첫번째 대화
            {
                current: 'aboutMe1', next: 'aboutMe2', prev: 'poster',
                cameraPosition: {
                    x: (this.aboutMePosition.x), y: (this.aboutMePosition.y + 0.4), z: (this.aboutMePosition.z + 2.5 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.aboutMePosition.x), y: (this.aboutMePosition.y + 0.2), z: (this.aboutMePosition.z)
                }
            },

            // about me 대화 (카메라 무빙 애니메이션 x)
            { current: 'aboutMe2', next: 'aboutMe3', prev: 'aboutMe1' },
            { current: 'aboutMe3', next: 'aboutMe4', prev: 'aboutMe2' },
            { current: 'aboutMe4', next: 'projects', prev: 'aboutMe3' },

            // projects
            {
                current: 'projects', next: 'history', prev: 'aboutMe1',
                cameraPosition: {
                    x: (this.projectsPosition.x), y: (this.projectsPosition.y), z: (this.projectsPosition.z + this.fixMonitorPosition + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.projectsPosition.x), y: (this.projectsPosition.y), z: (this.projectsPosition.z)
                }
            },

            // history
            {
                current: 'history', next: 'skills', prev: 'projects',
                cameraPosition: {
                    x: (this.historyPosition.x), y: (this.historyPosition.y), z: (this.historyPosition.z + this.fixHistoryPosition)
                },
                controlsTarget: {
                    x: (this.historyPosition.x), y: (this.historyPosition.y), z: (this.historyPosition.z)
                }
            },

            // skills
            {
                current: 'skills', next: 'poster', prev: 'history',
                cameraPosition: {
                    x: (this.skillsPosition.x),
                    y: (this.skillsPosition.y),
                    z: (this.skillsPosition.z + 1.6 + this.fixSkillsPosition)
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