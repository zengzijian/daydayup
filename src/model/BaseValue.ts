import {AsyncQueue} from "../core/AsyncQueue";

class BaseValue {
    constructor() {}
    protected _init = () => {
        let _self = this;
        let arr = Object.getOwnPropertyNames(this);

        arr.forEach((attr) => {
           let val = (_self as any)[attr];
           Object.defineProperty(_self, attr, {
               get: function() {
                   return val;
               },
               set: function(newVal) {
                   val = newVal;

                   let attrFn = (_self as any)[attr + "Fn"];

                   if( attrFn && typeof attrFn === "function") {
                       AsyncQueue.push(attrFn.bind(_self, val));
                   }
               },
               configurable: true,
               enumerable: true
           })
        });
    }
}

export {BaseValue};