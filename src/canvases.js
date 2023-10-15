import * as THREE from 'three';

// Monitor
const monitor_canvas = document.createElement('canvas');
monitor_canvas.width = 500;
monitor_canvas.height = 500;
export const monitorCanvas = monitor_canvas;
export const monitorContext = monitorCanvas.getContext('2d');
export const monitorTexture = new THREE.CanvasTexture(monitorCanvas);
