class Vector3 {
    protected _x:number;
    public get x() {
        return this._x;
    }
    public set x(val:number) {
        this._x = val;
        this.xFn(this._x);
    }
    protected _y:number;
    public get y() {
        return this._y;
    }
    public set y(val:number) {
        this._y = val;
        this.yFn(this._y);
    }
    protected _z:number;
    public get z() {
        return this._z;
    }
    public set z(val:number) {
        this._z = val;
        this.zFn(this._z);
    }
    public set(x:number, y:number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    constructor(x=0, y=0, z=0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    public xFn(val:number) {

    }
    public yFn(val:number) {

    }
    public zFn(val:number) {

    }
}


export {
    Vector3
};
