import * as PIXI from "pixi.js";

class Create2d {
    public app: PIXI.Application;
    public wrapDom: any;
    public rect: any;

    constructor(params: any) {
        var domId = params.domId !== undefined ? params.domId : "area2d";
        var bgColor = params.bgColor !== undefined ? params.bgColor:0x999999;
        this.wrapDom = document.getElementById(domId);
        this.getRect();
        this.initApp(bgColor);
    }

    private getRect() {
        this.rect = this.wrapDom.getBoundingClientRect();
    }

    private initApp(bgColor:number) {
        this.app = new PIXI.Application({
            width: this.rect.width,
            height: this.rect.height,
            antialias: true,
            transparent: true,
            resolution: 1
        });
        this.app.renderer.backgroundColor = bgColor;
        this.wrapDom.appendChild(this.app.view);
    }
}

export {Create2d};