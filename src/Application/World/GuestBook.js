import * as THREE from 'three';
import Application from '../Application';
import firebase from 'firebase/compat';

export class GuestBook {
    constructor() {
        this.app = Application.getInstance();
        this.start = 0;
        this.end = 5;
        this.guestBooks = [{createAt: '2023-03-12' ,title: '타이또르', content: '칸뗀트!'}];
        this.currentGuestReviews = [];
        this.reviewMeshList = [];
        this.reviewMeshs = [];
        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
        this.material = new THREE.MeshStandardMaterial({ color: new THREE.Color('#FFFB6A') });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(2, 4, 2);

        this.setGuestReviews();
        this.paintReview();
        this.nextReview();
    }

    setGuestReviews() {
        // 리뷰 Mesh를 모두 담은 배열 생성
        for (let i = 0; i < 6; i ++) {
            if (i === 0) this.reviewMeshList.push(this.mesh);
            const clone = this.mesh.clone();
            this.reviewMeshList.push(clone);

            const review = this.guestBooks[i];

            if (review) {
                this.currentGuestReviews.push(review);
                this.app.scene.add(this.reviewMeshList[i]);
            }
        }
    }

    nextReview() {
        // 메모지 Mesh 배열 생성
        for (let i = 0; i < 6; i ++) {
            const currentMesh = this.currentGuestReviews[i];
            const reviewMesh = this.reviewMeshs.find(item => item.name === i);

            if (!currentMesh) {

                this.app.scene.remove(reviewMesh);
                continue;
            }


        }

        this.app.scene.add(this.mesh);
    }

    paintReview() {

    }
}