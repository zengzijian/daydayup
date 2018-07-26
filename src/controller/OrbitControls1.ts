import * as THREE from "three";

export class OrbitControls1 {
    public camera: THREE.Camera;
    public target = new THREE.Vector3();
    public domElement: any;
    public enabled = true;
    public enableRotate = true;
    private STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2
    };
    private state: number = this.STATE.NONE;
    private rotateStart = new THREE.Vector2();
    private rotateEnd = new THREE.Vector2();
    private rotateDelta = new THREE.Vector2();
    public rotateSpeed: number = 1.0;

    private panOffset = new THREE.Vector3();

    private spherical = new THREE.Spherical();
    private sphericalDelta = new THREE.Spherical();

    public autoRotate = false;
    public autoRotateSpeed = 1.0;

    public minPolarAngle = 0;
    public maxPolarAngle = Math.PI;
    public minAzimuthAngle = - Infinity;
    public maxAzimuthAngle = Infinity;
    public minDistance = 0;
    public maxDistance = Infinity;

    public scale = 1.0;

    public enableDamping = false;
    public dampingFactor = 0.25;

    public update: Function;

    constructor(camera: THREE.Camera, domElement: any) {
        this.camera = camera;
        this.domElement = domElement;

        this.addListener();

        this.update = this.updateFn();
    }

    public updateFn = () => {
        var offset = new THREE.Vector3();

        var quat = new THREE.Quaternion().setFromUnitVectors( this.camera.up, new THREE.Vector3( 0, 1, 0 ) );
        var quatInverse = quat.clone().inverse();

        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();

        return function update() {

            var position = this.camera.position;

            offset.copy( position ).sub( this.target );

            offset.applyQuaternion( quat );

            this.spherical.setFromVector3( offset );

            if ( this.autoRotate && this.state === this.STATE.NONE ) {

                this.rotateLeft( this.getAutoRotationAngle() );

            }

            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;

            this.spherical.theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, this.spherical.theta ) );

            this.spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this.spherical.phi ) );

            this.spherical.makeSafe();

            this.spherical.radius *= this.scale;

            this.spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this.spherical.radius ) );

            this.target.add( this.panOffset );

            offset.setFromSpherical( this.spherical );

            offset.applyQuaternion( quatInverse );

            position.copy( this.target ).add( offset );

            this.camera.lookAt( this.target );

            if ( this.enableDamping === true ) {

                this.sphericalDelta.theta *= ( 1 - this.dampingFactor );
                this.sphericalDelta.phi *= ( 1 - this.dampingFactor );

                this.panOffset.multiplyScalar( 1 - this.dampingFactor );

            } else {

                this.sphericalDelta.set( 0, 0, 0 );

                this.panOffset.set( 0, 0, 0 );

            }

            this.scale = 1;

            // if ( this.zoomChanged ||
            //     lastPosition.distanceToSquared( this.camera.position ) > this.EPS ||
            //     8 * ( 1 - lastQuaternion.dot( this.camera.quaternion ) ) > this.EPS ) {
            //
            //     this.dispatchEvent( this.changeEvent );
            //
            //     lastPosition.copy( this.camera.position );
            //     lastQuaternion.copy( this.camera.quaternion );
            //     this.zoomChanged = false;
            //
            //     return true;
            //
            // }

            return false;

        };
    }
    private getAutoRotationAngle = () => {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    }
    private onMouseDown = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();
        e.stopPropagation();

        switch (e.button) {
            case 0: // left
                if (this.enableRotate === false) return;
                this.handleMouseDownRotate(e);
                this.state = this.STATE.ROTATE;
                break;
            case 1: // middle
                break;
            case 2: // right
                break;
        }

        document.addEventListener("mousemove", this.onMouseMove, false);
        document.addEventListener("mouseup", this.onMouseUp, false);
    }
    private onMouseMove = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();
        e.stopPropagation();

        switch (e.button) {
            case 0: // left
                if (this.enableRotate === false) return;
                this.handleMouseMoveRotate(e);
                break;
            case 1: // middle
                break;
            case 2: // right
                break;
        }
    }
    private onMouseUp = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();
        e.stopPropagation();

        document.removeEventListener("mousemove", this.onMouseMove, false);
        document.removeEventListener("mouseup", this.onMouseUp, false);

        this.state = this.STATE.NONE;
    }
    private handleMouseDownRotate = (e: any) => {
        this.rotateStart.set(e.clientX, e.clientY);
    }
    private handleMouseMoveRotate = (e: any) => {
        this.rotateEnd.set(e.clientX, e.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);
        var element = this.domElement === document ? this.domElement.body : this.domElement;
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth);
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientWidth);
        this.rotateStart.copy(this.rotateEnd);
        this.update();
    }
    private rotateLeft = (angle: number) => {
        this.sphericalDelta.theta -= angle;

    }
    private rotateUp = (angle:number) => {
        this.sphericalDelta.phi -= angle;
    }
    public addListener = () => {
        this.domElement.addEventListener("mousedown", this.onMouseDown, false);
    }
    public removeListener = () => {
        this.domElement.removeEventListener("mousedown", this.onMouseDown, false);
    }
}