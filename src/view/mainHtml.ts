import {Vector3} from "../model/vector3";
import {Input} from "./input";

function mainHtml() {
    var inputPosX = new Input("posX:", "posX");

    var dataBoard = document.getElementById("dataBoard");
    dataBoard.appendChild(inputPosX.dom);
}


export {mainHtml};