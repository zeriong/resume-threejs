import * as THREE from 'three';
import {lgPosterTexture, mdPosterTexture, monitorTexture, smPosterTexture} from './canvases';

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

// Lg Poster
export const lgPosterGeometry = new THREE.PlaneGeometry(0.995, 1.228, 1);
export const lgPosterMaterial = new THREE.MeshStandardMaterial({
    // color: 'white',
    side: THREE.DoubleSide,
    map: lgPosterTexture,
});

// Md Poster
export const mdPosterGeometry = new THREE.PlaneGeometry(0.88, 0.437, 1);
export const mdPosterMaterial = new THREE.MeshStandardMaterial({
    // color: 'white',
    side: THREE.DoubleSide,
    map: mdPosterTexture,
});

// Sm Poster
export const smPosterGeometry = new THREE.PlaneGeometry(0.88, 0.437, 1);
export const smPosterMaterial = new THREE.MeshStandardMaterial({
    // color: 'white',
    side: THREE.DoubleSide,
    map: smPosterTexture,
});