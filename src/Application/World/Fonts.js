import Application from '../Application';
import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry';

export default class Fonts {
    constructor() {
        const app = Application.getInstance();
        this.intersectsMeshes = app.intersectsMeshes;
        this.loader = app.loader;
        this.scene = app.scene;
        this.nameGroup = new THREE.Group();  // zeriong, engineer 판넬 그룹
        this.menuGroup = new THREE.Group();  // 메뉴 판넬 그룹
        this.totalGroup = new THREE.Group();  // 전체 그룹

        this.fontsLoad();
    }

    fontsLoad() {
        const fixPos = { y: 0.089, x: 0.55 } // position: (y = +), (z = -)

        const clickAreaGeometry = new THREE.PlaneGeometry(1.3, 0.3, 1, 1);
        const clickAreaMaterial = new THREE.MeshStandardMaterial({ opacity: 0, transparent: true });

        // load bold font
        this.loader.fontLoader.load('/fontjson/Pretendard_Bold.json', (font) => {
            // bold mesh list
            [
                { name: 'name', y: 0.45, text: 'ZERIONG' },
                { name: 'aboutMe1', y: 3, text: 'About Me' },
                { name: 'projects', y: 2.5, text: 'Projects' },
                { name: 'learning', y: 2, text: 'Learning' },
                { name: 'skills', y: 1.5, text: 'Skills' },
                { name: 'github', y: 1, text: 'Github' },
                { name: 'blog', y: 0.5, text: 'Blog' },
            ]
                .forEach((val) => {
                    const position = new THREE.Vector3();
                    const geometry = new TextGeometry(val.text, {
                        font: font,
                        size: val.name !== 'name' ? 0.18 : 0.32,
                        height: 0.001,
                        curveSegments: 5,
                        bevelSegments: 5,
                    });
                    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.y = val.y;
                    mesh.castShadow = true;

                    // 메뉴가 아닌 mesh는 그룹추가 후 foreach를 빠져나옴 (추가할 이벤트 따로 x)
                    if (val.name === 'name') return this.nameGroup.add(mesh);

                    mesh.name = val.name;
                    mesh.getWorldPosition(position);

                    const clickAreaMesh = new THREE.Mesh(clickAreaGeometry, clickAreaMaterial);
                    clickAreaMesh.position.set(position.x + fixPos.x, position.y + fixPos.y, 0);
                    clickAreaMesh.name = val.name;

                    this.menuGroup.add(mesh, clickAreaMesh);
                    this.intersectsMeshes.push(mesh, clickAreaMesh);
                });

            // load regular font
            this.loader.fontLoader.load('/fontjson/Pretendard_Regular.json', (font) => {
                const geometry = new TextGeometry('Frontend Engineer', { font: font, size: 0.165, height: 0.001, curveSegments: 5, bevelSegments: 5 })
                const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.y = 0.2;
                mesh.castShadow = true;
                this.nameGroup.add(mesh);
            });
        });

        // 그룹 단위로 포지션 지정
        this.nameGroup.position.z = 2.75;

        this.menuGroup.position.x = -3.4;
        this.menuGroup.position.z = -1.9;

        this.totalGroup.add(this.menuGroup, this.nameGroup);
        this.totalGroup.position.x = 1;
        this.totalGroup.position.z = 2;

        this.scene.add(this.totalGroup);
    }
}