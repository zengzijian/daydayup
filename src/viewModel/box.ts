import {BaseValue} from "../model/BaseValue";
import {AsyncList} from "../core/AsyncQueue1";
import {Observer} from "../utils/Observer";
import {NewArray} from "../model/NewArray";
import {BaseData} from "../model/BaseValue1";

class ViewModel {
    public data:any;
    public updateModel:Array<Function>;
    public updateView:Array<Function>;
    constructor() {
    }
    public bindModel(child:BaseData) {
        this.data = child;
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
    public enabled:boolean = false;
    constructor(x = 0, y = 0, z = 0) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;

        this._init();
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

class Container {
    public arr:NewArray;
    constructor() {
        this.arr = new NewArray();
    }
    public add(child:any) {
        this.arr.push(child);
    }
    public remove(child:any) {
        let index = this.arr.indexOf(child);
        if(index > -1) {
            this.arr.splice(index, 1);
        }
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

class TestBoxViewModel extends ViewModel{
    constructor() {
        super();

        this.data = new TestBoxModel();
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
    TestBoxViewModel,
    Camera,
    ViewModel
};