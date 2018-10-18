// import {Box, TestBox, Camera, ViewModel} from "../viewModel/box";
import {AllViewModel} from "../viewModel/AllViewModel";
import {TestBoxModel, TestBoxViewModel, ViewModel} from "../viewModel/box";
import {AllModel} from "../model/AllModel";

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

    AllViewModel.testBox = new TestBoxViewModel();
    console.log(AllViewModel.testBox);

}

export {testFn3};