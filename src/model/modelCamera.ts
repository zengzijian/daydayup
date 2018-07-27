import {Vector3,Spherical} from "./baseDataType";

class ModelCamera {
    public position: Vector3;
    public target: Vector3;
    public spherical: Spherical;
    // protected _longitude: number;
    // public get longitude() {
    //     return this._longitude;
    // }
    //
    // public set longitude(val: number) {
    //     this._longitude = val;
    //     this.longitudeFnArr.forEach((fn) => {
    //         fn(this._longitude);
    //     });
    // }
    //
    // // todo 先用一个方法数组在set方法中遍历执行，之后考虑将该数组作为非公有属性，只能通过方法访问
    // public longitudeFnArr: Array<Function>;
    // protected _latitude: number;
    // public get latitude() {
    //     return this._latitude;
    // }
    //
    // public set latitude(val: number) {
    //     this._latitude = val;
    //     this.latitudeFnArr.forEach((fn) => {
    //         fn(this._longitude);
    //     });
    // }
    //
    // // todo 先用一个方法数组在set方法中遍历执行，之后考虑将该数组作为非公有属性，只能通过方法访问
    // public latitudeFnArr: Array<Function>;

    constructor() {
        this.position = new Vector3();
        this.target = new Vector3();
        this.spherical = new Spherical();
        // this._longitude = 0;
        // this._latitude = Math.PI / 2;

    }
}

export {
    ModelCamera
}