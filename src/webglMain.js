const THREE = require('three');
require('./setAll');
const BasicThree = require('./initThree');
// const demo = require('./demo1');
const Drag  = require('./drag');
const HandleHelper = require('./handleHelper');

function webglMain() {
    exp = new BasicThree();
    exp.init();

    // demo(exp.scene);

    exp.drag = new Drag(exp);

    exp.camera.position.set(0, 10, 20);

    let sl = new THREE.SpotLight(0xffffff);
    sl.position.set(50, 50, 50);
    exp.scene.add(sl);

    let al = new THREE.AmbientLight(0xffffff, 0.4);
    exp.scene.add(al);

    let testMesh = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshPhongMaterial({
            color: 0x888800
        })
    );
    testMesh.position.set(-5, 0, 0);
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
        pos:[5, 1, 0],
        name:'testMesh1',
        // mName: 'mesh'
    });
    exp.scene.add(testMesh1);
    exp.drag.add(testMesh1);

    let gridHelper = new THREE.GridHelper(20, 20);
    exp.scene.add(gridHelper);

    var handleHelper = new HandleHelper(exp.scene, exp.camera);

    function rotateMesh() {
        if(testMesh) {
            testMesh.rotation.x += 0.01;
            testMesh.rotation.z += 0.01;
        }
    }

    function updateHandle() {
        handleHelper.update();
    }

    // exp.loopFnArr.push(updateHandle);
}

module.exports = webglMain;