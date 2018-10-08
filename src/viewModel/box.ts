import {BaseValue} from "../model/BaseValue";
import {AsyncList} from "../core/AsyncQueue1";
import {Observer} from "../utils/Observer";

import {BaseValue1} from "../model/BaseValue1";

class Vector3 extends BaseValue1 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x = 0, y = 0, z = 0) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;

        this._init();
    }
}
class BoxData {
    public position:Vector3;
    constructor() {
        this.position = new Vector3();

        // this.position.ob.addListener("x", () => {
        //     // console.log('position.x' + this.position.x);
        //     AsyncList.three.push(() => {
        //         console.log('更新3d视图的position.x为' + this.position.x);
        //     });
        //
        //     console.log(this.position.ob);
        // });
        //
        // setTimeout(()=> {
        //     console.log("position的属性被改变");
        //     this.position.x = 10;
        // }, 2000);
    }
}

class TestBox {
    public data:BoxData;
    constructor() {
        this.data = new BoxData();

        this.bindUpdateView();
    }
    public bindUpdateView = () => {
        console.log("绑定更新视图的方法");
    }
}

class Data extends BaseValue {
    public posX: number;
    public posY: number;
    public posZ: number;
    constructor(posX = 0, posY = 0, posZ = 0) {
        super();

        this.posX = posX;
        this.posY = posY;
        this.posZ = posZ;

        this._init();
    }
    public updateData = () => {};
}


class Box {
    public data:any;
    public view: any;
    public updateView:any;

    constructor() {
        let div = document.createElement("div");
        div.id = "box";
        div.style.width = "100px";
        div.style.height = "100px";
        div.style.backgroundColor = "#aaaaaa";
        div.style.position = "absolute";
        document.body.appendChild(div);

        this.data = new Data();
        this.view = {
            three: null,
            two: null,
            dom: div
        };
        this.updateView = {
            two: function() {},
            three: function() {},
            dom: function() {}
        };

        this.data.updateData = () => {
            for(let i in this.updateView) {
                this.updateView[i]();
            }
        }

        this.updateView.dom = () => {
            let dom = this.view.dom;
            dom.style.left = this.data.posX + "px";
            dom.style.top = this.data.posY + "px";
        }

        setTimeout(() => {
            console.log("定时任务执行");
            this.data.posX = 10;
            // this.data.posY = 20;
        }, 2000);
    }
}


export {Box, TestBox};