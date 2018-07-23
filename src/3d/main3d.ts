import {create3d} from "./create3d";
import * as THREE from "three";
import {BaseObject} from "../model/baseObject";
import {Vector3} from "../model/vector3";
import {updateModel} from "../controller/updateModel";
import {mainHtml} from "../view/mainHtml";

var currentObj:any;
var app3d: any;
var render:any;

function main3d() {
    app3d = new create3d("area3d");
    render = app3d.render;

    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
    );
    app3d.scene.add(mesh);
    app3d.render();

    currentObj = mesh;

    var obj1 = new BaseObject();
    console.log(obj1.position);
    console.log(obj1.position.x);
    console.log(obj1.position.z);
    obj1.position.x = 10;
    obj1.position.y = 20;
    obj1.position.z = 30;
    obj1.position.set(1, 2, 3);

    var v1 = new Vector3(4, 5, 6);
    console.log(v1);
    v1.x = 40;
    v1.z = 60;

    console.log(`this is v1: ${v1.x}`);

    mainHtml();
    updateModel();

}

export {main3d, currentObj, app3d};