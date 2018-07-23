import {Vector3} from "../model/vector3";
import {Input} from "./input";

function mainHtml() {
    var inputPosX = new Input("posX:", "posX");

    var dataBoard = document.getElementById("dataBoard");
    dataBoard.appendChild(inputPosX.dom);

    // var v1 = new Vector3();
    // v1.xFn = function(val) {
    //     inputPosX.inputDom.setAttribute("value", val);
    //     inputPosX.labelDom.innerHTML = val;
    //     console.log(val);
    // }
    // for(let i = 0; i < 5; i++) {
    //     setTimeout(function() {
    //         v1.x = i;
    //     }, 1000 * i);
    // }
    //
    // inputPosX.inputDom.oninput = function(e:any) {
    //     var num = Number(e.target.value);
    //     console.log(num);
    //     v1.x = num;
    // }
}


export {mainHtml};