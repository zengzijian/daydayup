require('./setAll');
const THREE = require('three');

const PI = Math.PI;

//private
var _size = 0.15,
    _originSca,
    _cameraDistance,
    _scene,
    _camera;

//geometry
const geoArrow = new THREE.CylinderGeometry(0, 0.04, 0.2, 12);
const geoLine = new THREE.CylinderGeometry(0.01, 0.01, 1.4);
const geoPlane = new THREE.PlaneGeometry(0.6, 0.6);

//material
const matRed = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    depthTest: false,
    depthWrite: false,
    transparent: true
});
const matGreen = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    depthTest: false,
    depthWrite: false,
    transparent: true
});
const matBlue = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    depthTest: false,
    depthWrite: false,
    transparent: true
});
const matRG = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0.4,
});
const matRB = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0.4,
});
const matGB = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0.4,
});
const matWhite = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0.4,
});

//定义操作模型的class
class HandleHelper {
    constructor(scene, camera){
        _scene = scene;
        _camera = camera;

        this.wrap = new THREE.Group();
        this.helper = new THREE.Object3D();
        this.axisX = new THREE.Object3D();
        this.axisY = new THREE.Object3D();
        this.axisZ = new THREE.Object3D();
        this.planeXY = new THREE.Object3D();
        this.planeXZ = new THREE.Object3D();
        this.planeYZ = new THREE.Object3D();
        this.center = new THREE.Object3D();

        this.initAxisHelper();
        this.initPlaneHelper();
        this.initCenterHelper();

        this.setAttr();

        this.helper.add(this.axisX, this.axisY, this.axisZ, this.planeXY, this.planeXZ, this.planeYZ, this.center);
        this.wrap.add(this.helper);

        _scene.add(this.wrap);

        _scene.updateMatrixWorld();

    }
    setAttr() {
        this.wrap.setAll({
            name:"handleHelper"
        });
    }
    initAxisHelper() {
        
        let arrowX = new THREE.Mesh(
            geoArrow,
            matRed
        );
        arrowX.position.set(0, 1.4, 0);
        let lineX = new THREE.Mesh(
            geoLine,
            matRed
        );
        lineX.position.set(0, 0.7, 0);
        this.axisX.add(arrowX, lineX);
        this.axisX.rotation.set(0, 0, -PI/2);

        let arrowY = new THREE.Mesh(
            geoArrow,
            matGreen
        );
        arrowY.position.set(0, 1.4, 0);
        let lineY = new THREE.Mesh(
            geoLine,
            matGreen
        );
        lineY.position.set(0, 0.7, 0);
        this.axisY.add(arrowY, lineY);

        let arrowZ = new THREE.Mesh(
            geoArrow,
            matBlue
        );
        arrowZ.position.set(0, 1.4, 0);
        let lineZ = new THREE.Mesh(
            geoLine,
            matBlue
        );
        lineZ.position.set(0, 0.7, 0);
        this.axisZ.add(arrowZ, lineZ);
        this.axisZ.rotation.set(PI/2, 0, 0);

        

    }
    initPlaneHelper() {
        let planeXY = new THREE.Mesh(
            geoPlane,
            matRG
        );
        planeXY.position.set(0.3, 0.3, 0);
        this.planeXY.add(planeXY);

        let planeXZ = new THREE.Mesh(
            geoPlane,
            matRB
        );
        planeXZ.position.set(0.3, 0, 0.3);
        planeXZ.rotation.set(-PI/2, 0, 0);
        this.planeXZ.add(planeXZ);

        let planeYZ = new THREE.Mesh(
            geoPlane,
            matGB
        );
        planeYZ.position.set(0, 0.3, 0.3);
        planeYZ.rotation.set(0, PI/2, 0);
        this.planeYZ.add(planeYZ);
    }
    initCenterHelper(){
        let octahedron = new THREE.Mesh(
            new THREE.OctahedronGeometry(1),
            matWhite
        );
        octahedron.scale.set(0.25, 0.25, 0.25);
        this.center.add(octahedron);
    }
    update() {
        if(this.wrap) {
            _cameraDistance = _camera.position.clone().sub(this.wrap.getWorldPosition()).length();
            _originSca = _cameraDistance * _size;
            this.wrap.scale.set(_originSca, _originSca, _originSca);
        }
    }
}

module.exports = HandleHelper;
