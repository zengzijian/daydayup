import * as THREE from  "three";

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or arrow keys / touch: two-finger move

export class OrbitControls extends THREE.EventDispatcher{
    public object:any;

    public domElement:any;

    // Set to false to disable this control
    public enabled = true;

    // "target" sets the location of focus, where the object orbits around
    public target = new THREE.Vector3();

    // How far you can dolly in and out ( PerspectiveCamera only )
    public minDistance = 0;
    public maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    public minZoom = 0;
    public maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    public minPolarAngle = 0; // radians
    public maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    public minAzimuthAngle = - Infinity; // radians
    public maxAzimuthAngle = Infinity; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    public enableDamping = false;
    public dampingFactor = 0.25;

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    public enableZoom = true;
    public zoomSpeed = 1.0;

    // Set to false to disable rotating
    public enableRotate = true;
    public rotateSpeed = 1.0;

    // Set to false to disable panning
    public enablePan = true;
    public panSpeed = 1.0;
    public screenSpacePanning = false; // if true, pan in screen-space
    public keyPanSpeed = 7.0;	// pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    public autoRotate = false;
    public autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    public enableKeys = true;

    // The four arrow keys
    public keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    // Mouse buttons
    public mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

    // for reset
    public target0 = this.target.clone();
    public position0:any;
    public zoom0:any;

    //
    // internals
    //

    // var scope = this;

    public changeEvent = { type: 'change' };
    public startEvent = { type: 'start' };
    public endEvent = { type: 'end' };

    public STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

    public state = this.STATE.NONE;

    public EPS = 0.000001;

    // current position in spherical coordinates
    public spherical = new THREE.Spherical();
    public sphericalDelta = new THREE.Spherical();

    public scale = 1;
    public panOffset = new THREE.Vector3();
    public zoomChanged = false;

    public rotateStart = new THREE.Vector2();
    public rotateEnd = new THREE.Vector2();
    public rotateDelta = new THREE.Vector2();

    public panStart = new THREE.Vector2();
    public panEnd = new THREE.Vector2();
    public panDelta = new THREE.Vector2();

    public dollyStart = new THREE.Vector2();
    public dollyEnd = new THREE.Vector2();
    public dollyDelta = new THREE.Vector2();

    public update:Function;

    public constructor(object:any, domElement:any) {
        super();

        this.object = object;

        this.domElement = ( domElement !== undefined ) ? domElement : document;

        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;

        this.update = this.updatefn();

        this.initEvent();
    }

    //
    // public methods
    //

    public getPolarAngle = function () {

        return this.spherical.phi;

    };

    public getAzimuthalAngle = function () {

        return this.spherical.theta;

    };

    public saveState = function () {

        this.target0.copy( this.target );
        this.position0.copy( this.object.position );
        this.zoom0 = this.object.zoom;

    };

    public reset = function () {

        this.target.copy( this.target0 );
        this.object.position.copy( this.position0 );
        this.object.zoom = this.zoom0;

        this.object.updateProjectionMatrix();
        this.dispatchEvent( this.changeEvent );

        this.update();

        this.state = this.STATE.NONE;

    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    public updatefn = function () {

        var offset = new THREE.Vector3();

        // so camera.up is the orbit axis
        var quat = new THREE.Quaternion().setFromUnitVectors( this.object.up, new THREE.Vector3( 0, 1, 0 ) );
        var quatInverse = quat.clone().inverse();

        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();

        return function update() {

            var position = this.object.position;

            offset.copy( position ).sub( this.target );

            // rotate offset to "y-axis-is-up" space
            offset.applyQuaternion( quat );

            // angle from z-axis around y-axis
            this.spherical.setFromVector3( offset );

            if ( this.autoRotate && this.state === this.STATE.NONE ) {

                this.rotateLeft( this.getAutoRotationAngle() );

            }

            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;

            // restrict theta to be between desired limits
            this.spherical.theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, this.spherical.theta ) );

            // restrict phi to be between desired limits
            this.spherical.phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, this.spherical.phi ) );

            this.spherical.makeSafe();


            this.spherical.radius *= this.scale;

            // restrict radius to be between desired limits
            this.spherical.radius = Math.max( this.minDistance, Math.min( this.maxDistance, this.spherical.radius ) );

            // move target to panned location
            this.target.add( this.panOffset );

            offset.setFromSpherical( this.spherical );

            // rotate offset back to "camera-up-vector-is-up" space
            offset.applyQuaternion( quatInverse );

            position.copy( this.target ).add( offset );

            this.object.lookAt( this.target );

            if ( this.enableDamping === true ) {

                this.sphericalDelta.theta *= ( 1 - this.dampingFactor );
                this.sphericalDelta.phi *= ( 1 - this.dampingFactor );

                this.panOffset.multiplyScalar( 1 - this.dampingFactor );

            } else {

                this.sphericalDelta.set( 0, 0, 0 );

                this.panOffset.set( 0, 0, 0 );

            }

            this.scale = 1;

            // update condition is:
            // min(camera displacement, camera rotation in radians)^2 > EPS
            // using small-angle approximation cos(x/2) = 1 - x^2 / 8

            if ( this.zoomChanged ||
                lastPosition.distanceToSquared( this.object.position ) > this.EPS ||
                8 * ( 1 - lastQuaternion.dot( this.object.quaternion ) ) > this.EPS ) {

                this.dispatchEvent( this.changeEvent );

                lastPosition.copy( this.object.position );
                lastQuaternion.copy( this.object.quaternion );
                this.zoomChanged = false;

                return true;

            }

            return false;

        };

    }

    public dispose = function () {

        this.domElement.removeEventListener( 'contextmenu', this.onContextMenu, false );
        this.domElement.removeEventListener( 'mousedown', this.onMouseDown, false );
        this.domElement.removeEventListener( 'wheel', this.onMouseWheel, false );

        this.domElement.removeEventListener( 'touchstart', this.onTouchStart, false );
        this.domElement.removeEventListener( 'touchend', this.onTouchEnd, false );
        this.domElement.removeEventListener( 'touchmove', this.onTouchMove, false );

        document.removeEventListener( 'mousemove', this.onMouseMove, false );
        document.removeEventListener( 'mouseup', this.onMouseUp, false );

        window.removeEventListener( 'keydown', this.onKeyDown, false );

        //this.dispatchEvent( { type: 'dispose' } ); // should this be added here?

    };

    public getAutoRotationAngle() {

        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;

    }

    public getZoomScale() {

        return Math.pow( 0.95, this.zoomSpeed );

    }

    public rotateLeft( angle:number ) {

        this.sphericalDelta.theta -= angle;

    }

    public rotateUp( angle:number ) {

        this.sphericalDelta.phi -= angle;

    }

    public panLeft = function () {

        var v = new THREE.Vector3();

        return function panLeft( distance:number, objectMatrix:any ) {

            v.setFromMatrixColumn(objectMatrix,0 as any); // get X column of objectMatrix
            v.multiplyScalar( - distance );

            this.panOffset.add( v );

        };

    }();

    public panUp = function () {

        var v = new THREE.Vector3();

        return function panUp( distance:number, objectMatrix:any ) {

            if ( this.screenSpacePanning === true ) {

                v.setFromMatrixColumn( objectMatrix, 1 as any );

            } else {

                v.setFromMatrixColumn( objectMatrix, 0 as any );
                v.crossVectors( this.object.up, v );

            }

            v.multiplyScalar( distance );

            this.panOffset.add( v );

        };

    }();

    // deltaX and deltaY are in pixels; right and down are positive
    public pan = function () {

        var offset = new THREE.Vector3();

        return function pan( deltaX:number, deltaY:number ) {

            var element = this.domElement === document ? this.domElement.body : this.domElement;

            if ( this.object.isPerspectiveCamera ) {

                // perspective
                var position = this.object.position;
                offset.copy( position ).sub( this.target );
                var targetDistance = offset.length();

                // half of the fov is center to top of screen
                targetDistance *= Math.tan( ( this.object.fov / 2 ) * Math.PI / 180.0 );

                // we use only clientHeight here so aspect ratio does not distort speed
                this.panLeft( 2 * deltaX * targetDistance / element.clientHeight, this.object.matrix );
                this.panUp( 2 * deltaY * targetDistance / element.clientHeight, this.object.matrix );

            } else if ( this.object.isOrthographicCamera ) {

                // orthographic
                this.panLeft( deltaX * ( this.object.right - this.object.left ) / this.object.zoom / element.clientWidth, this.object.matrix );
                this.panUp( deltaY * ( this.object.top - this.object.bottom ) / this.object.zoom / element.clientHeight, this.object.matrix );

            } else {

                // camera neither orthographic nor perspective
                console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
                this.enablePan = false;

            }

        };

    }();

    public dollyIn( dollyScale:number ) {

        if ( this.object.isPerspectiveCamera ) {

            this.scale /= dollyScale;

        } else if ( this.object.isOrthographicCamera ) {

            this.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom * dollyScale ) );
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;

        } else {

            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
            this.enableZoom = false;

        }

    }

    public dollyOut( dollyScale:number ) {

        if ( this.object.isPerspectiveCamera ) {

            this.scale *= dollyScale;

        } else if ( this.object.isOrthographicCamera ) {

            this.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / dollyScale ) );
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;

        } else {

            console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
            this.enableZoom = false;

        }

    }

    //
    // event callbacks - update the object state
    //

    public handleMouseDownRotate = ( event:any ) => {

        //console.log( 'handleMouseDownRotate' );

        this.rotateStart.set( event.clientX, event.clientY );

    }

    public handleMouseDownDolly = ( event:any ) => {

        //console.log( 'handleMouseDownDolly' );

        this.dollyStart.set( event.clientX, event.clientY );

    }

    public handleMouseDownPan = ( event:any ) => {

        //console.log( 'handleMouseDownPan' );

        this.panStart.set( event.clientX, event.clientY );

    }

    public handleMouseMoveRotate = ( event:any ) => {

        //console.log( 'handleMouseMoveRotate' );

        this.rotateEnd.set( event.clientX, event.clientY );

        this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart ).multiplyScalar( this.rotateSpeed );

        var element = this.domElement === document ? this.domElement.body : this.domElement;

        // rotating across whole screen goes 360 degrees around
        this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientWidth );

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp( 2 * Math.PI * this.rotateDelta.y / element.clientHeight );

        this.rotateStart.copy( this.rotateEnd );

        this.update();

    }

    public handleMouseMoveDolly = ( event:any ) => {

        //console.log( 'handleMouseMoveDolly' );

        this.dollyEnd.set( event.clientX, event.clientY );

        this.dollyDelta.subVectors( this.dollyEnd, this.dollyStart );

        if ( this.dollyDelta.y > 0 ) {

            this.dollyIn( this.getZoomScale() );

        } else if ( this.dollyDelta.y < 0 ) {

            this.dollyOut( this.getZoomScale() );

        }

        this.dollyStart.copy( this.dollyEnd );

        this.update();

    }

    public handleMouseMovePan = ( event:any ) => {

        //console.log( 'handleMouseMovePan' );

        this.panEnd.set( event.clientX, event.clientY );

        this.panDelta.subVectors( this.panEnd, this.panStart ).multiplyScalar( this.panSpeed );

        this.pan( this.panDelta.x, this.panDelta.y );

        this.panStart.copy( this.panEnd );

        this.update();

    }

    public handleMouseUp = ( event:any ) => {

        // console.log( 'handleMouseUp' );

    }

    public handleMouseWheel = ( event:any ) => {

        // console.log( 'handleMouseWheel' );

        if ( event.deltaY < 0 ) {

            this.dollyOut( this.getZoomScale() );

        } else if ( event.deltaY > 0 ) {

            this.dollyIn( this.getZoomScale() );

        }

        this.update();

    }

    public handleKeyDown = ( event:any ) => {

        //console.log( 'handleKeyDown' );

        switch ( event.keyCode ) {

            case this.keys.UP:
                this.pan( 0, this.keyPanSpeed );
                this.update();
                break;

            case this.keys.BOTTOM:
                this.pan( 0, - this.keyPanSpeed );
                this.update();
                break;

            case this.keys.LEFT:
                this.pan( this.keyPanSpeed, 0 );
                this.update();
                break;

            case this.keys.RIGHT:
                this.pan( - this.keyPanSpeed, 0 );
                this.update();
                break;

        }

    }

    public handleTouchStartRotate = ( event:any ) => {

        //console.log( 'handleTouchStartRotate' );

        this.rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

    }

    public handleTouchStartDollyPan = ( event:any ) => {

        //console.log( 'handleTouchStartDollyPan' );

        if ( this.enableZoom ) {

            var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
            var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

            var distance = Math.sqrt( dx * dx + dy * dy );

            this.dollyStart.set( 0, distance );

        }

        if ( this.enablePan ) {

            var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
            var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

            this.panStart.set( x, y );

        }

    }

    public handleTouchMoveRotate = ( event:any ) => {

        //console.log( 'handleTouchMoveRotate' );

        this.rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

        this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart ).multiplyScalar( this.rotateSpeed );

        var element = this.domElement === document ? this.domElement.body : this.domElement;

        // rotating across whole screen goes 360 degrees around
        this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientWidth );

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp( 2 * Math.PI * this.rotateDelta.y / element.clientHeight );

        this.rotateStart.copy( this.rotateEnd );

        this.update();

    }

    public handleTouchMoveDollyPan = ( event:any ) => {

        //console.log( 'handleTouchMoveDollyPan' );

        if ( this.enableZoom ) {

            var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
            var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

            var distance = Math.sqrt( dx * dx + dy * dy );

            this.dollyEnd.set( 0, distance );

            this.dollyDelta.set( 0, Math.pow( this.dollyEnd.y / this.dollyStart.y, this.zoomSpeed ) );

            this.dollyIn( this.dollyDelta.y );

            this.dollyStart.copy( this.dollyEnd );

        }

        if ( this.enablePan ) {

            var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
            var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

            this.panEnd.set( x, y );

            this.panDelta.subVectors( this.panEnd, this.panStart ).multiplyScalar( this.panSpeed );

            this.pan( this.panDelta.x, this.panDelta.y );

            this.panStart.copy( this.panEnd );

        }

        this.update();

    }

    public handleTouchEnd( event:any ) {

        //console.log( 'handleTouchEnd' );

    }

    //
    // event handlers - FSM: listen for events and reset state
    //

    public onMouseDown = ( event:any ) => {

        if ( this.enabled === false ) return;

        event.preventDefault();

        switch ( event.button ) {

            case this.mouseButtons.ORBIT:

                if ( this.enableRotate === false ) return;

                this.handleMouseDownRotate( event );

                this.state = this.STATE.ROTATE;

                break;

            case this.mouseButtons.ZOOM:

                if ( this.enableZoom === false ) return;

                this.handleMouseDownDolly( event );

                this.state = this.STATE.DOLLY;

                break;

            case this.mouseButtons.PAN:

                if ( this.enablePan === false ) return;

                this.handleMouseDownPan( event );

                this.state = this.STATE.PAN;

                break;

        }

        if ( this.state !== this.STATE.NONE ) {

            document.addEventListener( 'mousemove', this.onMouseMove, false );
            document.addEventListener( 'mouseup', this.onMouseUp, false );

            this.dispatchEvent( this.startEvent );

        }

    }

    public onMouseMove = ( event:any ) => {

        if ( this.enabled === false ) return;

        event.preventDefault();

        switch ( this.state ) {

            case this.STATE.ROTATE:

                if ( this.enableRotate === false ) return;

                this.handleMouseMoveRotate( event );

                break;

            case this.STATE.DOLLY:

                if ( this.enableZoom === false ) return;

                this.handleMouseMoveDolly( event );

                break;

            case this.STATE.PAN:

                if ( this.enablePan === false ) return;

                this.handleMouseMovePan( event );

                break;

        }

    }

    public onMouseUp = ( event:any ) => {

        if ( this.enabled === false ) return;

        this.handleMouseUp( event );

        document.removeEventListener( 'mousemove', this.onMouseMove, false );
        document.removeEventListener( 'mouseup', this.onMouseUp, false );

        this.dispatchEvent( this.endEvent );

        this.state = this.STATE.NONE;

    }

    public onMouseWheel = ( event:any ) => {

        if ( this.enabled === false || this.enableZoom === false || ( this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE ) ) return;

        event.preventDefault();
        event.stopPropagation();

        this.dispatchEvent( this.startEvent );

        this.handleMouseWheel( event );

        this.dispatchEvent( this.endEvent );

    }

    public onKeyDown = ( event:any ) => {

        if ( this.enabled === false || this.enableKeys === false || this.enablePan === false ) return;

        this.handleKeyDown( event );

    }

    public onTouchStart = ( event:any ) => {

        if ( this.enabled === false ) return;

        event.preventDefault();

        switch ( event.touches.length ) {

            case 1:	// one-fingered touch: rotate

                if ( this.enableRotate === false ) return;

                this.handleTouchStartRotate( event );

                this.state = this.STATE.TOUCH_ROTATE;

                break;

            case 2:	// two-fingered touch: dolly-pan

                if ( this.enableZoom === false && this.enablePan === false ) return;

                this.handleTouchStartDollyPan( event );

                this.state = this.STATE.TOUCH_DOLLY_PAN;

                break;

            default:

                this.state = this.STATE.NONE;

        }

        if ( this.state !== this.STATE.NONE ) {

            this.dispatchEvent( this.startEvent );

        }

    }

    public onTouchMove = ( event:any ) => {

        if ( this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

            case 1: // one-fingered touch: rotate

                if ( this.enableRotate === false ) return;
                if ( this.state !== this.STATE.TOUCH_ROTATE ) return; // is this needed?

                this.handleTouchMoveRotate( event );

                break;

            case 2: // two-fingered touch: dolly-pan

                if ( this.enableZoom === false && this.enablePan === false ) return;
                if ( this.state !== this.STATE.TOUCH_DOLLY_PAN ) return; // is this needed?

                this.handleTouchMoveDollyPan( event );

                break;

            default:

                this.state = this.STATE.NONE;

        }

    }

    public onTouchEnd = ( event:any ) => {

        if ( this.enabled === false ) return;

        this.handleTouchEnd( event );

        this.dispatchEvent( this.endEvent );

        this.state = this.STATE.NONE;

    }

    public onContextMenu = ( event:any ) => {

        if ( this.enabled === false ) return;

        event.preventDefault();

    }

    public initEvent(){
        this.domElement.addEventListener( 'contextmenu', this.onContextMenu, false );

        this.domElement.addEventListener( 'mousedown', this.onMouseDown, false );
        this.domElement.addEventListener( 'wheel', this.onMouseWheel, false );

        this.domElement.addEventListener( 'touchstart', this.onTouchStart, false );
        this.domElement.addEventListener( 'touchend', this.onTouchEnd, false );
        this.domElement.addEventListener( 'touchmove', this.onTouchMove, false );

        window.addEventListener( 'keydown', this.onKeyDown, false );

        // force an update at start

        this.update();
    }
}

// THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
// THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

/*
Object.defineProperties( THREE.OrbitControls.prototype, {

    center: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
            return this.target;

        }

    },

    // backward compatibility

    noZoom: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
            return ! this.enableZoom;

        },

        set: function ( value ) {

            console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
            this.enableZoom = ! value;

        }

    },

    noRotate: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
            return ! this.enableRotate;

        },

        set: function ( value ) {

            console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
            this.enableRotate = ! value;

        }

    },

    noPan: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
            return ! this.enablePan;

        },

        set: function ( value ) {

            console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
            this.enablePan = ! value;

        }

    },

    noKeys: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
            return ! this.enableKeys;

        },

        set: function ( value ) {

            console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
            this.enableKeys = ! value;

        }

    },

    staticMoving: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
            return ! this.enableDamping;

        },

        set: function ( value ) {

            console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
            this.enableDamping = ! value;

        }

    },

    dynamicDampingFactor: {

        get: function () {

            console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
            return this.dampingFactor;

        },

        set: function ( value ) {

            console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
            this.dampingFactor = value;

        }

    }

} );
*/

