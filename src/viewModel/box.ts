import {BaseValue} from "../model/BaseValue";
import {AsyncList} from "../core/AsyncQueue1";
import {Observer} from "../utils/Observer";
import {NewArray} from "../model/NewArray";
import {BaseData} from "../model/BaseValue1";
import * as THREE from "three";
import {render3d, scene} from "../3d/test3d";

// 所有视图物体都有on, off属性，类似on("mousemove")  off("click")，开启或者取消对于事件的监听

class ViewModel {
    public data:any;
    public updateModel:Array<Function>;
    public updateView:Array<Function>;
    constructor() {
    }
}

let DOMEvent = {
    ob: new Observer(),
    eventType: ["mousedown", "mousemove", "mouseup", "click"],
    listenEvent: function() {
        for(let i in this.eventType) {
            let type = this.eventType[i];
            document.body.addEventListener(type, (event:any) => {
                 this.ob.dispatchEvent(event);
            })
        }
    }
};
// DOMEvent.listenEvent();
// DOMEvent.ob.addListener("mousedown", (e:any)=> {
//     console.log(e);
//     console.log("触发了点击事件");
// });

class Vector3 extends BaseData {
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
    public set = (x: number, y: number, z: number) => {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Camera extends BaseData {
    public position:Vector3;
    public enabled:boolean;
    constructor() {
        super();

        this.position = new Vector3();
        this.enabled = true;

        this._init();
    }
}

 class TestBoxModel extends BaseData{
    public position:Vector3;
    public rotation:Vector3;
    public scale: Vector3;
    constructor() {
        super();

        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);

        this._init();
    }
}

class TestBoxVM extends ViewModel{
    public v3d:THREE.Mesh;
    constructor() {
        super();

        this.data = new TestBoxModel();

        this.v3d = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1,1 ),
            new THREE.MeshBasicMaterial({
                color: 0x333300
            })
        );
        scene.add(this.v3d);
        render3d();
        console.log(scene);

        this.data.position.ob.addListener("x", (val:any) => {
            this.v3d.position.x = val;
        });
        this.data.position.ob.addListener("y", function() {

        });
        this.data.position.ob.addListener("z", function() {

        });
    }
    public draw3d = () => {

    }
}

// class BoxData {
//     public position:Vector3;
//     constructor() {
//         this.position = new Vector3();
//
//         // this.position.ob.addListener("x", () => {
//         //     // console.log('position.x' + this.position.x);
//         //     // AsyncList.three.push(() => {
//         //     //     console.log('更新3d视图的position.x为' + this.position.x);
//         //     // });
//         //     //
//         //     // console.log(this.position.ob);
//         // });
//         //
//         // this.position.ob.addListener("enabled", () => {
//         //     // console.log('position.x' + this.position.x);
//         //     // AsyncList.three.push(() => {
//         //     //     console.log('更新3d视图的position.x为' + this.position.x);
//         //     // });
//         //     //
//         //     // console.log(this.position.ob);
//         //     console.log("修改了enabled属性");
//         // });
//         //
//         // setTimeout(()=> {
//         //     this.position.x = 10;
//         //     this.position.enabled = true;
//         // }, 2000);
//     }
// }
//
// class TestBox {
//     public data:BoxData;
//     constructor() {
//         this.data = new BoxData();
//
//         this.bindUpdateView();
//     }
//     public bindUpdateView = () => {
//         console.log("绑定更新视图的方法");
//     }
// }

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


export {
    Box,
    TestBoxModel,
    TestBoxVM,
    Camera,
    ViewModel,
    Vector3
};