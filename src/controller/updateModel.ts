import {currentObj, app3d} from "../3d/main3d";
import {modelCurrentObj} from "../model/modelCurrentObj";

function updateModel() {

    for(let i = 0; i < 5; i++) {
        setTimeout(function(){
            modelCurrentObj.position.x = i;
        }, 1000 * i);
    }

    var inputCurrentObjPox = document.getElementById("input_posX");
    modelCurrentObj.position.xFn = function(val) {
        currentObj.position.x = val;
        inputCurrentObjPox.setAttribute("value", String(val));
        console.log(val);
        app3d.render();
    }
    inputCurrentObjPox.oninput = function(e:any) {
        modelCurrentObj.position.x = Number(e.target.value);
    }
}

export {updateModel};