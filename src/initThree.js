/**
 * 考虑：
 * 1.是否作为一个基类；
 * 2.属性和方法，是否需要设置为私有或者静态；
 * 3.每个方法是否可以再优化，提供足够的接口；
 * 4.是否只需要一个实例，是否考虑单例模式；
 */
const THREE = require('three');
const OrbitControls = require('./OrbitControls');

class BasicThree {

    constructor() {
        this.camera;
        this.renderer;
        this.scene;
        this.appDom;
        this.rect;
        this.loopFnArr = [];
        this.controls;
    }
    init({id = 'webglArea', bg = 0x111111} = {}) {

        this.appDom = document.getElementById(id);

        this.getRect(this.appDom);

        this.initRenderer(bg);

        this.initCamera();

        this.initScene();

        this.initControls();

        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        const loop = () => {
            requestAnimationFrame(loop);

            if(this.loopFnArr.length > 0) {
                let l = this.loopFnArr.length;
                for(let i = 0; i < l; i++ ) {
                    this.loopFnArr[i]();
                }
            } 

            this.controls.update();
            this.render();
        };

        loop();
    }
    onWindowResize() {
        this.getRect(this.appDom);
        this.camera.aspect = this.rect.width / this.rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.rect.width, this.rect.height);
    }
    getRect(dom) {
        this.rect = dom.getBoundingClientRect();
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.rect.width / this.rect.height, 1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(new THREE.Vector3());
    }
    initRenderer(bg) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(this.rect.width, this.rect.height);
        this.renderer.setClearColor(bg); 
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.appDom.appendChild(this.renderer.domElement);
    }
    initScene() {
        this.scene = new THREE.Scene();
    }
    initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

module.exports = BasicThree;