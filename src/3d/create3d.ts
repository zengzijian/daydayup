import * as THREE from "three";

class Create3d {
    public camera: THREE.Camera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public rect: any;
    public wrapDom: any;
    public controls: any;
    public loopFn: Array<Function>;

    constructor(params:any) {
        let domId = params.domId !== undefined ? params.domId : "area3d";
        let bgColor = params.bgColor !== undefined ? params.bgColor : 0xdddddd;
        let bgAlpha = params.bgAlpha !== undefined ? params.bgAlpha : 1;
        this.wrapDom = document.getElementById(domId);

        this.getRect();
        this.initCamera();
        this.initScene();
        this.initRenderer(bgColor, bgAlpha);
        // this.initControls();

        this.loopFn = [];

        this.loop();
    }

    private getRect = () => {
        this.rect = this.wrapDom.getBoundingClientRect();
    }

    private initCamera = () => {
        let width = this.rect.width;
        let height = this.rect.height;
        this.camera = new THREE.PerspectiveCamera(60, width/height,1, 1000);
        this.camera.position.set(0, 0, 10);
    }
    private initScene = () => {
        this.scene = new THREE.Scene();
    }
    private initRenderer = (color: number, alpha: number) => {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(color, alpha);
        this.renderer.setSize(this.rect.width, this.rect.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.wrapDom.appendChild(this.renderer.domElement);
    }
    // private initControls() {
    //     this.controls = new OrbitControls(this.camera, this.wrapDom);
    // }
    public render = () => {
        this.renderer.render(this.scene, this.camera);
    }
    private loop = () => {
        requestAnimationFrame(this.loop);

        if(this.loopFn.length > 0) {
            this.loopFn.forEach(function(fn) {
                fn();
            });
        }
    }
}

export {Create3d};