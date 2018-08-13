import {AsyncQueue} from "./AsyncQueue";
import {app3d} from "../3d/main3d";

function LOOP() {
    requestAnimationFrame(LOOP);

    if(AsyncQueue.length > 0) {
        console.log("执行异步队列中的方法啦～");
        AsyncQueue.push(app3d.activeRender);
        AsyncQueue.forEach((fn:Function) => {
            fn();
        });
        AsyncQueue.length = 0;
    }
}

export {LOOP};