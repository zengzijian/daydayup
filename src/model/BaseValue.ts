import {AsyncQueue} from "../core/AsyncQueue";

class BaseValue {
    constructor() {}
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
                    // let attrFn = (_self as any)[attr + "Fn"];
                    //
                    // if( attrFn && typeof attrFn === "function") {
                    //     AsyncQueue.push(attrFn.bind(_self, val));
                    // }
                    let updateFn = _self.updateData;
                    if(updateFn && typeof updateFn === "function") {
                        updateFn();
                    }
                },
                configurable: true,
                enumerable: true
            })
        });
    }
}

export {BaseValue};