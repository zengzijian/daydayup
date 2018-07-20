import {create3d} from "./create3d";
import * as THREE from "three";

function main3d() {
    var app3d = new create3d("area3d");

    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
    );
    app3d.scene.add(mesh);
}

export {main3d};