const THREE = require( 'three' );

var _raycaster    = new THREE.Raycaster(),
    _mouse        = new THREE.Vector2(),
    _offset       = new THREE.Vector3(),
    _intersection = new THREE.Vector3(),
    _plane        = new THREE.Plane(),
    _lastSelected,
    _INTERSECTED,
    _exp,
    _self;

const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
const result = Reflect.set(target, key, value, receiver);
queuedObservers.forEach(observer => observer());
    return result;
}

let selectedStatus = {
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0
}; // 这个变量存储数据，在变更selected物体时，需要避免上一个物体对下一个物体造成影响

const proxyStatus = observable(selectedStatus);

const assignStatus = (isUI = false) => {
    let m = _self.selected || _lastSelected;
    m.position.set(proxyStatus.posX, proxyStatus.posY, proxyStatus.posZ);
    m.rotation.set(proxyStatus.rotX, proxyStatus.rotY, proxyStatus.rotZ);
    if(!isUI) {
        document.getElementById('posX').value = proxyStatus.posX.toFixed(2);
        document.getElementById('posY').value = proxyStatus.posY.toFixed(2);
        document.getElementById('posZ').value = proxyStatus.posZ.toFixed(2);
        document.getElementById('rotX').value = proxyStatus.rotX.toFixed(2);
        document.getElementById('rotY').value = proxyStatus.rotY.toFixed(2);
        document.getElementById('rotZ').value = proxyStatus.rotZ.toFixed(2);
    }
}
    
observe(assignStatus);


function onMouseDown( e ) {
    // if(e.button !== 0) {
    //     return;
    // }

    // if(_self.enabled) {
    //     return;
    // }

    _raycaster.setFromCamera( _mouse, _exp.camera );
    var MMinteract = _raycaster.intersectObjects( _self.MMarr, true );
    if( MMinteract.length > 0 ) {
        var mesh = MMinteract[ 0 ].object;
        
        _exp.controls.enabled = false;
        _self.selected = mesh;
        _lastSelected = _self.selected;

        _plane.setFromNormalAndCoplanarPoint(
            _exp.camera.getWorldDirection( _plane.normal ),
            _self.selected.position
        );

        if( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
            _offset.copy( _intersection ).sub( _self.selected.position );
        }

    }
}

function onMouseMove( e ) {
    // if(e.button !== 0) {
    //     return;
    // }

    // if(_self.enabled) {
    //     return;
    // }
    var rect = _exp.rect;
    _mouse.x = ( ( e.clientX - rect.left ) / rect.width ) * 2 - 1;
    _mouse.y =  - ( ( e.clientY - rect.top ) / rect.height ) * 2 + 1;
    _raycaster.setFromCamera( _mouse, _exp.camera );

    if( _self.selected ) {
        if( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
            // _self.selected.position.copy( _intersection.sub( _offset ) );
            let pos = _intersection.sub( _offset );
            if(_self.selected.axis) {
                let axis = _self.selected.axis;
                proxyStatus['pos' + axis.toUpperCase()] = pos[axis];
            } else {
                proxyStatus.posX = pos.x;
                proxyStatus.posY = pos.y;
                proxyStatus.posZ = pos.z;
            }

            // _self.proxyPos.copy( _intersection.sub( _offset ) );
            // console.log(_self.selected.position);
            return;
        }
    }
}

function onMouseUp( e ) {
    if( _self.selected ) {
        _exp.controls.enabled = true;
        _self.selected = null;

    }
}

class Drag {
    
    constructor( exp ) {
        _exp = exp;
        _self = this;

        this.enabled = true;
        this.MMarr = [];
        this.selected;

        this.addListener();

        document.getElementById('posX').onchange = (e) => {
            console.log(e.target.value);
            // console.log(typeof e.target.value)
            proxyStatus.posX = Number(e.target.value);
        }
        document.getElementById('posY').onchange = (e) => {
            console.log(e.target.value);
            // console.log(typeof e.target.value)
            proxyStatus.posY = Number(e.target.value);
        }
        document.getElementById('posZ').onchange = (e) => {
            console.log(e.target.value);
            // console.log(typeof e.target.value)
            proxyStatus.posZ = Number(e.target.value);
        }
        
    }

    add( obj ) {
        this.MMarr.push( obj );
    }

    addListener() {
        _exp.renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );
        _exp.renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
        _exp.renderer.domElement.addEventListener( 'mouseup', onMouseUp, false );
    }

}

module.exports = Drag;