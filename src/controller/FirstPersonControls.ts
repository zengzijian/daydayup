import * as THREE from "three";
import {modelCamera} from "../model/modelCamera";
import {updateCamera} from "./updateCamera";
import {Vector3} from "../model/baseDataType";

class FirstPersonControls {
    public object: THREE.Camera;
    // public target: new Vector3();
    public domElement: any;
    public enabled: boolean;
    public lookSpeed: number;
    private mouse: THREE.Vector2;
    public lat:number;
    public lon:number;
    public phi:number;
    public theta:number;
    public mouseDragOn:boolean;

    constructor(camera: THREE.Camera, domElement: any) {

    }
    private onMouseDown(e:any) {

    }
    public addListener() {
        //todo 添加鼠标事件监听
        this.domElement.addEventListener("mousedown", );
    }
}

export {
    FirstPersonControls
};