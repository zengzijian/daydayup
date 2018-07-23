import {Input} from "./input";

function mainHtml() {
    let inputObjPosX = new Input("posX:", "posX");
    let inputObjPosY = new Input("posY:", "posY");
    let inputObjPosZ = new Input("posZ:", "posZ");
    
    let inputCameraPosX = new Input("cameraPosX", "cameraPosX");
    let inputCameraPosY = new Input("cameraPosY", "cameraPosY");
    let inputCameraPosZ = new Input("cameraPosZ", "cameraPosZ");

    let dataBoard = document.getElementById("dataBoard");
    dataBoard.appendChild(inputObjPosX.dom);
    dataBoard.appendChild(inputObjPosY.dom);
    dataBoard.appendChild(inputObjPosZ.dom);

    let br = document.createElement("br");
    dataBoard.appendChild(br);

    dataBoard.appendChild(inputCameraPosX.dom);
    dataBoard.appendChild(inputCameraPosY.dom);
    dataBoard.appendChild(inputCameraPosZ.dom);

}


export {mainHtml};