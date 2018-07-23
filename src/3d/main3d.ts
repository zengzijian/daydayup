import {create3d} from "./create3d";
import * as THREE from "three";
import {BaseObject} from "../model/baseObject";
import {Vector3} from "../model/baseDataType";
import {updateCurrentObj} from "../controller/updateCurrentObj";
import {mainHtml} from "../view/mainHtml";
import {updateCamera} from "../controller/updateCamera";

let app3d: any;
let render:any;

function main3d() {
    app3d = new create3d("area3d");
    render = app3d.render;

    app3d.camera.position.set(0, 5, 20);
    app3d.camera.lookAt(app3d.scene.position);

    let mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
    );
    app3d.scene.add(mesh);

    app3d.currentObj = mesh;

    let girdHelper = new THREE.GridHelper(50, 50);
    app3d.scene.add(girdHelper);

    mainHtml();
    updateCurrentObj();
    updateCamera();

    app3d.render();
}

export {main3d, app3d};