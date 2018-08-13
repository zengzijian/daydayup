import * as THREE from "three";
import {Create3d} from "./create3d";
import {updateCurrentObj} from "../controller/updateCurrentObj";
import {mainHtml} from "../view/mainHtml";
import {updateCamera} from "../controller/updateCamera";
import {FirstPersonControls} from "../controller/FirstPersonControls";
import {ModelCamera} from "../model/modelCamera";
import {OrbitControls} from "../controller/OrbitControls";
import {HandleHelper} from "./handleHelper";
import {HandleController} from "../controller/HandleController";
import {AsyncQueue} from "../core/AsyncQueue";

let app3d: any;
let render:Function;
let dataModel:any = {};

function main3d() {
    app3d = new Create3d({
        domId: "area3d",
        bgColor: 0x000000
    });
    render = app3d.render;
    app3d.camera.position.set(0, 5, 20);
    // app3d.camera.lookAt(app3d.scene.position);

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

    // let personControls = new FirstPersonControls(app3d.camera, app3d.renderer.domElement);

    let orbitControls = new OrbitControls(app3d.camera, app3d.renderer.domElement);
    AsyncQueue.push(function() {
        orbitControls.update();
    });

    /**
     * 添加测试shapeGeometry
     */
    // var smileyShape = new THREE.Shape();
    // smileyShape.moveTo( 80, 40 );
    // smileyShape.absarc( 40, 40, 40, 0, Math.PI * 2, false );
    // var smileyEye1Path = new THREE.Path();
    // smileyEye1Path.moveTo( 35, 20 );
    // smileyEye1Path.absellipse( 25, 20, 10, 10, 0, Math.PI * 2, true, 0);
    // smileyShape.holes.push( smileyEye1Path );
    // var smileyEye2Path = new THREE.Path();
    // smileyEye2Path.moveTo( 65, 20 );
    // smileyEye2Path.absarc( 55, 20, 10, 0, Math.PI * 2, true );
    // smileyShape.holes.push( smileyEye2Path );
    // var smileyMouthPath = new THREE.Path();
    // smileyMouthPath.moveTo( 20, 40 );
    // smileyMouthPath.quadraticCurveTo( 40, 60, 60, 40 );
    // smileyMouthPath.bezierCurveTo( 70, 45, 70, 50, 60, 60 );
    // smileyMouthPath.quadraticCurveTo( 40, 80, 20, 60 );
    // smileyMouthPath.quadraticCurveTo( 5, 50, 20, 40 );
    // smileyShape.holes.push( smileyMouthPath );
    //
    // var geometry = new THREE.ShapeGeometry( smileyShape );
    // var material = new THREE.MeshBasicMaterial( { color: 0x009900 } );
    // var shapeMesh = new THREE.Mesh( geometry, material ) ;
    // app3d.scene.add( shapeMesh );

    let handleHelper = new HandleHelper();
    app3d.scene.add(handleHelper.object);

    let girdHelper = new THREE.GridHelper(50, 50);
    app3d.scene.add(girdHelper);

    mainHtml();
    updateCurrentObj();
    updateCamera();


    let handleController = new HandleController(app3d.camera, [mesh], app3d.wrapDom);

}

export {main3d, app3d, dataModel};