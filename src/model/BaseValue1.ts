import {AsyncQueue} from "../core/AsyncQueue";
import {Observer} from "../utils/Observer";

class BaseData {
    public ob: Observer;
    constructor() {
        this.ob = new Observer();
    }
    protected _init = () => {
        let _self:any = this;
        let arr = Object.getOwnPropertyNames(this);

        arr.forEach((attr) => {
            let val = _self[attr];
            // 对非引用类型值的监听???
            if(typeof val !== "function") {
            // if(typeof val !== "function" && typeof val !== "object") {
                Object.defineProperty(_self, attr, {
                    get: function() {
                        return val;
                    },
                    set: function(newVal) {
                        val = newVal;

                        this.ob.dispatch(attr, val);

                        // let attrFn = (_self as any)[attr + "Fn"];
                        //
                        // if( attrFn && typeof attrFn === "function") {
                        //     AsyncQueue.push(attrFn.bind(_self, val));
                        // }
                    },
                    configurable: true,
                    enumerable: true
                })
            }

        });
    }
}

export {BaseData};