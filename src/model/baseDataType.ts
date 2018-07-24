import * as THREE from "three";

class Vector3 extends THREE.Vector3{
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
