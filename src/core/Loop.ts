import {AsyncQueue} from "./AsyncQueue";
import {app3d} from "../3d/main3d";
import {AsyncList} from "./AsyncQueue1";
import {render3d} from "../3d/test3d";

function LOOP() {
    requestAnimationFrame(LOOP);

    // if(AsyncQueue.length > 0) {
    //     // console.log("执行异步队列中的方法啦～");
    //     // AsyncQueue.push(app3d.activeRender);
    //     AsyncQueue.forEach((fn:Function) => {
    //         fn();
    //     });
    //     AsyncQueue.length = 0;
    // }

    for(let i in AsyncList) {
        let typeArr = AsyncList[i];

        switch(i) {
            case "dom":
            case "always":
                // todo 好像始终渲染的线程，不需要将渲染队列重置
                if(typeArr.length > 0) {
                    typeArr.forEach((fn:Function) => {
                       fn();
                    });
                }
                break;
            case "three":
                if(typeArr.length > 0 ) {
                    // todo push 3d render function
                    typeArr.push(render3d);
                    runAllFn(typeArr);
                }
                break;
            case "two":
                if(typeArr.length > 0) {
                    // todo push 2d render function
                    runAllFn(typeArr);
                }
        }
    }
}

function runAllFn(arr:Array<Function>) {
    arr.forEach((fn:Function) => {
        fn();
    });
    arr.length = 0;
}

export {LOOP};