import "./css/style.css";
// import {createCanvas} from "./originWebgl/dom";
import {createDom} from "./view/createDom";
import {main3d} from "./3d/main3d";
import {main2d} from "./2d/main2d";

import {testFn1} from "./test/test1";
import {testFn2} from "./test/test2";
import {testFn3} from "./test/test3";

import {test3d} from "./3d/test3d";

import {LOOP} from "./core/Loop";

createDom();
main3d();
main2d();

testFn1();

testFn2();
test3d();
testFn3();
//
//
LOOP();

// createCanvas();


