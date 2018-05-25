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
const geoRing = new THREE.RingGeometry(0.6, 1, 16);

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
        this.planeZX = new THREE.Object3D();
        this.planeYZ = new THREE.Object3D();
        this.center = new THREE.Object3D();
        this.ring = new THREE.Object3D();

        this.initAxisHelper();
        this.initPlaneHelper();
        this.initCenterHelper();
        this.initRingHelper();
        
        this.helper.add(this.axisX, this.axisY, this.axisZ, this.planeXY, this.planeZX, this.planeYZ, this.center, this.ring);
        this.wrap.add(this.helper);
        
        this.setAttr();

        _scene.add(this.wrap);

        _scene.updateMatrixWorld();

    }
    setAttr() {
        this.wrap.setAll({
            name:"wrap"
        });
        this.helper.name = "helper";
    }
    initRingHelper() {
        let ring = new THREE.Mesh(
            new THREE.RingGeometry(0.7, 1, 30, 1, 0, PI * 2),
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                vertexColors: THREE.FaceColors
            })
        );
        for(let i = 0; i < ring.geometry.faces.length; i++) {
            var color = Math.random() * 0xffffff;
            ring.geometry.faces[i].color.set(color);
        }
        ring.rotation.set(-PI/2, 0, 0);
        ring.rotateAxis = "y";
        this.ring.add(ring);
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
        arrowX.axis = "x";
        lineX.axis = "x";
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
        arrowY.axis = "y";
        lineY.axis = "y";
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
        arrowZ.axis = "z";
        lineZ.axis = "z";
        this.axisZ.add(arrowZ, lineZ);
        this.axisZ.rotation.set(PI/2, 0, 0);
    }
    initPlaneHelper() {
        let planeXY = new THREE.Mesh(
            geoPlane,
            matRG
        );
        planeXY.position.set(0.3, 0.3, 0);
        planeXY.plane = "xy";
        this.planeXY.add(planeXY);

        let planeYZ = new THREE.Mesh(
            geoPlane,
            matGB
        );
        planeYZ.position.set(0, 0.3, 0.3);
        planeYZ.rotation.set(0, PI/2, 0);
        planeYZ.plane = "yz";
        this.planeYZ.add(planeYZ);

        let planeZX = new THREE.Mesh(
            geoPlane,
            matRB
        );
        planeZX.position.set(0.3, 0, 0.3);
        planeZX.rotation.set(-PI/2, 0, 0);
        planeZX.plane = "zx";
        this.planeZX.add(planeZX);
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
