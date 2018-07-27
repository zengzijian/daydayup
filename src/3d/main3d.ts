import * as THREE from "three";
import {Create3d} from "./create3d";
import {updateCurrentObj} from "../controller/updateCurrentObj";
import {mainHtml} from "../view/mainHtml";
import {updateCamera} from "../controller/updateCamera";
import {FirstPersonControls} from "../controller/FirstPersonControls";
import {ModelCamera} from "../model/modelCamera";
import {OrbitControls} from "../controller/OrbitControls";
import {OrbitControls1} from "../controller/OrbitControls1";

let app3d: any;
let render:Function;
let dataModel:any = {};

function main3d() {
    app3d = new Create3d("area3d");
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

    dataModel.camera = new ModelCamera();
    dataModel.camera.spherical.setFromVector3(app3d.scene.position);

    // var personControls = new FirstPersonControls(app3d.camera, app3d.renderer.domElement);

    // var orbitControls:any = new OrbitControls(app3d.camera, app3d.renderer.domElement);
    // app3d.loopFn.push(function() {
    //     orbitControls.update();
    //     app3d.render();
    // });

    let orbitControls = new OrbitControls1(app3d.camera, app3d.renderer.domElement);


    let axisHelper = new THREE.AxesHelper(100);
    app3d.scene.add(axisHelper);

    let girdHelper = new THREE.GridHelper(50, 50);
    girdHelper.position.set(0, -0.01, 0);
    app3d.scene.add(girdHelper);

    let quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
    console.log(quaternion);
    var vector = new THREE.Vector3(1, 0, 0);
    vector.applyQuaternion(quaternion);
    console.log(vector);

    mainHtml();
    updateCurrentObj();
    updateCamera();

    app3d.render();
}

export {main3d, app3d, dataModel};