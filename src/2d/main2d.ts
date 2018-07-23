import {Create2d} from "./create2d";
import * as PIXI from "pixi.js";

function main2d() {
    var app2d = new Create2d({
        domId: "area2d"
    });

    var rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64);
    rectangle.endFill();
    rectangle.x = 170;
    rectangle.y = 170;

    app2d.app.stage.addChild(rectangle);
}

export {main2d};