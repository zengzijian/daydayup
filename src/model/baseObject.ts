import {Vector3} from "./baseDataType";

export class BaseObject {
    public position: Vector3;
    public rotation: Vector3;
    constructor() {
        this.position = new Vector3();
        this.rotation = new Vector3();
    }
}

