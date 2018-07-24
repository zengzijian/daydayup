import {Vector3} from "./baseDataType";
//
// class ModelCurrentObj {
//     private position: Vector3;
//     protected _enabled: boolean;
//     public get enabled() {
//         return this._enabled;
//     }
//     public set enabled(val:boolean) {
//         this._enabled = val;
//     }
//     constructor() {
//         this.position = new Vector3();
//     }
// }
//
// class SubObj extends ModelCurrentObj {
//     public get enabled() {
//         return this._enabled;
//     }
//     public set enabled(val:boolean) {
//         this._enabled
//     }
// }



let modelCurrentObj = {
    position: new Vector3(),
    // enabled: false
};

// modelCurrentObj.position.x = 10;
// modelCurrentObj.enabled = true;

export {
    modelCurrentObj
}