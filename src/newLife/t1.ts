import {Observer} from "../utils/Observer";

class Template {
    private data:any = {};
    private ob:Observer;
    constructor() {
        this.ob = new Observer();
    }
    public addData = (prop:string, val:any) => {
        let self = this;

        this.data[prop] = val;

        // 传入的val值为非引用类型
        let val1 = this.data[prop];
        Object.defineProperty(this.data, prop, {
            get: function() {
                return val1;
            },
            set: function(newVal:any) {
                if(newVal !== val1) {
                    val1 = newVal;
                    self.ob.dispatch(prop);
                }
            }
        });

        if(typeof val === "object") {
            val.setCallback(()=> {
                self.ob.dispatch(prop);
            });
        }
    }

    public addListener = (prop:string, fn:Function) => {
        this.ob.addListener(prop, fn);
    }
    public getData = (prop:string) => {
        return this.data[prop];
    }
    public setData = (prop:string, val:any) => {
        this.data[prop] = val;
    }
}

class Vector2 {
    private _x:number;
    private _y:number;
    private callback:Function;
    constructor(x=0, y=0) {
        this._x = x;
        this._y = y;
    }
    public set = (x:number, y:number) => {
        this._x = x;
        this._y = y;
        if(this.callback) this.callback();
    }
    public get x() {
        return this._x;
    }
    public set x(val:number) {
        this._x = val;
        if(this.callback) this.callback();
    }
    public get y() {
        return this._y;
    }
    public set y(val:number) {
        this._y = val;
        if(this.callback) this.callback();
    }
    public setCallback = (fn:Function) => {
        this.callback = fn;
    }
}


class Vector3 {
    private _x:number;
    private _y:number;
    private _z:number;
    private callback:Function;
    constructor(x=0, y=0, z=0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    public set = (x:number, y:number, z:number) => {
        this._x = x;
        this._y = y;
        this._z = z;
        if(this.callback) this.callback();
    }
    public get x() {
        return this._x;
    }
    public set x(val:number) {
        this._x = val;
        if(this.callback) this.callback();
    }
    public get y() {
        return this._y;
    }
    public set y(val:number) {
        this._y = val;
        if(this.callback) this.callback();
    }
    public get z() {
        return this._z;
    }
    public set z(val:number) {
        this._z = val;
        if(this.callback) this.callback();
    }
    public setCallback = (fn:Function) => {
        this.callback = fn;
    }
}

export {
    Template,
    Vector2,
    Vector3
};