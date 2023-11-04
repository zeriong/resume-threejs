import * as THREE from 'three';
import Application from '../Application';

export class GuestBook {
    constructor() {
        this.app = Application.getInstance();
        this.start = 0;
        this.end = 5;
        this.guestReviews = [
            {createAt: '2023-03-12' ,title: '타이틀', content: '컨텐트!'},
            // {createAt: '2023-03-11' ,title: '타이틀', content: '컨텐트!'},
            // {createAt: '2023-03-10' ,title: '타이틀', content: '컨텐트!'},
            // {createAt: '2023-03-09' ,title: '타이틀', content: '컨텐트!'},
        ];
        this.guestReviewsLength = this.guestReviews.length;
        this.currentGuestReviews = [];
        this.reviewMeshList = [];
        this.reviewMeshs = [];

        this.setGuestReviews();
    }

    setGuestReviews() {
        // 내용 그려 줄 캔버스 생성
        this.canvas = document.createElement('canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvasTexture = new THREE.CanvasTexture(this.canvas);

        // guest review 매쉬 생성  / 매쉬 배경색 : '#FFFB6A'
        const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: this.canvasTexture });
        this.reviewMesh = new THREE.Mesh(geometry, material);
        this.reviewMesh.position.set(2,3,2);

        // 리뷰 Mesh를 모두 담은 배열 생성
        for (let i = 0; i < 6; i ++) {
            if (i === 0) this.reviewMeshList.push(this.reviewMesh);
            const clone = this.reviewMesh.clone();
            this.reviewMeshList.push(clone);

            const review = this.guestReviews[i];

            if (review) {
                this.currentGuestReviews.push(review);

                // canvas painting
                const createAt = this.guestReviews[i].createAt;
                const title = this.guestReviews[i].title;
                const content = this.guestReviews[i].content;
                this.canvasContext.fillStyle = '#FFFB6A';
                this.canvasContext.fillRect(0,0,500,500);
                // font painting
                this.canvasContext.fillStyle = '#000';
                this.canvasContext.font = 'bold 50px Pretendard';
                this.canvasContext.fillText(title, 100, 100);
                this.canvasContext.font = 'bold 30px Pretendard';
                this.canvasContext.fillText(createAt, 100, 200);
                this.canvasContext.font = 'bold 40px Pretendard';
                this.canvasContext.fillText(content, 100, 300);

                this.app.scene.add(this.reviewMeshList[i]);
            }
        }
        console.log('원래 속성', this.canvasContext)
    }

    nextReview() {
        console.log('넥스트리뷰 before', this.canvasContext)
        // 메모지 Mesh 배열 생성
        this.canvasContext.fillStyle = '#fff';
        this.canvasContext.fillRect(0, 0, 500, 500)
        this.canvasTexture.needsUpdate = true;
        console.log('넥스트리뷰 after', this.canvasContext)
    }
}