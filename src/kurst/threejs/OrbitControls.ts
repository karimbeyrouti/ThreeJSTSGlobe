/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="../../libs/maps/three.d.ts" />
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author Karim Beyrouti / http://kurst.co.uk ( typescript conversion )
 */
module kurst.threejs {

    class credits {


    }

    export class OrbitControlsState {

        public NONE             : number = -1;
        public ROTATE           : number = 0;
        public ZOOM             : number = 1;
        public PAN              : number = 2;
        public TOUCH_ROTATE     : number = 3;
        public TOUCH_ZOOM       : number = 4;
        public TOUCH_PAN        : number = 5;


    }

    export class OrbitControlsKeys{

        public LEFT: number = 37;
        public UP: number = 38;
        public RIGHT: number = 39;
        public BOTTOM: number = 40;


    }

    export class OrbitControls extends kurst.event.EventDispatcher {

        //--VARS PUBLIC----------------------------------------------------------------------

        public center                   : THREE.Vector3     = new THREE.Vector3();
        public userZoom                 : boolean              = true;
        public userZoomSpeed            : number            = 1.0;
        public userRotate               : boolean              = true;
        public userRotateSpeed          : number            = 1.0;
        public userPan                  : boolean              = true;
        public userPanSpeed             : number            = 2.0;
        public autoRotate               : boolean              = false;
        public autoRotateSpeed          : number            = 2.0; // 30 seconds per round when fps is 60
        public minPolarAngle            : number            = 0; // radians
        public maxPolarAngle            : number            = Math.PI; // radians
        public minDistance              : number            = 0;
        public maxDistance              : number            = Infinity;

        //--VARS PRIVATE----------------------------------------------------------------------

        private keys                    : OrbitControlsKeys = new OrbitControlsKeys();
        private EPS                     : number            = 0.000001;
        private PIXELS_PER_ROUND        : number            = 1800;
        private object                  : THREE.Object3D;
        private domElement              : any;
        private rotateStart             : THREE.Vector2     = new THREE.Vector2();
        private rotateEnd               : THREE.Vector2     = new THREE.Vector2();
        private rotateDelta             : THREE.Vector2     = new THREE.Vector2();
        private zoomStart               : THREE.Vector2     = new THREE.Vector2();
        private zoomEnd                 : THREE.Vector2     = new THREE.Vector2();
        private zoomDelta               : THREE.Vector2     = new THREE.Vector2();
        private phiDelta                : number            = 0;
        private thetaDelta              : number            = 0;
        private scale                   : number            = 1;
        private lastPosition            : THREE.Vector3     = new THREE.Vector3();
        private STATE                   : OrbitControlsState = new OrbitControlsState();
        private state                   : number ;

        //--VARS EVENTS----------------------------------------------------------------------

        private changeEvent             : kurst.event.Event = new kurst.event.Event ( 'change' );
        private onMouseDownFnc          : Function;
        private onMouseWheelFnc         : Function;
        private onKeyDownFnc            : Function;
        private onMouseMoveFnc          : any;
        private onMouseUpFnc            : any;

        //------------------------------------------------------------------------------

        constructor ( object : THREE.Object3D , domElement ? ) {

            super();

            this.domElement     = ( domElement !== undefined ) ? domElement : document;

            this.state = this.STATE.NONE;
            this.object = object;

            this.onMouseMoveFnc      = ( event ) => { this.onMouseMove( event );}
            this.onMouseUpFnc      = ( event ) => { this.onMouseUp( event );}

            this.onMouseDownFnc      = ( event ) => { this.onMouseDown( event );}
            this.onMouseWheelFnc      = ( event ) => { this.onMouseWheel( event );}
            this.onKeyDownFnc      = ( event ) => { this.onKeyDown( event );}

            this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
            this.domElement.addEventListener( 'mousedown', this.onMouseDownFnc, false );
            this.domElement.addEventListener( 'mousewheel', this.onMouseWheelFnc, false );
            this.domElement.addEventListener( 'DOMMouseScroll', this.onMouseWheelFnc, false ); // firefox
            this.domElement.addEventListener( 'keydown', this.onKeyDownFnc, false );

        }

        //------------------------------------------------------------------------------

        /*
         */
        public rotateLeft ( angle ) {

            if ( angle === undefined ) {

                angle = this.getAutoRotationAngle();

            }

            this.thetaDelta -= angle;

        }
        /*
         */
        public rotateRight ( angle ) {

            if ( angle === undefined ) {

                angle = this.getAutoRotationAngle();

            }

            this.thetaDelta += angle;

        }
        /*
         */
        public rotateUp ( angle ) {

            if ( angle === undefined ) {

                angle = this.getAutoRotationAngle();

            }

            this.phiDelta -= angle;

        }
        /*
         */
        public rotateDown ( angle ) {

            if ( angle === undefined ) {

                angle = this.getAutoRotationAngle();

            }

            this.phiDelta += angle;

        }
        /*
         */
        public zoomIn ( zoomScale ? ) {

            if ( zoomScale === undefined ) {

                zoomScale = this.getZoomScale();

            }

            this.scale /= zoomScale;

        }
        /*
         */
        public zoomOut ( zoomScale ? ) {

            if ( zoomScale === undefined ) {

                zoomScale = this.getZoomScale();

            }

            this.scale *= zoomScale;

        }
        /*
         */
        public pan ( distance : THREE.Vector3 ) {

            distance.transformDirection( this.object.matrix );
            distance.multiplyScalar( this.userPanSpeed );

            this.object.position.add( distance );
            this.center.add( distance );

        }
        /*
         */
        public update () {

            var position = this.object.position;
            var offset = position.clone().sub( this.center );

            // angle from z-axis around y-axis

            var theta = Math.atan2( offset.x, offset.z );

            // angle from y-axis

            var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

            if ( this.autoRotate ) {

                this.rotateLeft( this.getAutoRotationAngle() );

            }

            theta += this.thetaDelta;
            phi += this.phiDelta;

            // restrict phi to be between desired limits
            phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

            // restrict phi to be betwee EPS and PI-EPS
            phi = Math.max( this.EPS, Math.min( Math.PI - this.EPS, phi ) );

            var radius = offset.length() * this.scale;

            // restrict radius to be between desired limits
            radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

            offset.x = radius * Math.sin( phi ) * Math.sin( theta );
            offset.y = radius * Math.cos( phi );
            offset.z = radius * Math.sin( phi ) * Math.cos( theta );

            position.copy( this.center ).add( offset );

            this.object.lookAt( this.center );

            this.thetaDelta = 0;
            this.phiDelta = 0;
            this.scale = 1;

            if ( this.lastPosition.distanceTo( this.object.position ) > 0 ) {

                this.dispatchEvent( this.changeEvent );

                this.lastPosition.copy( this.object.position );

            }

        }

        //--PRIVATE----------------------------------------------------------------------

        /*
         */
        public getAutoRotationAngle() {

            return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;

        }
        /*
         */
        private getZoomScale() {

            return Math.pow( 0.95, this.userZoomSpeed );

        }

        //--EVENTS----------------------------------------------------------------------

        /*
         */
        private onMouseDown( event ) {

            if ( !this.userRotate ) return;

            event.preventDefault();

            if ( event.button === 0 ) {

                this.state = this.STATE.ROTATE;

                this.rotateStart.set( event.clientX, event.clientY );

            } else if ( event.button === 1 ) {

                this.state = this.STATE.ZOOM;

                this.zoomStart.set( event.clientX, event.clientY );

            } else if ( event.button === 2 ) {

                this.state = this.STATE.PAN;

            }

            document.addEventListener( 'mousemove', this.onMouseMoveFnc, false );
            document.addEventListener( 'mouseup', this.onMouseUpFnc, false );

        }
        /*
         */
        private onMouseMove( event ) {

            event.preventDefault();

            if ( this.state === this.STATE.ROTATE ) {

                this.rotateEnd.set( event.clientX, event.clientY );
                this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

                this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / this.PIXELS_PER_ROUND * this.userRotateSpeed );
                this.rotateUp( 2 * Math.PI * this.rotateDelta.y / this.PIXELS_PER_ROUND * this.userRotateSpeed );

                this.rotateStart.copy( this.rotateEnd );

            } else if ( this.state === this.STATE.ZOOM ) {

                this.zoomEnd.set( event.clientX, event.clientY );
                this.zoomDelta.subVectors( this.zoomEnd, this.zoomStart );

                if ( this.zoomDelta.y > 0 ) {

                    this.zoomIn();

                } else {

                    this.zoomOut();

                }

                this.zoomStart.copy( this.zoomEnd );

            } else if ( this.state === this.STATE.PAN ) {

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                this.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

            }

        }
        /*
         */
        private onMouseUp( event ) {

            if ( ! this.userRotate ) return;

            document.removeEventListener( 'mousemove', this.onMouseMoveFnc, false );
            document.removeEventListener( 'mouseup', this.onMouseUpFnc, false );

            this.state = this.STATE.NONE;

        }
        /*
         */
        private onMouseWheel( event ) {

            if ( ! this.userZoom ) return;

            var delta = 0;

            if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

                delta = event.wheelDelta;

            } else if ( event.detail ) { // Firefox

                delta = - event.detail;

            }

            if ( delta > 0 ) {

                this.zoomOut();

            } else {

                this.zoomIn();

            }

        }
        /*
         */
        private onKeyDown( event ) {

            if ( ! this.userPan ) return;

            switch ( event.keyCode ) {

                case this.keys.UP:
                    this.pan( new THREE.Vector3( 0, 1, 0 ) );
                    break;
                case this.keys.BOTTOM:
                    this.pan( new THREE.Vector3( 0, - 1, 0 ) );
                    break;
                case this.keys.LEFT:
                    this.pan( new THREE.Vector3( - 1, 0, 0 ) );
                    break;
                case this.keys.RIGHT:
                    this.pan( new THREE.Vector3( 1, 0, 0 ) );
                    break;
            }

        }


    }

}