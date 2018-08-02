import * as THREE from "three";
import {app3d} from "../3d/main3d";

class HandleController {
    public enabled = true;
    public domElement: any;
    public goodsArr: Array<any>;
    private camera: THREE.Camera;

    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2();
    // private

    constructor(camera: THREE.Camera, arr: Array<any>, domElement: any) {
        this.camera = camera;
        this.goodsArr = arr;
        this.domElement = domElement;

        this.addListener();
    }

    private onMouseDown = () => {

    }
    private onMouseMove = (e: any) => {
        if (this.enabled === false) return;

        e.preventDefault();

        var rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        var interactArr = this.raycaster.intersectObjects(this.goodsArr, true);
        if (interactArr.length > 0) {
            var selected = interactArr[0].object;
            app3d.addOutlineObject(selected);
        } else {
            app3d.clearOutline();
        }

    }
    private onMouseUp = () => {

    }
    public addListener = () => {
        this.domElement.addEventListener("mousedown", this.onMouseDown, false);
        this.domElement.addEventListener("mousemove", this.onMouseMove, false);
        this.domElement.addEventListener("mouseup", this.onMouseUp, false);
    }
    public removeListener = () => {
        this.domElement.removeEventListener("mousedown", this.onMouseDown, false);
        this.domElement.removeEventListener("mousemove", this.onMouseMove, false);
        this.domElement.removeEventListener("mouseup", this.onMouseUp, false);
    }
}

export {HandleController};