import * as THREE from "three";
import {app3d, dataModel} from "../3d/main3d";
import {ModelCamera} from "../model/modelCamera";


function updateCamera() {

    dataModel.camera.spherical.setAllFn = function(radius:number, phi:number, theta:number) {

        var tx = app3d.camera.position.x + radius * Math.cos(theta) * Math.sin(phi);
        var ty = app3d.camera.position.y + radius * Math.cos(phi);
        var tz = app3d.camera.position.z + radius * Math.sin(theta) * Math.sin(phi);

        var target = new THREE.Vector3(tx, ty, tz);
        app3d.camera.lookAt(target);
        app3d.render();

    }

    // let inputCameraPosX = document.getElementById("input_cameraPosX");
    // modelCamera.position.xFn = function(val) {
    //     app3d.camera.position.x = val;
    //     inputCameraPosX.setAttribute("value", String(val));
    //     app3d.render();
    // }
    // inputCameraPosX.oninput = function(e:any) {
    //     modelCamera.position.x = Number(e.target.value);
    // }
    //
    // let inputCameraPosY = document.getElementById("input_cameraPosY");
    // modelCamera.position.yFn = function(val) {
    //     app3d.camera.position.y = val;
    //     inputCameraPosY.setAttribute("value", String(val));
    //     app3d.render();
    // }
    // inputCameraPosY.oninput = function(e:any) {
    //     modelCamera.position.y = Number(e.target.value);
    // }
    //
    // let inputCameraPosZ = document.getElementById("input_cameraPosZ");
    // modelCamera.position.zFn = function(val) {
    //     app3d.camera.position.z = val;
    //     inputCameraPosZ.setAttribute("value", String(val));
    //     app3d.render();
    // }
    // inputCameraPosZ.oninput = function(e:any) {
    //     modelCamera.position.z = Number(e.target.value);
    // }
}

export {updateCamera};