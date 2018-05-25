require('./setAll');
const THREE = require("three");
const url_wall1 = require('./asset/model/wall/wall.jpg');
const url_floor1 = require('./asset/model/floor/floor4.jpg');
const url_floor2 = require('./asset/model/floor/floor2.jpg');

//常量及最外层变量
const PI = Math.PI;
const houseGroup = new THREE.Group();
const house = new THREE.Object3D();
const imgLoader = new THREE.TextureLoader();

houseGroup.add(house);

//初始化使用于该房屋场景的灯光
const dl = new THREE.DirectionalLight(0xffffff, 0.4);
dl.position.set(-200, 160, -200);
houseGroup.add(dl);

const pl = new THREE.PointLight(0xC4FDFD, 0.3);
pl.position.set(0, 90, 0);
houseGroup.add(pl);

const al = new THREE.AmbientLight(0xa2a2a2);
houseGroup.add(al);

//初始化平面几何体及材质
const geo_plane = new THREE.PlaneGeometry(1, 1);
const mat_basic = new THREE.MeshBasicMaterial({
    color: 0xcccccc
});
const mat_wall = new THREE.MeshStandardMaterial({
    color: 0xbbbbbb,
    metalness: 0,
    roughness: 1
});

const mat_floor = new THREE.MeshStandardMaterial({
    // color: 0xF9D0B3,
    metalness: 0,
    roughness: 0.8
});

const mat_ceil = new THREE.MeshStandardMaterial({
    // color: 0x9CAFFC,
    metalness: 0,
    roughness: 1
});

//初始化整个屋子的简单结构
const floor = new THREE.Mesh(geo_plane, mat_basic);
floor.setAll({
    rot: [-PI/2, 0, 0],
    sca: [300, 200, 1],
    name: 'floor'
});

const wall1 = new THREE.Mesh(geo_plane, mat_basic);
wall1.setAll({
    pos: [0, 60, -100],
    sca: [300, 120, 1],
    name: 'wall1'
});

const wall2 = new THREE.Mesh(geo_plane, mat_basic);
wall2.setAll({
    pos: [0, 60, 100],
    rot: [0, PI, 0],
    sca: [300, 120, 1],
    name: 'wall2'
});

const wall3 = new THREE.Mesh(geo_plane, mat_basic);
wall3.setAll({
    pos: [150, 60, 0],
    rot: [0, -PI/2, 0],
    sca: [200, 120, 1],
    name: 'wall3'
});

const wall4 = new THREE.Mesh(geo_plane, mat_basic);
wall4.setAll({
    pos: [-150, 60, 0],
    rot: [0, PI/2, 0],
    sca: [200, 120, 1],
    name: 'wall4'
});

const ceil = new THREE.Mesh(geo_plane, mat_basic);
ceil.setAll({
    pos: [0, 120, 0],
    rot: [PI/2, 0, 0],
    sca: [300, 200, 1],
    name: 'ceil'
});

//将墙面等结构添加到house容器中
house.add(floor, wall1, wall2, wall3, wall4, ceil);

//promise异步加载图片的方法
function loadImg(url, callback) {
    return new Promise( (resolve, rejected) => {
        imgLoader.load(url, resolve);
    }).then( (texture) => {
        callback(texture);
    });
}

//通过计算平面的长宽比，使贴图在平面中等比例重复
function calcRepeatNum(mesh, num) {
    let meshSize_x = mesh.scale.x;
    let meshSize_y = mesh.scale.y;
    const ratio = meshSize_x / meshSize_y;

    const mat = mesh.material;
    mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
    mat.map.repeat.set(ratio * num, num);
}

//测试为墙、地板、天花板添加纹理
loadImg(url_wall1, (texture) => {
    mat_wall.map = texture;

    wall1.material = mat_wall.clone();
    wall2.material = mat_wall.clone();
    wall3.material = mat_wall.clone();
    wall4.material = mat_wall.clone();

    calcRepeatNum(wall1, 5);
    calcRepeatNum(wall2, 5);
    calcRepeatNum(wall3, 5);
    calcRepeatNum(wall4, 5);
});

loadImg(url_floor1, (texture) => {
    mat_floor.map = texture;
    floor.material = mat_floor.clone();

    calcRepeatNum(floor, 2);
});

loadImg(url_floor2, (texture) => {
    mat_ceil.map = texture;
    ceil.material = mat_ceil.clone();

    calcRepeatNum(ceil, 6);
});

module.exports = houseGroup;
