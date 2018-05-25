// require('./setAll');
const THREE = require('three');

const Handle3D = (function() {

    var _self,
        _camera,
        _domElement,
        _testArr = [];
        // onMouseDown,
        // onMouseMove,
        // onMouseUp;

    function onMouseDown(e) {
        // console.log(e);
        _self.onMouseDown(e);
        // _self.onMouseDown.call(_self, e);
    }

    function onMouseMove(e){

    }

    function onMouseUp(e) {

    }

    function Handle3d(camera, domElement) {
        _self = this;
        _camera = camera;
        _domElement = domElement;

        this.onMouseDown = function(e) {
            // console.log(this);
            // console.log()
        }

        _testArr.push(1, 2, {a:1, b:2});

        this.addListener();
    }

    Handle3d.prototype.addListener = function() {
        _domElement.addEventListener('mousedown', onMouseDown, false);
        _domElement.addEventListener('mousemove', onMouseMove, false);
        _domElement.addEventListener('mouseUp', onMouseUp, false);
    }

    Handle3d.prototype.removeListener = function() {
        _domElement.removeEventListener('mousedown', onMouseDown, false);
        _domElement.removeEventListener('mousemove', onMouseMove, false);
        _domElement.removeEventListener('mouseUp', onMouseUp, false);
    }
    
    return Handle3d;

})();

module.exports = Handle3D;