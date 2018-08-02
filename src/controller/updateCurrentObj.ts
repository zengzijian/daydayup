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

    // todo 目前只能重写一次xFn方法，若在多处添加更新view的操作，可以考虑将所有方法保存到数组中，在set方法中遍历数组执行所有方法
    let inputCurrentObjPosX = document.getElementById("input_posX");
    modelCurrentObj.position.xFn = function(val) {
        app3d.currentObj.position.x = val;
        inputCurrentObjPosX.setAttribute("value", String(val));
        app3d.composerRender();
    }
    inputCurrentObjPosX.oninput = function(e:any) {
        modelCurrentObj.position.x = Number(e.target.value);
    }

    let inputCurrentObjPosY = document.getElementById("input_posY");
    modelCurrentObj.position.yFn = function(val) {
        app3d.currentObj.position.y = val;
        inputCurrentObjPosY.setAttribute("value", String(val));
        app3d.composerRender();
    }
    inputCurrentObjPosY.oninput = function(e:any) {
        modelCurrentObj.position.y = Number(e.target.value);
    }

    let inputCurrentObjPosZ = document.getElementById("input_posZ");
    modelCurrentObj.position.zFn = function(val) {
        app3d.currentObj.position.z = val;
        inputCurrentObjPosZ.setAttribute("value", String(val));
        app3d.composerRender();
    }
    inputCurrentObjPosZ.oninput = function(e:any) {
        modelCurrentObj.position.z = Number(e.target.value);
    }

}

export {updateCurrentObj};