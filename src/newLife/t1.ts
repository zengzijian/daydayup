import {Observer} from "../utils/Observer";

class Template {
    private data:any = {};
    private ob:Observer;
    constructor() {
        this.ob = new Observer();

        this.ob.addListener("test", function() {
            console.log("run test!");
        });

        this.data.pos = {x:0, y:0, z: 0};
        this.data.enabled = true;
        this.data.num = 10;
    }
    public addData = (prop:string, val?:any) => {
        let self = this;

        this.data[prop] = val;

        let val1 = this.data[prop];
        Object.defineProperty(this.data, prop, {
            get: function() {
                console.log("get!");
                return val1;
            },
            set: function(newVal:any) {
                if(newVal !== val1) {
                    val1 = newVal;
                    console.log("set！");
                    self.ob.dispatch(prop);
                }
            }
        })
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

export {Template};