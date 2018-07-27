import * as THREE from "three";
import {app3d} from "../3d/main3d";
import {dataModel} from "../3d/main3d";

// todo 让控制器改变dataModel.camera的数值！！！

export class OrbitControls1 {
    public camera: THREE.PerspectiveCamera;
    public target = new THREE.Vector3();
    public domElement: any;
    public enabled = true;
    public enableRotate = true;
    public enablePan = true;
    public enableZoom = true;
    public rotateSpeed: number = 1.0;
    public panSpeed: number = 1.0;
    public zoomSpeed: number = 1.0;
    public autoRotate = false;
    public autoRotateSpeed = 1.0;
    public minPolarAngle = 0;
    public maxPolarAngle = Math.PI;
    public minAzimuthAngle = -Infinity;
    public maxAzimuthAngle = Infinity;
    public minDistance = 0;
    public maxDistance = Infinity;
    public enableDamping = false;
    public dampingFactor = 0.25;
    public update: Function;
    public target0 = this.target.clone();
    public position0: THREE.Vector3;
    public zoom0: number;

    // 内部私有变量
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
    private panStart = new THREE.Vector2();
    private panEnd = new THREE.Vector2();
    private panDelta = new THREE.Vector2();
    private dollyStart = new THREE.Vector2();
    private dollyEnd = new THREE.Vector2();
    private dollyDelta = new THREE.Vector2();
    private panOffset = new THREE.Vector3();
    private spherical = new THREE.Spherical();
    private sphericalDelta = new THREE.Spherical();
    private scale = 1.0;

    constructor(camera: THREE.PerspectiveCamera, domElement: any) {
        this.camera = camera;
        this.domElement = domElement;
        this.update = this.updateFn();

        this.position0 = this.camera.position.clone();
        this.zoom0 = this.camera.zoom;

        this.addListener();
    }

    public getPolarAngle = () => {
        return this.spherical.phi;
    }
    public getAzimuthalAngle = () => {
        return this.spherical.theta;
    }
    public saveState = () => {
        this.target0.copy(this.target);
        this.position0.copy(this.camera.position);
        this.zoom0 = this.camera.zoom;
    }
    public reset = () => {
        this.target.copy(this.target0);
        this.camera.position.copy(this.position0);
        this.camera.zoom = this.zoom0;

        this.camera.updateProjectionMatrix();
        this.update();
        this.state = this.STATE.NONE;
    }
    public updateFn = () => {
        var offset = new THREE.Vector3();

        // todo 这个四元数，在camera.up.y = 1的情况下，这个quat表示不旋转，那到底有什么用？
        var quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
        var quatInverse = quat.clone().inverse();

        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();

        return function update() {
            var position = this.camera.position;

            offset.copy(position).sub(this.target);

            offset.applyQuaternion(quat);

            // 通过相机位置与目标位置的偏移量，算出偏移量在球坐标系中的参数
            this.spherical.setFromVector3(offset);

            // 如果开启了自动旋转相机的功能，则获取对应的旋转角度，将sphericalDelta.theta方位角进行修改
            if (this.autoRotate && this.state === this.STATE.NONE) {
                this.rotateLeft(this.getAutoRotationAngle());
            }

            // 用球坐标偏移量（1、mouseMove过程中产生；2、自动旋转产生），更新相机球坐标中的方位角和俯仰角
            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;

            // clamp算法，将方位角和俯仰角设置在指定范围间
            this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
            this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));

            // 将俯仰角控制不会等于0度或者180度
            this.spherical.makeSafe();

            // scale用于控制zoom过程中，球坐标系的radius参数的变化倍数，spherical.radius参数此处应该为offset偏移量的长度
            this.spherical.radius *= this.scale;

            // clamp算法，控制球坐标系的radius在最大和最小距离间
            this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));

            // 在相机平移过程中，让相机目标位置加上平移的偏移量
            // 思想是，把target作为球坐标系的中心点，相机作为球面上任意点，target位置发生变化，整个球坐标系也整体平移
            this.target.add(this.panOffset);

            // 根据调整好的球坐标系参数，重新更新相机位置和目标点的偏移量
            offset.setFromSpherical(this.spherical);

            // todo 怎么理解偏移量应用一个反向的旋转？
            offset.applyQuaternion(quatInverse);

            // 更新相机的位置
            position.copy(this.target).add(offset);

            this.camera.lookAt(this.target);

            // 如果允许相机操作过程中的惯性产生的阻尼效果，则让sphericalDelta不立即重置
            if (this.enableDamping === true) {
                this.sphericalDelta.theta *= (1 - this.dampingFactor);
                this.sphericalDelta.phi *= (1 - this.dampingFactor);
                this.panOffset.multiplyScalar(1 - this.dampingFactor);
            } else {
                this.sphericalDelta.set(0, 0, 0);
                this.panOffset.set(0, 0, 0);
            }

            // 重置scale属性？
            this.scale = 1;

            app3d.render();

            return false;

        };
    }
    public addListener = () => {
        this.domElement.addEventListener("contextmenu", this.onContextMenu, false);
        this.domElement.addEventListener("mousedown", this.onMouseDown, false);
        this.domElement.addEventListener("wheel", this.onMouseWheel, false);

        this.update();
    }
    public removeListener = () => {
        this.domElement.removeEventListener("contextmenu", this.onContextMenu, false);
        this.domElement.removeEventListener("mousedown", this.onMouseDown, false);
        this.domElement.removeEventListener("wheel", this.onMouseWheel, false);
    }

    private getAutoRotationAngle = () => {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    }
    private getZoomScale = () => {
        return Math.pow(0.95, this.zoomSpeed);
    }
    private onMouseDown = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();

        switch (e.button) {
            case 0: // left
                if (this.enableRotate === false) return;
                this.handleMouseDownRotate(e);
                this.state = this.STATE.ROTATE;
                break;
            case 1: // middle
                if (this.enableZoom === false) return;
                this.handleMouseDownDolly(e);
                this.state = this.STATE.DOLLY;
                break;
            case 2: // right
                if (this.enablePan === false) return;
                this.handleMouseDownPan(e);
                this.state = this.STATE.PAN;
                break;
        }

        if (this.state !== this.STATE.NONE) {
            document.addEventListener("mousemove", this.onMouseMove, false);
            document.addEventListener("mouseup", this.onMouseUp, false);
        }
    }
    private onMouseMove = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();

        switch (this.state) {
            case this.STATE.ROTATE: // left
                if (this.enableRotate === false) return;
                this.handleMouseMoveRotate(e);
                break;
            case this.STATE.DOLLY: // middle
                if (this.enableZoom === false) return;
                this.handleMouseMoveDolly(e);
                break;
            case this.STATE.PAN: // right
                if (this.enablePan === false) return;
                this.handleMouseMovePan(e);
                break;
        }
    }
    private onMouseUp = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();

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

        // 设置方位角
        // todo 为什么要除以当前窗口的宽高，用比例来计算和用实际像素产生的偏移量来计算的区别？
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth);
        // 设置俯仰角
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientWidth);
        this.rotateStart.copy(this.rotateEnd);
        this.update();

    }
    private handleMouseDownPan = (e: any) => {
        this.panStart.set(e.clientX, e.clientY);
    }
    private handleMouseMovePan = (e: any) => {
        this.panEnd.set(e.clientX, e.clientY);
        this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed);
        this.pan()(this.panDelta.x, this.panDelta.y);
        this.panStart.copy(this.panEnd);
        this.update();
    }
    private handleMouseDownDolly = (e: any) => {
        this.dollyStart.set(e.clientX, e.clientY);
    }
    private handleMouseMoveDolly = (e: any) => {
        this.dollyEnd.set(e.clientX, e.clientY);
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
        if (this.dollyDelta.y > 0) {
            this.dollyIn(this.getZoomScale());
        } else if (this.dollyDelta.y < 0) {
            this.dollyOut(this.getZoomScale());
        }
        this.dollyStart.copy(this.dollyEnd);
        this.update();
    }
    private handleMouseWheel = (e: any) => {
        if (e.deltaY < 0) {
            this.dollyOut(this.getZoomScale());
        } else if (e.deltaY > 0) {
            this.dollyIn(this.getZoomScale());
        }

        this.update();
    }
    private onMouseWheel = (e: any) => {
        if (this.enabled === false || this.enableZoom === false || (this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE)) return;

        e.preventDefault();
        e.stopPropagation();

        this.handleMouseWheel(e);
    }
    private rotateLeft = (angle: number) => {
        this.sphericalDelta.theta -= angle;
    }
    private rotateUp = (angle: number) => {
        this.sphericalDelta.phi -= angle;
    }
    private pan = () => {
        var offset = new THREE.Vector3();

        return (deltaX: number, deltaY: number) => {
            var element = this.domElement === document ? this.domElement.body : this.domElement;

            // todo 目前只考虑perspectiveCamera的情况，暂不考虑正交相机情况，若需要让orbit控制器兼容正交相机，还需要整理哦！
            var position = this.camera.position;
            offset.copy(position).sub(this.target);
            var targetDistance = offset.length();

            // todo 根据相机的fov重新计算目标距离怎么理解？
            targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180);

            // todo 注意在平移过程中，还要传入相机当前的矩阵！
            this.panLeft()(2 * deltaX * targetDistance / element.clientWidth, this.camera.matrix);
            this.panUp()(2 * deltaY * targetDistance / element.clientHeight, this.camera.matrix);

        }
    }
    private panLeft = () => {
        var v = new THREE.Vector3();

        return (distance: number, cameraMatrix: THREE.Matrix4) => {

            // 获取相机矩阵的x列
            v.setFromMatrixColumn(cameraMatrix, 0);
            v.multiplyScalar(-distance);
            this.panOffset.add(v);
        }
    }
    private panUp = () => {
        var v = new THREE.Vector3();

        return (distance: number, cameraMatrix: THREE.Matrix4) => {

            // 获取相机矩阵的y列
            v.setFromMatrixColumn(cameraMatrix, 1);
            v.multiplyScalar(distance);
            this.panOffset.add(v);
        }
    }
    private dollyOut = (dollyScale: number) => {
        this.scale /= dollyScale;
    }
    private dollyIn = (dollyScale: number) => {
        this.scale *= dollyScale;
    }
    private onContextMenu = (e: any) => {
        if (this.enabled === false) return;
        e.preventDefault();
    }
}