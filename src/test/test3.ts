// import {Box, TestBox, Camera, ViewModel} from "../viewModel/box";
import {AllViewModel} from "../viewModel/AllViewModel";
import {Camera, TestBoxModel, TestBoxVM, ViewModel} from "../viewModel/box";
import {AllModel} from "../model/AllModel";

import {Vector3} from "../viewModel/box";
import {Container} from "../model/Container";
import {scene} from "../3d/test3d";

class Scene extends Container {
    public v3d:any;
    public v2d:any;
    constructor(view: {v3d?:any, v2d?:any}) {
        super();

        if(view.v3d) this.v3d = view.v3d;
        if(view.v2d) this.v2d = view.v2d;

        // this.ob.addListener("add")
    }
}

function testFn3() {
    // let box = new Box();
    // let box1 = new TestBox();
    //
    // let camera = new Camera();
    // camera.ob.addListener("enabled", () => {
    //     console.log("修改了enabeld属性");
    // });
    // camera.position.ob.addListener("x", () => {
    //     console.log("修改了position的x属性");
    // });
    //
    // setTimeout(() => {
    //     camera.position.x = 100;
    //     camera.enabled = false;
    // }, 2000);
    //
    // let cameraViewModel = new ViewModel(camera);
    // console.log(cameraViewModel);

    // let c = new Camera();
    //
    // c.ob.addListener("position", function(){
    //     console.log(this);
    //     console.log("edit attr position--------");
    // });
    // c.ob.addListener("enabled", () => {
    //     console.log("edit attr enabled--------");
    // });
    // c.position = new Vector3(1, 2, 3);
    // c.position.ob.addListener("x", function() {
    //    console.log("edit position x");
    //    console.log(this);
    // });
    // c.position.x = 10;
    // c.enabled = false;
    // console.log(c);

    let box = new TestBoxVM();
    box.data.position.x = 10;

    // let c1 = new Container();
    // c1.add({x:1});
    // console.log(c1);

    let s = new Scene({v3d:scene});
    console.log(s);
}

export {testFn3};