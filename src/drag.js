const THREE = require( 'three' );
const proxyObj = require('./proxyObj');
const HandleHelper = require('./handleHelper');

var _raycaster    = new THREE.Raycaster(),
    _mouse        = new THREE.Vector2(),
    _offset       = new THREE.Vector3(),
    _intersection = new THREE.Vector3(),
    _plane        = new THREE.Plane(),
    _lastSelected,
    _INTERSECTED,
    _exp,
    _self,
    _isClickSelect,
    _isRaycasterCross,
    _alongAxis = false,
    _onPlane = false,
    _inSpace = false;

const selectedStatus = {
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0
}; // 这个变量存储数据，在变更selected物体时，需要避免上一个物体对下一个物体造成影响

const assignStatus = (obj, isUI = false) => {
    let m = _self.selected || _lastSelected;
    m.position.set(obj.posX, obj.posY, obj.posZ);
    m.rotation.set(obj.rotX, obj.rotY, obj.rotZ);
    if(!isUI) {
        document.getElementById('posX').value = obj.posX.toFixed(2);
        document.getElementById('posY').value = obj.posY.toFixed(2);
        document.getElementById('posZ').value = obj.posZ.toFixed(2);
        document.getElementById('rotX').value = obj.rotX.toFixed(2);
        document.getElementById('rotY').value = obj.rotY.toFixed(2);
        document.getElementById('rotZ').value = obj.rotZ.toFixed(2);
    }
}
    
const proxyStatus = proxyObj(selectedStatus, assignStatus);

function onClick(e) {
    // _raycaster.setFromCamera( _mouse, _exp.camera );
    // var MMinteract = _raycaster.intersectObjects( _self.MMarr, true );
    // if( MMinteract.length > 0 ) {
    //    _isClick = true;
    //    console.log(_isClick);
    // }
}

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

        _isRaycasterCross = true;

        if(_isClickSelect) {

            var mesh = MMinteract[ 0 ].object;

            _alongAxis = mesh.axis ? mesh.axis : false;
            _onPlane = mesh.plane ? mesh.plane : false;

            var modelName = mesh.mName;
            if(modelName && _exp.scene.getObjectByName(modelName)) {
                
                _exp.controls.enabled = false;
                _self.selected = _exp.scene.getObjectByName(modelName);
                _lastSelected = _self.selected;
        
                let pos = (new THREE.Vector3()).copy(_self.selected.position);
                let rot = (new THREE.Vector3()).copy(_self.selected.rotation);
        
                proxyStatus.posX = pos.x;
                proxyStatus.posY = pos.y;
                proxyStatus.posZ = pos.z;
                proxyStatus.rotX = rot.x;
                proxyStatus.rotY = rot.y;
                proxyStatus.rotZ = rot.z;
        
                _plane.setFromNormalAndCoplanarPoint(
                    _exp.camera.getWorldDirection( _plane.normal ),
                    _self.selected.position
                );
        
                if( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
                    _offset.copy( _intersection ).sub( _self.selected.position );
                }
            }
        }

    } else {
        _isRaycasterCross = false;
        console.log(`isRaycasterCross ${_isRaycasterCross}, isClickSelect ${_isClickSelect}`);
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

    if(_isRaycasterCross) {
        _isRaycasterCross = false;
    }

    if( _self.selected ) {
        if( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

            _isRaycasterCross = true;

            // _self.selected.position.copy( _intersection.sub( _offset ) );
            let pos = _intersection.sub( _offset );

            if(_alongAxis) {

                proxyStatus['pos' + _alongAxis.toUpperCase()] = pos[_alongAxis];

            } else if(_onPlane) {

                switch(_onPlane) {
                    case "xy":
                        proxyStatus.posX = pos.x;
                        proxyStatus.posY = pos.y;
                        break;
                    case "yz":
                        proxyStatus.posY = pos.y;
                        proxyStatus.posZ = pos.z;
                        break;
                    case "zx":
                        proxyStatus.posZ = pos.z;
                        proxyStatus.posX = pos.x;
                        break;
                }

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
    _isClickSelect = _isRaycasterCross;

    if( _self.selected ) {
        _exp.controls.enabled = true;
        _self.selected = null;
    }

    _alongAxis = false;
    _onPlane = false;
    _inSpace = false;
}

class Drag {
    
    constructor( exp ) {
        _exp = exp;
        _self = this;

        this.enabled = true;
        this.MMarr = [];
        this.selected;

        this.handleHelper = new HandleHelper(_exp.scene, _exp.camera);
        console.log(this.handleHelper);
        this.MMarr.push(this.handleHelper.wrap);

        _exp.loopFnArr.push(function() {
            _self.handleHelper.update();
        });     

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
        _exp.renderer.domElement.addEventListener( 'click', onClick, false);
    }

}

module.exports = Drag;