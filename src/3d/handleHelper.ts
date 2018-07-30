import * as THREE from "three";

class BasicMaterial extends THREE.MeshBasicMaterial {
    constructor(params: any) {
        super(params);
        this.transparent = true;
        this.depthTest = false;
        this.depthWrite = false;
    }
}

class HandleHelper {
    private geoArrow = new THREE.CylinderGeometry(0, 0.04, 0.2, 12);
    private geoLine = new THREE.CylinderGeometry(0.01, 0.01, 1.4);
    private geoPlane = new THREE.PlaneGeometry(0.6, 0.6);
    private geoRing = new THREE.RingGeometry(0.7, 1, 30, 1, 0, Math.PI * 2);
    private geoOctahedron = new THREE.OctahedronGeometry(1);

    private opacity = 0.4;
    private matRed = new BasicMaterial({
        color: 0xff0000
    });
    private matGreen = new BasicMaterial({
        color: 0x00ff00
    });
    private matBlue = new BasicMaterial({
        color: 0x0000ff
    });
    private matRG = new BasicMaterial({
        color: 0xffff00,
        opacity: this.opacity
    });
    private matGB = new BasicMaterial({
        color: 0x00ffff,
        opacity: this.opacity
    });
    private matBR = new BasicMaterial({
        color: 0xff00ff,
        opacity: this.opacity
    });
    private matCenter = new BasicMaterial({
        color: 0xffffff,
        opacity: this.opacity
    })

    public object = new THREE.Group();
    public helperGroup = new THREE.Object3D();
    public wrapGroup = new THREE.Object3D();
    public axisX = new THREE.Object3D();
    public axisY = new THREE.Object3D();
    public axisZ = new THREE.Object3D();
    public planeXY = new THREE.Object3D();
    public planeYZ = new THREE.Object3D();
    public planeZX = new THREE.Object3D();
    public center = new THREE.Object3D();
    public ring = new THREE.Object3D();


    constructor() {

        this.object.add(this.helperGroup, this.wrapGroup);

        this.helperGroup.add(this.axisX, this.axisY, this.axisZ, this.planeXY, this.planeYZ, this.planeZX, this.center, this.ring);

        this.initAxisHelper();
        this.initPlaneHelper();
        this.initCenterHelper();
        this.initRingHelper();
    }

    private initRingHelper = () => {
        let ring = new THREE.Mesh(
            this.geoRing,
            new BasicMaterial({
                side: THREE.DoubleSide,
                color: 0x999999
            })
        );
        ring.rotation.set(-Math.PI/2, 0, 0);
        // ring.rotateAxis = "y";
        this.ring.add(ring);
    }
    private initAxisHelper = () => {
        let arrowX = new THREE.Mesh(
            this.geoArrow,
            this.matRed
        );
        arrowX.position.set(0, 1.4, 0);
        let lineX = new THREE.Mesh(
            this.geoLine,
            this.matRed
        );
        lineX.position.set(0, 0.7, 0);
        // arrowX.axis = "x";
        // lineX.axis = "x";
        this.axisX.add(arrowX, lineX);
        this.axisX.rotation.set(0, 0, -Math.PI / 2);

        let arrowY = new THREE.Mesh(
            this.geoArrow,
            this.matGreen
        );
        arrowY.position.set(0, 1.4, 0);
        let lineY = new THREE.Mesh(
            this.geoLine,
            this.matGreen
        );
        lineY.position.set(0, 0.7, 0);
        // arrowY.axis = "y";
        // lineY.axis = "y";
        this.axisY.add(arrowY, lineY);

        let arrowZ = new THREE.Mesh(
            this.geoArrow,
            this.matBlue
        );
        arrowZ.position.set(0, 1.4, 0);
        let lineZ = new THREE.Mesh(
            this.geoLine,
            this.matBlue
        );
        lineZ.position.set(0, 0.7, 0);
        // arrowZ.axis = "z";
        // lineZ.axis = "z";
        this.axisZ.add(arrowZ, lineZ);
        this.axisZ.rotation.set(Math.PI / 2, 0, 0);
    }
    private initPlaneHelper = () => {
        let planeXY = new THREE.Mesh(
            this.geoPlane,
            this.matRG
        );
        planeXY.position.set(0.3, 0.3, 0);
        // planeXY.plane = "xy";
        this.planeXY.add(planeXY);

        let planeYZ = new THREE.Mesh(
            this.geoPlane,
            this.matGB
        );
        planeYZ.position.set(0, 0.3, 0.3);
        planeYZ.rotation.set(0, Math.PI/2, 0);
        // planeYZ.plane = "yz";
        this.planeYZ.add(planeYZ);

        let planeZX = new THREE.Mesh(
            this.geoPlane,
            this.matBR
        );
        planeZX.position.set(0.3, 0, 0.3);
        planeZX.rotation.set(-Math.PI/2, 0, 0);
        // planeZX.plane = "zx";
        this.planeZX.add(planeZX);
    }
    private initCenterHelper = () => {
        let octahedron = new THREE.Mesh(
            this.geoOctahedron,
            this.matCenter
        );
        octahedron.scale.set(0.25, 0.25, 0.25);
        this.center.add(octahedron);
    }
}

export {HandleHelper};