console.log("new life!");
// import "./css/style.css";
// import {createDom} from "./view/createDom";
// import {main3d} from "./3d/main3d";
// import {main2d} from "./2d/main2d";
//
// import {testFn1} from "./test/test1";
// import {testFn2} from "./test/test2";
// import {testFn3} from "./test/test3";
//
// import {test3d} from "./3d/test3d";
//
// import {LOOP} from "./core/Loop";

// createDom();
// main3d();
// main2d();

// testFn1();
// testFn2();
// testFn3();
// LOOP();


/**
 * *******************************
 */

import {Template} from "./newLife/t1";

let num = 0;
let t1 = new Template();
console.log(t1);
t1.addData("testProp", num);

setTimeout(()=> {
    num+=5;
    t1.setData("testProp", num);
}, 1000);


// UI层的内容
let btn = document.createElement("button");
btn.innerHTML = t1.getData("testProp");
document.body.appendChild(btn);



// 注册UI层的事件，修改对应model的数据
btn.onclick = function() {
    num+=5;
    t1.setData("testProp", num);
};

(window as any).t1= t1;


// 订阅model数据中某属性对应的事件
t1.addListener("testProp", ()=> {
   btn.innerHTML = t1.getData("testProp");
});
t1.addListener("testProp", () => {
   console.log(t1.getData("testProp"));
});