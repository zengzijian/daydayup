import {NewArray} from "../model/NewArray";

function testFn2() {
    console.log("test");

    let a = new NewArray(1, 1, 1, 1, "string");
    // let a = new NewArray(1, 2, 3);
    (a as any).ob.addListener("push", () => {
        console.log("监听了push操作");
    });
    a.push(1, 2, 3, 4);
    console.log(a);
    // a.pop();
    a.splice(2, 2);

    console.log(a);

    let b = new NewArray({x:1}, {x: 2});
    b.unshift({x:0});
    console.log(b);

    console.log(a === b);
    console.log((a as any).__proto__ === (b as any).__proto__);

}

export {testFn2};