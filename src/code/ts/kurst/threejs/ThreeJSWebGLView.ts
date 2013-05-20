/// <reference path="../../libs/maps/webgl.d.ts" />
/// <reference path="Detector.ts" />
/// <reference path="TrackballControls.ts" />
/// <reference path="../events/EventDispatcher.ts" />
/**
 * Notes:
 **
 *      var canvas  : HTMLCanvasElement         = <HTMLCanvasElement>document.createElement("canvas");
 *      var context : any                       = this.createCanvas().getContext("experimental-webgl");
 *      var gl      : WebGLRenderingContext     = <WebGLRenderingContext> context;
 *      canvas.getContext('webgl');
 */
/**
 * @author Karim Beyrouti / http://kurst.co.uk 
 */
module kurst.threejs {

    export class ThreeJSWebGLView extends kurst.event.EventDispatcher{

        //------------------------------------------------------------------------

        public renderer             : THREE.WebGLRenderer;
        public scene                : THREE.Scene;
        public camera               : THREE.PerspectiveCamera;
        public container            : HTMLElement;//
        public clearColor           : number = 0x000000;
        public trackControls        : kurst.threejs.TrackballControls;
        public trackControlEnabled  : bool = false;

        //------------------------------------------------------------------------

        private detector            : kurst.threejs.Detector;
        private renderFlag          : bool = false;

        //------------------------------------------------------------------------

        public resizeEvent          : kurst.event.Event = new kurst.event.Event( 'resize' );

        //------------------------------------------------------------------------

        constructor() {

            super();

            this.initThreeJSWebGLView();
            window.addEventListener( 'resize', event => this.onWindowResize( event ) , false );

        }

        //------------------------------------------------------------------------

        /*
         */
        public enableTrackBall( flag : bool ) : void {

            if ( flag ) {

                this.trackControls                       = new kurst.threejs.TrackballControls( this.camera );
                this.trackControls.rotateSpeed           = 1.0;
                this.trackControls.zoomSpeed             = 1.2;
                this.trackControls.panSpeed              = 0.8;
                this.trackControls.noZoom                = false;
                this.trackControls.noPan                 = true;
                this.trackControls.staticMoving          = false;
                this.trackControls.dynamicDampingFactor  = 0.1;
                this.trackControls.zoomSpeed             = 0.45;
                this.trackControls.addEventListener('change', this.controlChange );

            }

            this.trackControlEnabled = flag;
        }
        /*
         */
        public render() : void {

            if ( this.trackControlEnabled ) {

                if ( this.trackControls ) {

                    this.trackControls.update();

                }

            }

            this.renderer.render( this.scene, this.camera );

        }
        /*
         */
        public startRender() : void {

            this.renderFlag = true;

            var updateFunc = () => {

                this.render();

                if( this.renderFlag ) {

                    requestAnimationFrame( updateFunc );

                }


            }

            requestAnimationFrame( updateFunc );

        }
        /*
         */
        public stopRender() : void {

            this.renderFlag = false;

        }

        //------------------------------------------------------------------------

        /*
         */
        private initThreeJSWebGLView() : void {

            this.detector = new kurst.threejs.Detector();

            this.initContainer();
            this.initScene();
            this.initRenderer();
            this.initCamera();

        }
        /*
         */
        private initContainer() : void {

            this.container = document.createElement( 'div' );
            document.body.appendChild( this.container );

        }
        /*
         */
        private initScene() : void {

            this.scene                  = new THREE.Scene();

        }
        /*
         */
        private initRenderer() : void {

            this.renderer               = new THREE.WebGLRenderer( { antialias: true, clearColor: this.clearColor } );
            this.renderer.sortObjects   = false;
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.container.appendChild( <Node> this.renderer.domElement );

        }
        /*
         */
        private initCamera() : void {

            this.camera                 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
            this.camera.position.z      = 1000;

        }

        //------------------------------------------------------------------------

        /*
         */
        private onWindowResize( event ) : void {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.dispatchEvent( this.resizeEvent );

        }
        /*
         */
        private controlChange() : void {}


    }

}