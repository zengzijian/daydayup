import {BaseValue} from "./BaseValue";

class Vector3 extends BaseValue {
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
    public xFn = (val:number) => {}
    public yFn = (val:number) => {}
    public zFn = (val:number) => {}
}



export {Vector3};