import * as THREE from "three";
import {OrbitControls} from "./OrbitControls";

class create3d {
    public camera: THREE.Camera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public rect: any;
    public wrapDom: any;
    public controls: any;
    public loopFn: Array<Function>;

    constructor(params:any) {
        var domId = params.domId !== undefined ? params.domId : "area3d";
        var bgColor = params.bgColor !== undefined ? params.bgColor : 0xdddddd;
        var bgAlpha = params.bgAlpha !== undefined ? params.bgAlpha : 1;
        this.wrapDom = document.getElementById(domId);

        this.getRect();
        this.createCamera();
        this.createScene();
        this.createRenderer(bgColor, bgAlpha);
        this.createControls();

        this.loopFn = [];

        this.loop();
    }

    private getRect() {
        this.rect = this.wrapDom.getBoundingClientRect();
    }

    private createCamera() {
        var width = this.rect.width;
        var height = this.rect.height;
        this.camera = new THREE.PerspectiveCamera(60, width/height,1, 1000);
        this.camera.position.set(0, 0, 10);
    }
    private createScene() {
        this.scene = new THREE.Scene();
    }
    private createRenderer(color: number, alpha: number){
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(color, alpha);
        this.renderer.setSize(this.rect.width, this.rect.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.wrapDom.appendChild(this.renderer.domElement);
    }
    private createControls() {
        this.controls = new OrbitControls(this.camera, this.wrapDom);
    }
    public render() {
        this.renderer.render(this.scene, this.camera);
    }
    private loop() {
        var loop = this.loop.bind(this, arguments);
        requestAnimationFrame(loop);

        if(this.loopFn.length > 0) {
            this.loopFn.forEach(function(fn) {
                fn();
            });
        }
    }
}

export {create3d};