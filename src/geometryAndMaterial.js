import * as THREE from 'three';
import {monitorTexture} from './canvases';

// Floor
export const floorGeometry = new THREE.PlaneGeometry(15, 15, 50);
export const floorMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    side: THREE.DoubleSide,
});

// Monitor
export const monitorGeometry = new THREE.PlaneGeometry(0.88, 0.437, 1);
export const monitorMaterial = new THREE.MeshStandardMaterial({
    // color: 'white',
    side: THREE.DoubleSide,
    map: monitorTexture,
});