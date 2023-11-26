import Application from '../Application';
import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry';

export default class Fonts {
    constructor() {
        this.init();
    }

    init() {
        const app = Application.getInstance()
        const raycaster = app.raycaster
        const loader = app.loader;

        const authorGroup = new THREE.Group();  // zeriong, engineer 판넬 그룹
        const menuGroup = new THREE.Group();  // 메뉴 판넬 그룹
        const totalGroup = new THREE.Group();  // 전체 그룹

        const fixPos = { y: 0.089, x: 0.55 } // position: (y = +), (z = -)

        const clickAreaGeometry = new THREE.PlaneGeometry(1.3, 0.3, 1, 1);
        const clickAreaMaterial = new THREE.MeshBasicMaterial({ opacity: 0, transparent: true });

        // load bold font
        loader.fontLoader.load('/assets/fontJson/Pretendard_Bold.json', (font) => {
            // bold mesh list
            [
                { text: 'ZERIONG', objName: 'name', y: 0.45 },
                { text: 'About Me', objName: 'aboutMe_menu', y: 3 },
                { text: 'Projects', objName: 'projects_menu', y: 2.5 },
                { text: 'Skills', objName: 'skills_menu', y: 2 },
                { text: 'Roadmap', objName: 'roadmap_menu', y: 1.5 },
                { text: 'Github', objName: 'github_menu', y: 1 },
                { text: 'Blog', objName: 'blog_menu', y: 0.5 },
            ]
                .forEach((val) => {
                    const position = new THREE.Vector3();
                    const geometry = new TextGeometry(val.text, {
                        font: font,
                        size: val.objName !== 'name' ? 0.18 : 0.32,
                        height: 0.001,
                        curveSegments: 5,
                        bevelSegments: 5,
                    });
                    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.y = val.y;
                    mesh.castShadow = true;

                    // 메뉴가 아닌 mesh는 그룹추가 후 foreach를 빠져나옴 (추가할 이벤트 따로 x)
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
                const geometry = new TextGeometry('Frontend Engineer', { font: font, size: 0.165, height: 0.001, curveSegments: 5, bevelSegments: 5 })
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.y = 0.2;
                mesh.castShadow = true;
                authorGroup.add(mesh);
            });
        });

        // 그룹 단위로 포지션 지정
        authorGroup.position.z = 2.75;

        menuGroup.position.x = -3.4;
        menuGroup.position.z = -1.9;

        totalGroup.add(menuGroup, authorGroup);
        totalGroup.position.x = 1;
        totalGroup.position.z = 2;

        app.scene.add(totalGroup);
    }
}