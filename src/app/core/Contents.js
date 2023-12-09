import Application from '../Application';
import {MODEL_ROOM_OBJECT_POSITIONS} from "../common/constants";

export default class Contents {
    constructor() {
        const app = Application.getInstance();
        this.windowSizes = app.windowSizes;
    }

    // OrbitControls default 시점
    getOrbitPositions() {
        let fixer;
        const calc = 1200 - this.windowSizes.width;

        if (this.windowSizes.width >= 1200) fixer = 100;
        else if (this.windowSizes.width >= 800) fixer = calc * 0.1 + 100;
        else if (this.windowSizes.width >= 600) fixer = calc * 0.15 + 100;
        else if (this.windowSizes.width > 450) fixer = calc * 0.2 + 100;
        else  fixer = calc * 0.09 + 100;

        return { x: -11.95 * fixer, y: 9.35 * fixer, z: 14.4 * fixer }
    }

    // Start 애니메이션 카메라 포지션
    getStartPositions() {
        return {
            x: (this.windowSizes.width <= 497) ? (-1800 * this.getFixCameraPosition()) : (50 * this.getFixCameraPosition()),
            y: (this.windowSizes.width <= 497) ? (1440 * this.getFixCameraPosition() + 500) : (500 * this.getFixCameraPosition()),
            z: (this.windowSizes.width <= 497) ? (1920 * this.getFixCameraPosition()) : (2700 * this.getFixCameraPosition()),
        }
    }

    // 브라우저 크기에 따른 카메라 포지션 보정
    getFixCameraPosition() {
        if (this.windowSizes.width >= 1400) return 100;
        return (1400 - this.windowSizes.width) * (this.windowSizes.width <= 497 ? 0.0003 : 0.0001) + 100;
    }

    // 브라우저 크기에 따른 skills 컨텐츠 포지션 보정
    getFixSkillsPosition() {
        if (this.windowSizes.width >= 1400) return 0;
        if (this.windowSizes.width <= 497) {
            const value = (1400 - this.windowSizes.width) * 0.0003 + 100;
            if (value > 132) return 132;
            return value;
        }
        return (1400 - this.windowSizes.width) * 0.0007 + 70;
    }

    // 브라우저 크기에 따른 projects 컨텐츠 포지션 보정
    getFixMonitorCamPosition() {
        if (this.windowSizes.width <= 530) return 310;
        if (this.windowSizes.width <= 740) return 300;
        if (this.windowSizes.width <= 1400) return 190;
        if (this.windowSizes.width <= 1920) return 130;
        return 130
    }

    // 브라우저 크기에 따른 roadmap 컨텐츠 포지션 보정
    getFixRoadmapCamPosition() {
        if (this.windowSizes.width <= 740) return 300;
        return 250
    }

    // 브라우저 크기에 따른 방명록 컨텐츠 포지션 보정
    getFixGuestBookPosition() {
        if (this.windowSizes.width <= 300) return 200;
        if (this.windowSizes.width <= 497) return 150;
        if (this.windowSizes.width <= 500) return 200;
        if (this.windowSizes.width <= 700) return 180;
        if (this.windowSizes.width <= 1000) return 80;
        else return 0
    }

    getList() {
        const positions = MODEL_ROOM_OBJECT_POSITIONS;
        return [
            // about me 첫번째 대화
            {
                name: 'aboutMe', objNames: ['doll', 'aboutMe_menu'], navMenuId: 'navAboutMe',
                cameraPosition: {
                    x: (positions.DOLL.x), y: (positions.DOLL.y + 40), z: (positions.DOLL.z + 250 + this.getFixCameraPosition())
                },
                controlsTarget: {
                    x: (positions.DOLL.x), y: (positions.DOLL.y + 20), z: (positions.DOLL.z)
                }
            },

            // projects
            {
                name: 'projects', objNames: ['monitor', 'projects_menu'], navMenuId: 'navProjects',
                cameraPosition: {
                    x: (positions.MONITOR.x), y: (positions.MONITOR.y), z: (positions.MONITOR.z + this.getFixMonitorCamPosition() + this.getFixCameraPosition())
                },
                controlsTarget: {
                    x: (positions.MONITOR.x), y: (positions.MONITOR.y), z: (positions.MONITOR.z)
                }
            },

            // roadmap
            {
                name: 'roadmap', objNames: ['frame1', 'roadmap_menu'], navMenuId: 'navRoadmap',
                cameraPosition: {
                    x: (positions.FRAME1.x), y: (positions.FRAME1.y), z: (positions.FRAME1.z + this.getFixRoadmapCamPosition())
                },
                controlsTarget: {
                    x: (positions.FRAME1.x), y: (positions.FRAME1.y), z: (positions.FRAME1.z)
                }
            },

            // skills
            {
                name: 'skills', objNames: ['frame2', 'skills_menu'], navMenuId: 'navSkills',
                cameraPosition: {
                    x: (positions.FRAME2.x), y: (positions.FRAME2.y), z: (positions.FRAME2.z + 160 + this.getFixSkillsPosition())
                },
                controlsTarget: {
                    x: (positions.FRAME2.x), y: (positions.FRAME2.y), z: (positions.FRAME2.z)
                }
            },

            // guestBook
            {
                name: 'guestBook', objNames: ['guestBook'],
                cameraPosition: {
                    x: (positions.GUESTBOOK_AREA.x - this.getFixGuestBookPosition()), y: (positions.GUESTBOOK_AREA.y), z: (positions.GUESTBOOK_AREA.z)
                },
                controlsTarget: {
                    x: (positions.GUESTBOOK_AREA.x + 50), y: (positions.GUESTBOOK_AREA.y), z: (positions.GUESTBOOK_AREA.z)
                },
            },

            // poster
            {
                name: 'poster', objNames: ['poster'],
                cameraPosition: {
                    x: (positions.POSTER.x), y: (positions.POSTER.y), z: (positions.POSTER.z + 400 + this.getFixCameraPosition())
                },
                controlsTarget: {
                    x: (positions.POSTER.x), y: (positions.POSTER.y), z: (positions.POSTER.z)
                }
            },
        ];
    }

    next(current) {
        const list = this.getList()
        // 현재 current의 인덱스를 찾기
        const currentIndex = list.findIndex(item => item.name === current.name);

        // 다음 요소가 배열 범위 내에 있는지 확인하고, 있다면 현재 값을 업데이트
        if (currentIndex >= 0 && currentIndex < list.length - 1) {
            return list[currentIndex + 1];
        } else {
            // 마지막 요소에 도달했을 때 처음으로 돌아가기
            return list[0];
        }
    }

    prev(current) {
        const list = this.getList()
        // 현재 current의 인덱스를 찾기
        const currentIndex = list.findIndex(item => item.name === current.name);

        // 이전 요소가 배열 범위 내에 있는지 확인하고, 있다면 현재 값을 업데이트
        if (currentIndex > 0) {
            return list[currentIndex - 1];
        } else {
            // 첫 번째 요소에 도달했을 때 마지막으로 돌아가기
            return list[list.length - 1];
        }
    }

}