import * as THREE from "three";
import {dataModel} from "../3d/main3d";

class FirstPersonControls {
    public camera: THREE.Camera;
    public domElement: any;
    public enabled: boolean;
    public movementSpeed: number;
    public lookSpeed: number;
    public phi: number;
    public theta: number;

    private mouseDragOn: boolean;
    private moveDirection: any;
    private mouse: THREE.Vector2;
    private rotateStart: THREE.Vector2;
    private rotateEnd: THREE.Vector2;
    private rotateDelta: THREE.Vector2;

    constructor(camera: THREE.Camera, domElement: any) {
        this.moveDirection = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.camera = camera;

        dataModel.camera.position.x = this.camera.position.x;
        dataModel.camera.position.y = this.camera.position.y;
        dataModel.camera.position.z = this.camera.position.z;

        // 俯仰角为90度
        this.phi = Math.PI / 2;
        // 方位角为-90度，即将相机初始指向z轴负半轴方向
        this.theta = -Math.PI / 2;
        this.lookSpeed = 0.1;
        this.movementSpeed = 1.0;

        this.domElement = (domElement !== undefined) ? domElement : document;
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();
        this.mouseDragOn = false;


        this.addListener();
    }

    private onMouseDown(e: any) {
        if (this.enabled === false) return;
        e.preventDefault();
        e.stopPropagation();

        this.mouseDragOn = true;

        this.rotateStart.set(e.clientX, e.clientY);

    }

    private onMouseMove(e: any) {
        if (this.enabled === false) return;
        e.preventDefault();
        e.stopPropagation();

        if (this.mouseDragOn) {
            this.rotateEnd.set(e.clientX, e.clientY);
            this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
            this.rotateStart.copy(this.rotateEnd);

            this.theta += THREE.Math.degToRad(this.rotateDelta.x * this.lookSpeed);
            this.phi += THREE.Math.degToRad(this.rotateDelta.y * this.lookSpeed);
            // 修改相机dataModel的属性
            dataModel.camera.spherical.setAll(1, this.phi, this.theta);

        }

    }

    private onMouseUp(e: any) {
        if (this.enabled === false) return;
        e.preventDefault();
        e.stopPropagation();

        this.mouseDragOn = false;
    }

    public addListener() {
        //todo 添加鼠标事件监听
        this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    }
}

export {
    FirstPersonControls
};