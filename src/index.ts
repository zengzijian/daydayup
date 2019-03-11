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

import {Template, Vector2,Vector3} from "./newLife/t1";
import {Stack} from "./newLife/data";

let s1 = new Stack();
s1.push(1);
s1.push(2);
s1.print();

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

let inputValue = new Vector2(1,2);

let input1 = document.createElement("input");
input1.type = "text";


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

let v2 = new Vector2(2,2);

let t2 = new Template();
t2.addData("position", v2);
let pos = t2.getData("position");
console.log(pos);
pos._x = 10;
console.log(pos._x);
// console.log(pos === v2);
// console.log(v2.x);
// console.log(pos._x);
// pos.set(2,1);
// console.log(pos.x, pos.y);
// pos.x = 4;
// console.log(pos.x, pos.y);
// pos.y = 6;
// console.log(pos.x, pos.y);
// console.log(pos._x);


//
let v3 = new Vector3();

// console.log(pos);

