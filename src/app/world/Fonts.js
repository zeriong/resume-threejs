import Application from '../Application';
import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry';

export default class Fonts {
    constructor() {
        this.init();
    }

    init() {
        const app = Application.getInstance();
        const raycaster = app.raycaster;
        const loader = app.loader;

        const authorGroup = new THREE.Group();  // zeriong, engineer 판넬 그룹
        const menuGroup = new THREE.Group();  // 메뉴 판넬 그룹
        const totalGroup = new THREE.Group();  // 전체 그룹

        const fixPos = { y: 8.9, x: 55 } // position: (y = +), (z = -)

        const clickAreaGeometry = new THREE.PlaneGeometry(130, 30, 1, 1);
        const clickAreaMaterial = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });

        // load bold font
        loader.fontLoader.load('/assets/fontJson/Pretendard_Bold.json', (font) => {
            // bold mesh list
            [
                { text: 'ZERIONG', objName: 'name', y: 45 },
                { text: 'About Me', objName: 'aboutMe_menu', y: 300 },
                { text: 'Projects', objName: 'projects_menu', y: 250 },
                { text: 'Skills', objName: 'skills_menu', y: 200 },
                { text: 'Roadmap', objName: 'roadmap_menu', y: 150 },
                { text: 'Github', objName: 'github_menu', y: 100 },
                { text: 'Blog', objName: 'blog_menu', y: 50 },
            ]
                .forEach((val) => {
                    // 모바일에서 mesh 메뉴 추가 안함 (nav 메뉴로 변경)
                    if (app.windowSizes.width <= 497 && val.objName !== 'name') return;

                    const position = new THREE.Vector3();
                    const geometry = new TextGeometry(val.text, {
                        font: font,
                        size: val.objName !== 'name' ? 18 : 32,
                        height: 0.1,
                        curveSegments: 5,
                        bevelSegments: 5,
                    });
                    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.y = val.y;

                    // 메뉴가 아닌 mesh는 그룹 추가 후 foreach를 빠져나옴 (추가할 이벤트 따로 x)
                    if (val.objName === 'name') return authorGroup.add(mesh);

                    mesh.name = val.objName;
                    mesh.getWorldPosition(position);

                    const clickAreaMesh = new THREE.Mesh(clickAreaGeometry, clickAreaMaterial);
                    clickAreaMesh.position.set(position.x + fixPos.x, position.y + fixPos.y, 0);
                    clickAreaMesh.name = val.objName;

                    menuGroup.add(mesh, clickAreaMesh);
                    raycaster.targetMeshes.push(mesh, clickAreaMesh);
                });

            // load regular font
            loader.fontLoader.load('/assets/fontJson/Pretendard_Regular.json', (font) => {
                const geometry = new TextGeometry('Frontend Engineer', { font: font, size: 16.5, height: 0.1, curveSegments: 5, bevelSegments: 5 })
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.y = 20;
                authorGroup.add(mesh);
            });
        });

        // 그룹 단위로 포지션 지정
        authorGroup.position.z = 275;

        menuGroup.position.x = -340;
        menuGroup.position.z = -190;

        app.scene.add(menuGroup, authorGroup);
    }
}