import * as THREE from 'three';

// TODO: 캔버스 뒤집어진 것 똑바로 돌리기

// Monitor
export const monitorCanvas = document.createElement('canvas');
export const monitorCtx = monitorCanvas.getContext('2d');
monitorCanvas.width = 500;
monitorCanvas.height = 500;
export const monitorTexture = new THREE.CanvasTexture(monitorCanvas);
export const drawMonitor = () => {
    monitorCtx.fillStyle = 'red';
    monitorCtx.fillRect(0,0,500,500);
    monitorCtx.fillStyle = 'black';
    monitorCtx.font = 'bold 50px sans-serif';
    monitorCtx.fillText('스크린입니다', 50, 300);
}


// Lg Poster
export const lgPosterCanvas = document.createElement('canvas');
export const lgPosterCtx = lgPosterCanvas.getContext('2d');
lgPosterCanvas.width = 100;
lgPosterCanvas.height = 100;
export const lgPosterTexture = new THREE.CanvasTexture(lgPosterCanvas);
export const drawLgPoster = () => {
    lgPosterCtx.fillStyle = 'blue';
    lgPosterCtx.fillRect(0,0,500,500);
    lgPosterCtx.fillStyle = 'white';
    lgPosterCtx.font = 'bold 10px sans-serif';
    lgPosterCtx.fillText('lg 포스터입니다', 10, 50);
}


// Md Poster
export const mdPosterCanvas = document.createElement('canvas');
export const mdPosterCtx = mdPosterCanvas.getContext('2d');
mdPosterCanvas.width = 500;
mdPosterCanvas.height = 500;
export const mdPosterTexture = new THREE.CanvasTexture(mdPosterCanvas);
export const drawMdPoster = () => {
    mdPosterCtx.fillStyle = 'green';
    mdPosterCtx.fillRect(0,0,500,500);
    mdPosterCtx.fillStyle = 'white';
    mdPosterCtx.font = 'bold 40px sans-serif';
    mdPosterCtx.fillText('md 포스터입니다', 100, 200);
}


// Sm Poster
export const smPosterCanvas = document.createElement('canvas');
export const smPosterCtx = smPosterCanvas.getContext('2d');
smPosterCanvas.width = 500;
smPosterCanvas.height = 500;
export const smPosterTexture = new THREE.CanvasTexture(smPosterCanvas);
export const drawSmPoster = () => {
    smPosterCtx.fillStyle = 'yellow';
    smPosterCtx.fillRect(0,0,500,500);
    smPosterCtx.fillStyle = 'black';
    smPosterCtx.font = 'bold 40px sans-serif';
    smPosterCtx.fillText('sm 포스터입니다', 100, 200);
}