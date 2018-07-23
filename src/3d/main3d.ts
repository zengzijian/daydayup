import {Create3d} from "./create3d";
import * as THREE from "three";


function main3d() {
    var app3d = new Create3d({
        domId: "area3d"
    });

    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
    );
    mesh.scale.set(2, 2,2 );
    app3d.scene.add(mesh);

    var speed = 0.01;

    app3d.loopFn.push(function(){
        mesh.rotation.x += speed;
        mesh.rotation.y += speed;
        mesh.rotation.z += speed;
    });
}

export {main3d};