import {app3d} from "../3d/main3d";
import {modelCurrentObj} from "../model/modelCurrentObj";

function updateCurrentObj() {

    for(let i = 0; i < 5; i++) {
        setTimeout(function(){
            modelCurrentObj.position.x = i;
            modelCurrentObj.position.y = i / 2;
            modelCurrentObj.position.z = i / 5;
        }, 1000 * i);
    }

    let inputCurrentObjPosX = document.getElementById("input_posX");
    modelCurrentObj.position.xFn = function(val) {
        app3d.currentObj.position.x = val;
        inputCurrentObjPosX.setAttribute("value", String(val));
        app3d.render();
    }
    inputCurrentObjPosX.oninput = function(e:any) {
        modelCurrentObj.position.x = Number(e.target.value);
    }

    let inputCurrentObjPosY = document.getElementById("input_posY");
    modelCurrentObj.position.yFn = function(val) {
        app3d.currentObj.position.y = val;
        inputCurrentObjPosY.setAttribute("value", String(val));
        app3d.render();
    }
    inputCurrentObjPosY.oninput = function(e:any) {
        modelCurrentObj.position.y = Number(e.target.value);
    }

    let inputCurrentObjPosZ = document.getElementById("input_posZ");
    modelCurrentObj.position.zFn = function(val) {
        app3d.currentObj.position.z = val;
        inputCurrentObjPosZ.setAttribute("value", String(val));
        app3d.render();
    }
    inputCurrentObjPosZ.oninput = function(e:any) {
        modelCurrentObj.position.z = Number(e.target.value);
    }


}

export {updateCurrentObj};