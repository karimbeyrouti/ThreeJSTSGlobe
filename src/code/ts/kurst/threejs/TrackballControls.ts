/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="../../libs/maps/three.d.ts" />
/*!
 * @author Eberhard Graether / http://egraether.com/
 * @author Karim Beyrouti / http://kurst.co.uk ( typescript conversion )
 */
module kurst.threejs {

    //--TrackballControlsScreen----------------------------------------------------------------------

    class credits{

        public authorA : string = 'Eberhard Graether / http://egraether.com/';
        public authorB : string = 'Karim Beyrouti / http://kurst.co.uk ( typescript conversion )';

    }

    export class TrackballControlsScreen {

        public width        : number = 0;
        public height       : number = 0;
        public offsetLeft   : number = 0;
        public offsetTop    : number = 0;

    }

    //--TrackballControlsState----------------------------------------------------------------------

    export class TrackballControlsState {

        public NONE             : number = -1;
        public ROTATE           : number = 0;
        public ZOOM             : number = 1;
        public PAN              : number = 2;
        public TOUCH_ROTATE     : number = 3;
        public TOUCH_ZOOM       : number = 4;
        public TOUCH_PAN        : number = 5;


    }

    //--TrackballControlsState----------------------------------------------------------------------

    export class TrackballControls extends kurst.event.EventDispatcher {

        //--PUBLIC----------------------------------------------------------------------

        public enabled                 : boolean       = true;
        public rotateSpeed             : number     = 1.0;
        public zoomSpeed               : number     = 1.2;
        public panSpeed                : number     = 0.3;
        public wheelSpeed              : number     = 0.15;
        public noRotate                : boolean       = false;
        public noZoom                  : boolean       = false;
        public noPan                   : boolean       = false;
        public staticMoving            : boolean       = false;
        public dynamicDampingFactor    : number     = 0.2;
        public minDistance             : number     = 0;
        public maxDistance             : number     = Infinity;

        //--PRIVATE----------------------------------------------------------------------

        private STATE                   : kurst.threejs.TrackballControlsState = new kurst.threejs.TrackballControlsState();//Object = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };
        private screen                  : kurst.threejs.TrackballControlsScreen = new kurst.threejs.TrackballControlsScreen();
        private object                  : THREE.Object3D;
        private domElement              : any;
        private radius                  : number;
        private keys                    : Object[];//
        private target                  : THREE.Vector3;
        private lastPosition            : THREE.Vector3;
        private _eye                    : THREE.Vector3;
        private _state                  : number;
        private _prevState              : number;
        private _rotateStart            : THREE.Vector3;
        private _rotateEnd              : THREE.Vector3;
        private _zoomStart              : THREE.Vector2;
        private _zoomEnd                : THREE.Vector2;
        private _panStart               : THREE.Vector2;
        private _panEnd                 : THREE.Vector2;
        private _touchZoomDistanceStart : number = 0;
        private _touchZoomDistanceEnd   : number = 0;
        private target0                 : THREE.Vector3;
        private position0               : THREE.Vector3;
        private up0                     : THREE.Vector3;
        private changeEvent             : kurst.event.Event = new kurst.event.Event( 'change' );

        //--EVENTS----------------------------------------------------------------------

        private mousewheelFnc           : Function;
        private mouseupFnc              : Function;
        private mousedownFnc            : Function;
        private mousemoveFnc            : Function;
        private DOMMouseScrollFnc       : Function;
        private touchstartFnc           : Function;
        private touchendFnc             : Function;
        private touchmoveFnc            : Function;
        private keydownFnc              : Function;
        private keyupFnc                : Function;

        //------------------------------------------------------------------------

        constructor ( object : THREE.Object3D , domElement ? ) {

            super();

            // Variables
            this.object         = object;
            this.domElement     = ( domElement !== undefined ) ? domElement : document;
            this.radius         = ( this.screen.width + this.screen.height ) / 4;
            this.target         = new THREE.Vector3();
            this.lastPosition   = new THREE.Vector3();
            this._state         = this.STATE.NONE
            this._prevState     = this.STATE.NONE;
            this._eye           = new THREE.Vector3(),
            this._rotateStart   = new THREE.Vector3(),
            this._rotateEnd     = new THREE.Vector3(),
            this._zoomStart     = new THREE.Vector2(),
            this._zoomEnd       = new THREE.Vector2(),
            this._panStart      = new THREE.Vector2();
            this._panEnd        = new THREE.Vector2();
            this.target0        = this.target.clone();
            this.position0      = this.object.position.clone();
            this.up0            = this.object.up.clone();
            this.keys           = new Array<Object>(  65 , 83 , 68 );

            // Event Proxies
            this.mousewheelFnc      = ( event ) => { this.mousewheel( event );}
            this.mousedownFnc       = ( event ) => { this.mousedown( event );}
            this.mouseupFnc         = ( event ) => { this.mouseup( event );}
            this.mousemoveFnc       = ( event ) => { this.mousemove( event );}
            this.DOMMouseScrollFnc  = ( event ) => { this.DOMMouseScrollFnc( event ); }
            this.touchstartFnc      = ( event ) => { this.touchstart( event ); }
            this.touchendFnc        = ( event ) => { this.touchend( event ); }
            this.touchmoveFnc       = ( event ) => { this.touchmove( event ); }
            this.keydownFnc         = ( event ) => { this.keydown( event ); }
            this.keyupFnc           = ( event ) => { this.keyup( event );}

            // Add Event Listeners
            this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
            this.domElement.addEventListener( 'mousedown', this.mousedownFnc  , false );
            this.domElement.addEventListener( 'mousewheel', this.mousewheelFnc , false );
            this.domElement.addEventListener( 'DOMMouseScroll', this.DOMMouseScrollFnc , false ); // firefox
            this.domElement.addEventListener( 'touchstart',this.touchstartFnc , false );
            this.domElement.addEventListener( 'touchend',this.touchendFnc , false );
            this.domElement.addEventListener( 'touchmove', this.touchmoveFnc , false );



            window.addEventListener( 'keydown', event => this.keydown( event ) , false );
            window.addEventListener( 'keyup', event => this.keyup( event )  , false );

            this.handleResize();

        }

        //--PUBLIC----------------------------------------------------------------------

        /*
         */
        public update () : void {

            this._eye.subVectors( this.object.position, this.target );

            if ( !this.noRotate ) {

                this.rotateCamera();

            }

            if ( !this.noZoom ) {

                this.zoomCamera();

            }

            if ( !this.noPan ) {

                this.panCamera();

            }

            this.object.position.addVectors( this.target, this._eye );

            this.checkDistances();

            this.object.lookAt( this.target );

            if ( this.lastPosition.distanceToSquared( this.object.position ) > 0 ) {

                this.dispatchEvent( this.changeEvent );

                this.lastPosition.copy( this.object.position );

            }

        }
        /*
         */
        public reset () : void {

            this._state = this.STATE.NONE;
            this._prevState = this.STATE.NONE;
            this.target.copy( this.target0 );
            this.object.position.copy( this.position0 );
            this.object.up.copy( this.up0 );
            this._eye.subVectors( this.object.position, this.target );
            this.object.lookAt( this.target );
            this.dispatchEvent( this.changeEvent );
            this.lastPosition.copy( this.object.position );

        }

        //--PRIVATE----------------------------------------------------------------------

        /*
         */
        private handleEvent ( event : kurst.event.Event ) : void {

            if ( typeof this[ event.type ] == 'function' ) {

                this[ event.type ]( event );

            }

        }
        /*
         */
        private getMouseOnScreen ( clientX : number , clientY : number ) : THREE.Vector2 {

            return new THREE.Vector2(
                ( clientX - this.screen.offsetLeft ) / this.radius * 0.5,
                ( clientY - this.screen.offsetTop ) / this.radius * 0.5
            );

        }
        /*
         */
        private getMouseProjectionOnBall ( clientX : number , clientY : number ) : THREE.Vector3 {

            var mouseOnBall = new THREE.Vector3(
                ( clientX - this.screen.width * 0.5 - this.screen.offsetLeft ) / this.radius,
                ( this.screen.height * 0.5 + this.screen.offsetTop - clientY ) / this.radius,
                0.0
            );

            var length : number = mouseOnBall.length();

            if ( length > 1.0 ) {

                mouseOnBall.normalize();

            } else {

                mouseOnBall.z = Math.sqrt( 1.0 - length * length );

            }

            this._eye.copy( this.object.position ).sub( this.target );

            var projection : THREE.Vector3 = this.object.up.clone().setLength( mouseOnBall.y );
                projection.add( this.object.up.clone().cross( this._eye ).setLength( mouseOnBall.x ) );
                projection.add( this._eye.setLength( mouseOnBall.z ) );
            return projection;

        }
        /*
         */
        private rotateCamera () : void {

            var angle = Math.acos( this._rotateStart.dot( this._rotateEnd ) / this._rotateStart.length() / this._rotateEnd.length() );

            if ( angle ) {

                var axis = ( new THREE.Vector3() ).crossVectors( this._rotateStart, this._rotateEnd ).normalize();
                var quaternion = new THREE.Quaternion();

                angle *= this.rotateSpeed;

                quaternion.setFromAxisAngle( axis, -angle );

                this._eye.applyQuaternion( quaternion );
                this.object.up.applyQuaternion( quaternion );

                this._rotateEnd.applyQuaternion( quaternion );

                if ( this.staticMoving ) {

                    this._rotateStart.copy( this._rotateEnd );

                } else {

                    quaternion.setFromAxisAngle( axis, angle * ( this.dynamicDampingFactor - 1.0 ) );
                    this._rotateStart.applyQuaternion( quaternion );

                }

            }

        }
        /*
         */
        private zoomCamera () : void {

            if ( this._state === this.STATE.TOUCH_ZOOM ) {

                var factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
                this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
                this._eye.multiplyScalar( factor );

            } else {

                var factor = 1.0 + ( this._zoomEnd.y - this._zoomStart.y ) * this.zoomSpeed;

                if ( factor !== 1.0 && factor > 0.0 ) {

                    this. _eye.multiplyScalar( factor );

                    if ( this.staticMoving ) {

                        this._zoomStart.copy( this._zoomEnd );

                    } else {

                        this._zoomStart.y += ( this._zoomEnd.y - this._zoomStart.y ) * this.dynamicDampingFactor;

                    }

                }

            }

        }
        /*
         */
        private panCamera () : void {

            var mouseChange = this._panEnd.clone().sub( this._panStart );

            if ( mouseChange.lengthSq() ) {

                mouseChange.multiplyScalar( this._eye.length() * this.panSpeed );

                var pan = this._eye.clone().cross( this.object.up ).setLength( mouseChange.x );
                    pan.add( this.object.up.clone().setLength( mouseChange.y ) );

                this.object.position.add( pan );
                this.target.add( pan );

                if ( this.staticMoving ) {

                    this._panStart = this._panEnd;

                } else {

                    this._panStart.add( mouseChange.subVectors( this._panEnd, this._panStart ).multiplyScalar( this.dynamicDampingFactor ) );

                }

            }

        }
        /*
         */
        private checkDistances () : void {

            if ( !this.noZoom || !this.noPan ) {

                if ( this.object.position.lengthSq() > this.maxDistance * this.maxDistance ) {

                    this.object.position.setLength( this.maxDistance );

                }

                if ( this._eye.lengthSq() < this.minDistance * this.minDistance ) {

                    this.object.position.addVectors( this.target, this._eye.setLength( this.minDistance ) );

                }

            }

        }

        //--EVENT LISTENERS----------------------------------------------------------------------

        /*
         */
        private handleResize () : void {

            this.screen.width       = window.innerWidth;
            this.screen.height      = window.innerHeight;
            this.screen.offsetLeft  = 0;
            this.screen.offsetTop   = 0;

            this.radius = ( this.screen.width + this.screen.height ) / 4;

        }
        /*
         */
        private keydown( event ) : void {

            if ( this.enabled === false ) return;

            console.log( 'keyDown');

            //window.removeEventListener( 'keydown',event => this.keydown( event ) );

            //window.addEventListener( 'keydown', event => this.keydown( event ) , false );
            //window.addEventListener( 'keyup', event => this.keyup( event )  , false );

            this._prevState = this._state;

            if ( this._state !== this.STATE.NONE ) {

                return;

            } else if ( event.keyCode === this.keys[ this.STATE.ROTATE ] && !this.noRotate ) {

                this._state = this.STATE.ROTATE;

            } else if ( event.keyCode === this.keys[ this.STATE.ZOOM ] && !this.noZoom ) {

                this._state = this.STATE.ZOOM;

            } else if ( event.keyCode === this.keys[ this.STATE.PAN ] && !this.noPan ) {

                this._state = this.STATE.PAN;

            }

        }
        /*
         */
        private keyup( event ) : void {

            if ( this.enabled === false ) return;

                this._state = this._prevState;

            //window.addEventListener( 'keydown', this.keydown, false );
            //window.addEventListener( 'keydown', event => this.keydown( event ) , false );
            //window.addEventListener( 'keyup', event => this.keyup( event )  , false );

        }
        /*
         */
        private mousedown( event ) : void {

            if ( this.enabled === false ) return;

            event.preventDefault();
            event.stopPropagation();

            if ( this._state === this.STATE.NONE ) {

                this._state = event.button;

            }

            if ( this._state === this.STATE.ROTATE && !this.noRotate ) {

                this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );

            } else if ( this._state === this.STATE.ZOOM && ! this.noZoom ) {

                this._zoomStart = this._zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );

            } else if ( this._state === this.STATE.PAN && ! this.noPan ) {

                this._panStart = this._panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

            }

            this.domElement.addEventListener( 'mousemove', this.mousemoveFnc, false );
            this.domElement.addEventListener( 'mouseup', this.mouseupFnc, false );

        }
        /*
         */
        private mousemove( event ) : void {

            if ( this.enabled === false ) return;

            event.preventDefault();
            event.stopPropagation();

            if ( this._state === this.STATE.ROTATE && ! this.noRotate ) {

                this._rotateEnd = this.getMouseProjectionOnBall( event.clientX, event.clientY );

            } else if ( this._state === this.STATE.ZOOM && ! this.noZoom ) {

                this._zoomEnd = this.getMouseOnScreen( event.clientX, event.clientY );

            } else if ( this._state === this.STATE.PAN && ! this.noPan ) {

                this._panEnd = this.getMouseOnScreen( event.clientX, event.clientY );

            }

        }
        /*
         */
        private mouseup( event ) : void {

            if ( this.enabled === false ) return;

            event.preventDefault();
            event.stopPropagation();

            this._state = this.STATE.NONE;

            this.domElement.removeEventListener( 'mousemove', this.mousemoveFnc );
            this.domElement.removeEventListener( 'mouseup', this.mouseupFnc );

        }
        /*
         */
        private mousewheel( event ) : void {

            if ( this.enabled === false ) return;

            event.preventDefault();
            event.stopPropagation();

            var delta = 0;

            if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

                delta = event.wheelDelta / 40;

            } else if ( event.detail ) { // Firefox

                delta = - event.detail / 3;

            }

            this._zoomStart.y += ( 1 / delta ) * this.wheelSpeed;

        }
        /*
         */
        private touchstart( event ) : void {

            if ( this.enabled === false ) return;

            switch ( event.touches.length ) {

                case 1:
                    this._state = this.STATE.TOUCH_ROTATE;
                    this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    break;

                case 2:
                    this._state = this.STATE.TOUCH_ZOOM;
                    var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                    var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                    this._touchZoomDistanceEnd = this._touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
                    break;

                case 3:
                    this._state = this.STATE.TOUCH_PAN;
                    this._panStart = this._panEnd = this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    break;

                default:
                    this._state = this.STATE.NONE;

            }

        }
        /*
         */
        private touchmove( event ) : void {

            if ( this.enabled === false ) return;

            event.preventDefault();
            event.stopPropagation();

            switch ( event.touches.length ) {

                case 1:
                    this._rotateEnd = this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    break;

                case 2:
                    var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                    var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                    this._touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy )
                    break;

                case 3:
                    this._panEnd = this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    break;

                default:
                    this._state = this.STATE.NONE;

            }

        }
        /*
         */
        private touchend( event ) : void {

            if ( this.enabled === false ) return;

            switch ( event.touches.length ) {

                case 1:
                    this._rotateStart = this._rotateEnd = this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    break;

                case 2:
                    this._touchZoomDistanceStart = this._touchZoomDistanceEnd = 0;
                    break;

                case 3:
                    this._panStart = this._panEnd = this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
                    break;

            }

            this._state = this.STATE.NONE;

        }

    }

}
