function createDom() {

    let baseDomId = "mainArea";

    let baseDom = document.getElementById(baseDomId);
    if(!baseDom) {
        baseDom = document.createElement("div");
        baseDom.id = baseDomId;
        document.body.appendChild(baseDom);

        let dom3d = document.createElement("div");
        dom3d.id = "area3d";
        baseDom.appendChild(dom3d);

        let dom2d = document.createElement("div");
        dom2d.id = "area2d";
        baseDom.appendChild(dom2d);

        let domData = document.createElement("div");
        domData.id = "dataBoard";
        baseDom.appendChild(domData);
    } else {
        return baseDom;
    }
}

export {createDom};

