const THREE = require('three');
require('./setAll');
const BasicThree = require('./initThree');
// const demo = require('./demo1');
const Drag  = require('./drag');
// const HandleHelper = require('./handleHelper');
const houseGroup = require('./test_house');
const Handle3D = require('./handle3D');
// const testHandle3D = require('./test_handle3D');
require('./proxyObj');

function webglMain() {
    exp = new BasicThree();
    exp.init();

    // demo(exp.scene);

    exp.drag = new Drag(exp);

    // exp.camera.position.set(0, 10, 20);
    exp.camera.position.set(250, 80, 290);
    exp.controls.target.set(0, 50, 0);

    // let sl = new THREE.SpotLight(0xffffff);
    // sl.position.set(50, 50, 50);
    // exp.scene.add(sl);

    // let al = new THREE.AmbientLight(0xffffff, 0.4);
    // exp.scene.add(al);

    
    const test_handle3d = new Handle3D(exp.camera, exp.renderer.domElement);

    let testMesh = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0x888800
        })
    );
    testMesh.setAll({
        pos:[-30, 5, 0],
        sca:15,
        name:'testMesh',
    });
    testMesh.axis = "x";
    exp.scene.add(testMesh);
    exp.drag.add(testMesh);

    let testMesh1 = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0x008800
        })
    );
    // testMesh1.position.set(5, 1, 5);
    // testMesh1.name = "111";
    testMesh1.setAll({
        pos:[20, 1, 0],
        sca:20,
        name:'testMesh1',
        // mName: 'mesh'
    });
    exp.scene.add(testMesh1);
    exp.drag.add(testMesh1);

    //testMesh2
    let ball = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 12),
        new THREE.MeshPhongMaterial({
            color: 0xff0000
        })
    );
    let ballBase = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({
            color: 0xffff00
        })
    );
    ball.position.set(0, 2, 0);
    let testWrap = new THREE.Object3D();
    testWrap.add(ball, ballBase);
    testWrap.setAll({
        pos: [0, 10, -50],
        sca: 15,
        name: "testGroup"
    });
    exp.scene.add(testWrap);
    exp.drag.add(testWrap);

    

    let gridHelper = new THREE.GridHelper(20, 20);
    exp.scene.add(gridHelper);

    // var handleHelper = new HandleHelper(exp.scene, exp.camera);

    //添加测试的house
    exp.scene.add(houseGroup);

    function rotateMesh() {
        if(testMesh) {
            testMesh.rotation.x += 0.01;
            testMesh.rotation.z += 0.01;
        }
    }

    // function updateHandle() {
    //     handleHelper.update();
    // }

    // exp.loopFnArr.push(updateHandle);
}

module.exports = webglMain;