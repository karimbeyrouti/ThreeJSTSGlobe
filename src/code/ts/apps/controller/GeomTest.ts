/// <reference path="../../libs/maps/three.d.ts" />
/// <reference path="../../kurst/threejs/Detector.ts" />
/// <reference path="../../kurst/threejs/TrackballControls.ts" />
/// <reference path="../../kurst/core/UIBase.ts" />

module threejs {

    export class GeomTest extends kurst.core.UIBase {

        //------------------------------------------------------------------------

        private detector    : kurst.threejs.Detector;
        private controls    : kurst.threejs.TrackballControls;
        private container   : HTMLElement;//
        private camera      : THREE.PerspectiveCamera;
        private scene       : THREE.Scene;
        private renderer    : THREE.WebGLRenderer;
        private light       : THREE.DirectionalLight;
        private object      : THREE.Object3D;
        private materials   : THREE.Material[];
        private map         : THREE.Texture;

        //------------------------------------------------------------------------

        constructor () {

            super();

            this.detector = new kurst.threejs.Detector();

            if ( ! this.detector.webgl ) {

                console.log('No WebGL Support');

            } else {

                this.container          = document.createElement( 'div' );
                document.body.appendChild( this.container );

                this.initCamera();
                this.initControls();
                this.initScene();
                this.initTexture();
                this.initObjects();
                this.initRenderer();
                this.startRender();

                var controller : GeomTest = this;
                window.addEventListener( 'resize',event => this.onWindowResize( event ), false );

            }

        }

        //------------------------------------------------------------------------

        /*
         */
        private initCamera() : void {

            this.camera             = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
            this.camera.position.z  = 1000;

        }
        /*
         */
        private initControls() : void {

            this.controls                       = new kurst.threejs.TrackballControls( this.camera );
            this.controls.rotateSpeed           = 1.0;
            this.controls.zoomSpeed             = 1.2;
            this.controls.panSpeed              = 0.8;
            this.controls.noZoom                = false;
            this.controls.noPan                 = false;
            this.controls.staticMoving          = true;
            this.controls.dynamicDampingFactor  = 0.3;
            this.controls.addEventListener('change', this.controlChange );

        }
        /*
         */
        private initScene() : void {

            this.scene                          = new THREE.Scene();

            this.light                          = new THREE.DirectionalLight();
            this.light.position.set( 0, 1, 0 );
            this.scene.add( this.light );
        }
        /*
         */
        private initTexture() : void {


            this.map                     = THREE.ImageUtils.loadTexture( 'media/textures/ash_uvgrid01.jpg' );
            this.map.wrapS               = this.map.wrapT = THREE.RepeatWrapping;
            this.map.anisotropy          = 16;

            this.materials               = [];
            this.materials.push( new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: this.map, side: THREE.DoubleSide } ) );
            this.materials.push( new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1, side: THREE.DoubleSide } ) );


        }
        /*
         */
        private initRenderer() : void {

            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.container.appendChild( <Node> this.renderer.domElement );

        }
        /*
         */
        private initObjects() : void {


            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.SphereGeometry( 75, 20, 10 ), this.materials );
            this.object.position.set( -400, 0, 200 );
            this.scene.add( this.object );

            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.IcosahedronGeometry( 75, 1 ), this.materials );
            this.object.position.set( -200, 0, 200 );
            this.scene.add( this.object );

            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.OctahedronGeometry( 75, 2 ), this.materials );
            this.object.position.set( 0, 0, 200 );
            this.scene.add( this.object );

            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.TetrahedronGeometry( 75, 0 ), this.materials );
            this.object.position.set( 200, 0, 200 );
            this.scene.add( this.object );

            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.PlaneGeometry( 100, 100, 4, 4 ), this.materials );
            this.object.position.set( -400, 0, 0 );
            this.scene.add( this.object );

            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.CubeGeometry( 100, 100, 100, 4, 4, 4 ), this.materials );
            this.object.position.set( -200, 0, 0 );
            this.scene.add(this.object );

            this.object = THREE.SceneUtils.createMultiMaterialObject( new THREE.CircleGeometry( 50, 20, 0, Math.PI * 2 ), this.materials );
            this.object.position.set( 0, 0, 0 );
            this.scene.add( this.object );


        }

        //------------------------------------------------------------------------

        /*
         */
        private startRender() : void {

            var updateFunc = () => {

                this.render();
                requestAnimationFrame( updateFunc );

            }

            requestAnimationFrame( updateFunc );

        }
        /*
         */
        private controlChange( event ) : void {

            //console.log('controlChange'); // Test for EventDispatcher/**/

        }
        /*
        */
        private onWindowResize( event ) {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );

        }
        /*
         */
        private render() {

            var timer               = Date.now() * 0.0001;
            this.controls.update();

            for ( var i = 0, l = this.scene.children.length; i < l; i ++ ) {

                var object = this.scene.children[ i ];

                object.rotation.x = timer * 5;
                object.rotation.y = timer * 2.5;

            }

            this.renderer.render( this.scene, this.camera );

        }

    }

}