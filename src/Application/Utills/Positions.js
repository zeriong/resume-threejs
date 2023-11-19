import Application from '../Application';

export default class Positions {
    constructor() {
        this.app = Application.getInstance();
        this.sizes = this.app.sizes;

        this.positionList = {
            aboutMe: { x: 1, y: 1, z: 0.5 },
            projects: { x: 1.682, y: 1.6, z: 0.223 },
            skills: { x: 1.918, y: 2.451, z: 0.103 },
            history: { x: 1.226, y: 2.451, z: 0.103 },
            guestBook: { x: 0.5, y: 2, z: 2.194 },
            poster: { x: -0.138, y: 2.312, z: 0.13 },
        };

        this.fixCameraPosition = this.getFixCameraPosition();
        this.fixMonitorPosition = this.getFixMonitorCamPosition();
        this.fixSkillsPosition = this.getFixSkillsPosition();
        this.fixHistoryPosition = this.getFixHistoryCamPosition();
        this.fixGuestBookPosition = this.getFixGuestBookPosition();
    }

    // OrbitControls default 시점
    getReturnToOrbitPositions() {
        let fixer;
        const calc = 1200 - this.sizes.width;

        if (this.sizes.width >= 1200) fixer = 1;
        else if (this.sizes.width >= 800) fixer = calc * 0.001 + 1;
        else if (this.sizes.width >= 600) fixer = calc * 0.0015 + 1;
        else if (this.sizes.width > 450) fixer = calc * 0.002 + 1;
        else  fixer = calc * 0.0013 + 1;

        return { x: -11.95 * fixer, y: 9.35 * fixer, z: 14.4 * fixer }
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
        return (1400 - this.sizes.width) * 0.0007 + 0.7;
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

    // 브라우저 크기에 따른 방명록 컨텐츠 포지션 보정
    getFixGuestBookPosition() {
        if (this.sizes.width <= 300) return 2;
        if (this.sizes.width <= 420) return 1.5;
        if (this.sizes.width <= 500) return 2;
        if (this.sizes.width <= 700) return 1.8;
        if (this.sizes.width <= 1000) return 0.8;
        else return 0
    }

    getContentPositions() {
        const positions = this.positionList;
        return [
            // about me 첫번째 대화
            {
                current: 'aboutMe', next: 'projects', prev: 'guestBook',
                cameraPosition: {
                    x: (positions.aboutMe.x), y: (positions.aboutMe.y + 0.4), z: (positions.aboutMe.z + 2.5 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (positions.aboutMe.x), y: (positions.aboutMe.y + 0.2), z: (positions.aboutMe.z)
                }
            },

            // projects
            {
                current: 'projects', next: 'skills', prev: 'aboutMe',
                cameraPosition: {
                    x: (positions.projects.x), y: (positions.projects.y), z: (positions.projects.z + this.fixMonitorPosition + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (positions.projects.x), y: (positions.projects.y), z: (positions.projects.z)
                }
            },

            // skills
            {
                current: 'skills', next: 'history', prev: 'projects',
                cameraPosition: {
                    x: (positions.skills.x), y: (positions.skills.y), z: (positions.skills.z + 1.6 + this.fixSkillsPosition)
                },
                controlsTarget: {
                    x: (positions.skills.x), y: (positions.skills.y), z: (positions.skills.z)
                }
            },

            // history
            {
                current: 'history', next: 'guestBook', prev: 'skills',
                cameraPosition: {
                    x: (positions.history.x), y: (positions.history.y), z: (positions.history.z + this.fixHistoryPosition)
                },
                controlsTarget: {
                    x: (positions.history.x), y: (positions.history.y), z: (positions.history.z)
                }
            },

            // guestBook
            {
                current: 'guestBook', next: 'aboutMe', prev: 'history',
                cameraPosition: {
                    x: (positions.guestBook.x - this.fixGuestBookPosition), y: (positions.guestBook.y), z: (positions.guestBook.z)
                },
                controlsTarget: {
                    x: (positions.guestBook.x + 0.5), y: (positions.guestBook.y), z: (positions.guestBook.z)
                },
            },

            // poster: 순회 컨텐츠에 포함 x
            {
                current: 'poster',
                cameraPosition: {
                    // x: (this.posterPosition.x), y: (this.posterPosition.y), z: (this.posterPosition.z + 4 + this.fixCameraPosition)
                    x: (positions.poster.x), y: (positions.poster.y), z: (positions.poster.z + 4 + this.fixCameraPosition)
                },
                controlsTarget: {
                    x: (positions.poster.x), y: (positions.poster.y), z: (positions.poster.z)
                }
            },
        ];
    }
}