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
    _alongAxis,
    _onPlane,
    _inSpace,
    _rotateAxis,
    _nv, // mouse new vector，用于部件跟随鼠标旋转
    _lv; // mouse last vector，用于部件跟随鼠标旋转

const selectedStatus = {
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0
};

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

        // if(_self.selected && _lastSelected) {
        //     if(_self.selected !== _lastSelected) {
        //         _isRaycasterCross = false;
        //         return;
        //     }
        // }

        // console.log(_self.selected);
        // console.log(_lastSelected);
        // console.log("___________");


        if(_isClickSelect) {

            var interact = MMinteract[ 0 ];
            var mesh = interact.object;

            _alongAxis = mesh.axis ? mesh.axis : null;
            _onPlane = mesh.plane ? mesh.plane : null;
            _rotateAxis = mesh.rotateAxis ? mesh.rotateAxis : null;

            var modelName = mesh.mName;
            if(modelName && _exp.scene.getObjectByName(modelName)) {
                // if(_alongAxis) {
                //     console.log("沿 " + _alongAxis + " 轴拖拽");
                //     console.log("点击的模型modelName为: " + modelName);
                // }

                _self.selected = _exp.scene.getObjectByName(modelName);
                if(_lastSelected && _lastSelected !== _self.selected) {
                    _lastSelected = _self.selected;
                    _self.selected = null;
                    return;
                }
                _lastSelected = _self.selected;
                _exp.controls.enabled = false;

                let pos = (new THREE.Vector3()).copy(_self.selected.position);
                let rot = (new THREE.Vector3()).copy(_self.selected.rotation);

                proxyStatus.posX = pos.x;
                proxyStatus.posY = pos.y;
                proxyStatus.posZ = pos.z;
                proxyStatus.rotX = rot.x;
                proxyStatus.rotY = rot.y;
                proxyStatus.rotZ = rot.z;

                if(_rotateAxis) {
                    if(_rotateAxis === "x") {
                        _plane.normal = new THREE.Vector3(1, 0, 0);
                    } else if(_rotateAxis === "y") {
                        _plane.normal = new THREE.Vector3(0, 1, 0);
                    } else if(_rotateAxis === "z") {
                        _plane.normal = new THREE.Vector3(0, 0, 1);
                    }
                    _plane.constant = - interact.point[_rotateAxis];
                } else if(_onPlane) {
                    if(_onPlane === "xy") {
                        _plane.normal = new THREE.Vector3(0, 0, 1);
                        _plane.constant = - interact.point.z;
                    } else if(_onPlane === "yz") {
                        _plane.normal = new THREE.Vector3(1, 0, 0);
                        _plane.constant = - interact.point.x;
                    } else if(_onPlane === "zx") {
                        _plane.normal = new THREE.Vector3(0, 1, 0);
                        _plane.constant = - interact.point.y;
                    }
                } else if(_alongAxis) {
                    var eye = _exp.camera.position.clone();

                    if(_alongAxis === "x") {
                        _plane.normal = new THREE.Vector3(0, 0, 1);
                        _plane.constant = - _self.selected.position.z;
                        if(Math.abs(eye.y) > Math.abs(eye.z)) {
                            _plane.normal = new THREE.Vector3(0, 1, 0);
                            _plane.constant = - _self.selected.position.y;
                        }
                    } else if(_alongAxis === "y") {
                        _plane.normal = new THREE.Vector3(0, 0, 1);
                        _plane.constant = - _self.selected.position.z;
                        if(Math.abs(eye.x) > Math.abs(eye.z)) {
                            _plane.normal = new THREE.Vector3(1, 0, 0);
                            _plane.constant = - _self.selected.position.x;
                        }
                    } else if(_alongAxis === "z") {
                        _plane.normal = new THREE.Vector3(0, 1, 0);
                        _plane.constant = - _self.selected.position.y;
                        if(Math.abs(eye.x) > Math.abs(eye.y)) {
                            _plane.normal = new THREE.Vector3(1, 0, 0);
                            _plane.constant = - _self.selected.position.x;
                        }
                    }
                    // console.log(_plane);
                } else {
                    _plane.setFromNormalAndCoplanarPoint(
                        _exp.camera.getWorldDirection( _plane.normal ),
                        _self.selected.position
                    );
                    // console.log("----- mousedown -----");
                    // console.log(_plane);
                    // console.log("自由的拖拽平面");
                }

                if( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
                    // console.log('点击的交互点', _intersection);
                    _offset.copy( _intersection ).sub( _self.selected.position );
                    // console.log('点击的交互点', _intersection);
                    // console.log('偏移量', _offset);
                    // console.log("_________________________________________");

                    if(_rotateAxis) {
                        var worldPos = _self.selected.getWorldPosition();

                        _nv = _intersection.clone().sub( worldPos ).projectOnPlane(_plane.normal);
                        _lv = _intersection.clone().sub( worldPos ).projectOnPlane(_plane.normal);
                    }
                }
            }
        }

    } else {
        _isRaycasterCross = false;

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
            // let pos = _intersection.sub( _offset );

            if(_alongAxis) {

                // console.log("点击的模型modelName为: " + modelName);
                // console.log("----- mousemove -----");
                // console.log("点击的交互点位置坐标为 ", _intersection);
                // console.log("拖拽过程中的偏移量为 ", _offset);
                // console.log("拖拽");
                let pos = _intersection.sub( _offset );

                proxyStatus['pos' + _alongAxis.toUpperCase()] = pos[_alongAxis];

                // console.log("沿 " + _alongAxis + " 轴拖拽距离为 " + pos[_alongAxis]);
                // console.log("___________________________________________");

            } else if(_onPlane) {

                let pos = _intersection.sub( _offset );

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

            } else if(_rotateAxis) {

                var worldPos = _self.selected.getWorldPosition();
                // console.log(worldPos);
                // console.log(_intersection);
                _nv = _intersection.clone().sub(worldPos).projectOnPlane(_plane.normal);
                // console.log(_nv);
                var angle = _lv.clone().angleTo(_nv);
                var v =_lv.clone().cross(_nv);
                var direction = v[_rotateAxis] >= 0 ? "-" : "+";

                var ratio = 1;
                if(direction === "+") {
                    proxyStatus['rot' + _rotateAxis.toUpperCase()] -= ratio * angle;
                    // _self.selected.rotation[ _rotateAxis ] -= ratio * angle;
                } else if(direction === "-") {
                    proxyStatus['rot' + _rotateAxis.toUpperCase()] += ratio * angle;
                    // _self.selected.rotation[ _rotateAxis ] += ratio * angle;
                }

                _lv = _nv.clone();
            } else {

                let pos = _intersection.sub( _offset );

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
    // console.log(`isRaycasterCross ${_isRaycasterCross}, isClickSelect ${_isClickSelect}`);
    _isClickSelect = _isRaycasterCross;

    if( _self.selected ) {
        _exp.controls.enabled = true;
        _self.selected = null;
    }

    _alongAxis = null;
    _onPlane = null;
    _inSpace = null;
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

        // _exp.loopFnArr.push(function() {
        //     _self.handleHelper.update();
        // });

        this.addListener();

        document.getElementById('posX').onchange = (e) => {
            // console.log(e.target.value);
            // console.log(typeof e.target.value)
            proxyStatus.posX = Number(e.target.value);
        }
        document.getElementById('posY').onchange = (e) => {
            // console.log(e.target.value);
            // console.log(typeof e.target.value)
            proxyStatus.posY = Number(e.target.value);
        }
        document.getElementById('posZ').onchange = (e) => {
            // console.log(e.target.value);
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