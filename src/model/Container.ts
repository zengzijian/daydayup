import {NewArray} from "./NewArray";
import {Observer} from "../utils/Observer";

class Container {
    public arr: any;
    public update: any;
    public ob:Observer;
    constructor() {
        this.arr = new NewArray();
        this.ob = new Observer();
    }
    public add(child:any) {
        this.arr.push(child);
    }
    public remove(child:any) {
        let i = this.arr.indexOf(child);
        if(i > -1) {
            this.arr.splice(i, 1);
        }
    }
}

export {
    Container
}