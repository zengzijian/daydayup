function createCanvas() {
    let canvas = document.createElement("canvas");
    canvas.id = "webglCanvas";
    canvas.width = 500;
    canvas.height = 500;
    document.body.appendChild(canvas);
}

export {
    createCanvas
}