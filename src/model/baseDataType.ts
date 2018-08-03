import * as THREE from "three";
import {asyncArr} from "../3d/create3d";

class Vector3 extends THREE.Vector3{
    protected _x:number;
    public get x() {
        return this._x;
    }
    public set x(val:number) {
        if(this._x !== val) {
            this._x = val;
            var xFn = this.xFn.bind(this, this._x);
            console.log("xFn");
            asyncArr.push(xFn);
        }
        // this.xFn(this._x);
        // var xFn = this.xFn.bind(this, this._x);
        // asyncArr.push(xFn);
    }
    protected _y:number;
    public get y() {
        return this._y;
    }
    public set y(val:number) {
        if(this._y !== val) {
            this._y = val;
            var yFn = this.yFn.bind(this, this._y);
            console.log("yFn");
            asyncArr.push(yFn);
        }
    }
    protected _z:number;
    public get z() {
        return this._z;
    }
    public set z(val:number) {
        if(this._z !== val) {
            this._z = val;
            var zFn = this.zFn.bind(this, this._z);
            console.log("zFn");
            asyncArr.push(zFn);
        }
    }
    constructor(x=0, y=0, z=0) {
        super();
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

class Spherical extends THREE.Spherical{
    protected _radius:number;
    public get radius() {
        return this._radius;
    }
    public set radius(val:number) {
        this._radius = val;
        this.radiusFn(this._radius);
    }
    protected _phi:number;
    public get phi() {
        return this._phi;
    }
    public set phi(val:number) {
        this._phi = val;
        this.phiFn(this._phi);
    }
    protected _theta:number;
    public get theta() {
        return this._theta;
    }
    public set theta(val:number) {
        this._theta = val;
        this.thetaFn(this._theta);
    }
    constructor(radius=1.0, phi=0,theta=0) {
        super();
        this._radius = radius;
        this._phi = phi;
        this._theta = theta;
    }
    public setAll(radius:number, phi:number,theta:number) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;

        this.setAllFn(this._radius, this._phi, this._theta);

    }
    public setAllFn(radius:number, phi:number,theta:number) {

    }
    public radiusFn(val:number) {

    }
    public phiFn(val:number) {

    }
    public thetaFn(val:number) {

    }
}

export {
    Vector3,
    Spherical
};
