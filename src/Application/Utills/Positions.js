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
        this.guestBookPosition = { x: 0.5, y: 2, z: 2.2 }

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

    // Start 애니메이션 카메라 포지션
    getStartAnimationPositions() {
        return {
            x: (this.sizes.width <= 420) ? (-18 * this.fixCameraPosition) : (0.5 * this.fixCameraPosition),
            y: (this.sizes.width <= 420) ? (14.4 * this.fixCameraPosition + 5) : (5 * this.fixCameraPosition),
            z: (this.sizes.width <= 420) ? (19.2 * this.fixCameraPosition) : (27 * this.fixCameraPosition),
        }
    }

    // 브라우저 크기에 따른 카메라 포지션 보정
    getFixCameraPosition() {
        if (this.sizes.width >= 1400) return 1;
        return (1400 - this.sizes.width) * (this.sizes.width <= 420 ? 0.0003 : 0.0001) + 1;
    }

    // 브라우저 크기에 따른 skills 컨텐츠 포지션 보정
    getFixSkillsPosition() {
        if (this.sizes.width >= 1400) return 0;
        if (this.sizes.width <= 420) {
            const value = (1400 - this.sizes.width) * 0.0003 + 1;
            if (value > 1.32) return 1.32;
            return value;
        }
        return (1400 - this.sizes.width) * 0.0007 + 0.5;
    }

    // 브라우저 크기에 따른 projects 컨텐츠 포지션 보정
    getFixMonitorCamPosition() {
        if (this.sizes.width <= 530) return 4;
        if (this.sizes.width <= 740) return 3;
        if (this.sizes.width <= 1400) return 1.9;
        if (this.sizes.width <= 1920) return 1.3;
        return 1.3
    }

    // 브라우저 크기에 따른 history 컨텐츠 포지션 보정
    getFixHistoryCamPosition() {
        if (this.sizes.width <= 740) return 3;
        return 2.5
    }

    getContentPositions() {
        return [
            // about me 첫번째 대화
            {
                current: 'aboutMe', next: 'projects', prev: 'guestBook',
                cameraPosition: {
                    x: (this.aboutMePosition.x), y: (this.aboutMePosition.y + 0.4), z: (this.aboutMePosition.z + 2.5 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.aboutMePosition.x), y: (this.aboutMePosition.y + 0.2), z: (this.aboutMePosition.z)
                }
            },

            // projects
            {
                current: 'projects', next: 'skills', prev: 'aboutMe',
                cameraPosition: {
                    x: (this.projectsPosition.x), y: (this.projectsPosition.y), z: (this.projectsPosition.z + this.fixMonitorPosition + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (this.projectsPosition.x), y: (this.projectsPosition.y), z: (this.projectsPosition.z)
                }
            },

            // skills
            {
                current: 'skills', next: 'history', prev: 'projects',
                cameraPosition: {
                    x: (this.skillsPosition.x), y: (this.skillsPosition.y), z: (this.skillsPosition.z + 1.6 + this.fixSkillsPosition)
                },
                controlsTarget: {
                    x: (this.skillsPosition.x), y: (this.skillsPosition.y), z: (this.skillsPosition.z)
                }
            },

            // history
            {
                current: 'history', next: 'guestBook', prev: 'skills',
                cameraPosition: {
                    x: (this.historyPosition.x), y: (this.historyPosition.y), z: (this.historyPosition.z + this.fixHistoryPosition)
                },
                controlsTarget: {
                    x: (this.historyPosition.x), y: (this.historyPosition.y), z: (this.historyPosition.z)
                }
            },

            // guestBook
            {
                current: 'guestBook', next: 'aboutMe', prev: 'history',
                cameraPosition: {
                    x: (this.guestBookPosition.x), y: (this.guestBookPosition.y), z: (this.guestBookPosition.z)
                },
                controlsTarget: {
                    x: (this.guestBookPosition.x + 0.5), y: (this.guestBookPosition.y), z: (this.guestBookPosition.z)
                },
            },

            // poster: 순회 컨텐츠에 포함 x
            {
                current: 'poster',
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