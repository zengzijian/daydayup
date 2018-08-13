import "./css/style.css";
import {createDom} from "./view/createDom";
import {main3d} from "./3d/main3d";
import {main2d} from "./2d/main2d";

import {testFn1} from "./test/test1";
import {LOOP} from "./core/Loop";

createDom();
main3d();
main2d();

testFn1();

LOOP();
