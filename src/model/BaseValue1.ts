import {AsyncQueue} from "../core/AsyncQueue";
import {Observer} from "../utils/Observer";

class BaseValue1 {
    public ob: Observer;
    constructor() {
        this.ob = new Observer();
    }
    protected _init = () => {
        let _self:any = this;
        let arr = Object.getOwnPropertyNames(this);

        arr.forEach((attr) => {
            let val = _self[attr];
            Object.defineProperty(_self, attr, {
                get: function() {
                    return val;
                },
                set: function(newVal) {
                    val = newVal;

                    console.log("调用了set");

                    this.ob.dispatch(attr);

                    // let attrFn = (_self as any)[attr + "Fn"];
                    //
                    // if( attrFn && typeof attrFn === "function") {
                    //     AsyncQueue.push(attrFn.bind(_self, val));
                    // }
                },
                configurable: true,
                enumerable: true
            })
        });
    }
}

export {BaseValue1};