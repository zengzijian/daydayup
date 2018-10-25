import * as THREE from "three";

let renderer:THREE.WebGLRenderer;
let camera:THREE.Camera;
let scene:THREE.Scene;

function test3d() {
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setClearColor(0xdddddd);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(500, 500);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.set(0,0, 10);
    camera.lookAt(new THREE.Vector3());

    render3d();
}

function render3d() {
    renderer.render(scene, camera);
}

export {test3d, render3d, scene, camera, renderer};