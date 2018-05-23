const THREE = require('three');

THREE.Object3D.prototype.setAll = function({pos, rot, sca, name, mName} = {}) {
    let [lastPos, lastRot, lastSca] = [this.position.clone(), this.rotation.clone(), this.scale.clone()];

    if(typeof pos === "number") {
        this.position.set(pos, pos, pos);
    } else if(Array.isArray(pos)) {
        this.position.set(pos[0], pos[1], pos[2]);
    } else {
        this.position.copy(lastPos);
    }

    if(typeof rot === "number") {
        this.rotation.set(rot, rot, rot);
    } else if(Array.isArray(rot)) {
        this.rotation.set(rot[0], rot[1], rot[2]);
    } else {
        this.rotation.copy(lastRot);
    }

    if(typeof sca === "number") {
        this.scale.set(sca, sca, sca);
    } else if(Array.isArray(sca)) {
        this.scale.set(sca[0], sca[1], sca[2]);
    } else {
        this.scale.copy(lastSca);
    }

    let objName = name ? name : this.name;
    this.name = objName;

    let meshName = mName ? mName : objName;
    if(meshName) {
        this.traverse((child) => {
            if(child.isMesh){
                child.mName = meshName;
            }
        })
    }
    
}