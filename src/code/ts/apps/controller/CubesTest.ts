/// <reference path="../../libs/maps/three.d.ts" />
/// <reference path="../../kurst/threejs/Detector.ts" />
/// <reference path="../../kurst/threejs/TrackballControls.ts" />

/// <reference path="../../kurst/core/UIBase.ts" />

module threejs {

    export class CubesTest extends kurst.core.UIBase {

        //------------------------------------------------------------------------

        private detector        : kurst.threejs.Detector;
        private controls        : kurst.threejs.TrackballControls;
        private container       : HTMLElement;//
        private camera          : THREE.PerspectiveCamera;
        private scene           : THREE.Scene;
        private renderer        : THREE.WebGLRenderer;
        private offset          : THREE.Vector3 = new THREE.Vector3( 10, 10, 10 );
        private pickingScene    : THREE.Scene;
        private pickingTexture  : THREE.WebGLRenderTarget;
        private pickingGeometry : THREE.Geometry;
        private pickingMaterial : THREE.MeshBasicMaterial;
        private defaultMaterial : THREE.MeshLambertMaterial;
        private pickingData     : Object[] = new Object[];
        private highlightBox    : THREE.Mesh;
        private projector       : THREE.Projector;
        private mouse           : THREE.Vector2 = new THREE.Vector2();

        //------------------------------------------------------------------------

        constructor () {

            super();

            this.detector = new kurst.threejs.Detector();



            if ( ! this.detector.webgl ) {

                console.log('No WebGL Support');

            } else {

                this.container = document.createElement( 'div' );
                document.body.appendChild( this.container );

                this.initCamera();
                this.initControls();
                this.initScene();
                this.initLights();
                this.initTexture();
                this.initObjects();
                this.initRenderer();
                this.startRender();

                window.addEventListener( 'resize',event => this.onWindowResize( event ), false );

            }

        }

        //------------------------------------------------------------------------

        /*
         */
        private initCamera() : void {

            this.camera             = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 20000 );
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
            this.controls.wheelSpeed            = .25;
            this.controls.dynamicDampingFactor  = 0.3;
            this.controls.addEventListener( 'change' , this.controlChange );

        }
        /*
         */
        private initScene() : void {

            this.scene                          = new THREE.Scene();
            this.pickingScene                   = new THREE.Scene();

        }
        /*
         */
        private initLights() : void {

            this.scene.add( new THREE.AmbientLight( 0x555555 ) );

            var light = new THREE.SpotLight( 0xffffff, 1.5 );
                light.position.set( 0, 500, 2000 );
            this.scene.add( light );

        }
        /*
         */
        private initTexture() : void {

            this.pickingTexture                 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
            this.pickingTexture.generateMipmaps = false;

        }
        /*
         */
        private initRenderer() : void {

            this.projector = new THREE.Projector();
            this.renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0xffffff } );
            this.renderer.sortObjects = false;
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.container.appendChild( <Node> this.renderer.domElement );
            this.renderer.domElement.addEventListener( 'mousemove', ( event ) => {this.onMouseMove( event )});

        }
        /*
         */
        private initObjects() : void {

            var geometry : THREE.Geometry = new THREE.Geometry();

            this.pickingGeometry = new THREE.Geometry();
            this.pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
            this.defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors	} );

            for ( var i = 0; i < 5000; i ++ ) {

                var position : THREE.Vector3 = new THREE.Vector3();

                    position.x = Math.random() * 10000 - 5000;
                    position.y = Math.random() * 6000 - 3000;
                    position.z = Math.random() * 8000 - 4000;

                var rotation : THREE.Vector3= new THREE.Vector3();

                    rotation.x = Math.random() * 2 * Math.PI;
                    rotation.y = Math.random() * 2 * Math.PI;
                    rotation.z = Math.random() * 2 * Math.PI;

                var scale : THREE.Vector3= new THREE.Vector3();

                    scale.x = Math.random() * 200 + 100;
                    scale.y = Math.random() * 200 + 100;
                    scale.z = Math.random() * 200 + 100;

                // give the geom's vertices a random color, to be displayed
                var geom : THREE.CubeGeometry= new THREE.CubeGeometry( 1, 1, 1 );
                var color : THREE.Color= new THREE.Color( Math.random() * 0xffffff );

                this.applyVertexColors( geom, color );

                var cube : THREE.Mesh = new THREE.Mesh( geom );
                    cube.position.copy( position );
                    cube.rotation.copy( rotation );
                    cube.scale.copy( scale );

                THREE.GeometryUtils.merge( geometry, cube );

                //give the pickingGeom's vertices a color corresponding to the "id"

                var pickingGeom : THREE.CubeGeometry = new THREE.CubeGeometry( 1, 1, 1 );
                var pickingColor : THREE.Color = new THREE.Color( i );
                this.applyVertexColors( pickingGeom, pickingColor );

                var pickingCube : THREE.Mesh = new THREE.Mesh( pickingGeom );
                    pickingCube.position.copy( position );
                    pickingCube.rotation.copy( rotation );
                    pickingCube.scale.copy( scale );

                THREE.GeometryUtils.merge( this.pickingGeometry, pickingCube );

                this.pickingData[ i ] = {

                    position: position,
                    rotation: rotation,
                    scale: scale

                };

            }

            var drawnObject : THREE.Mesh = new THREE.Mesh( geometry, this.defaultMaterial );
            this.scene.add( drawnObject );

            this.pickingScene.add( new THREE.Mesh( this.pickingGeometry, this.pickingMaterial ) );

            this.highlightBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color: 0xffff00 } ) );
            this.scene.add( this.highlightBox );

        }
        /*
         */
        private applyVertexColors( g : THREE.Geometry , c : THREE.Color ) : void {

            g.faces.forEach( function( f ) {

                var n = ( f instanceof THREE.Face3 ) ? 3 : 4;

                for( var j = 0; j < n; j ++ ) {

                    f.vertexColors[ j ] = c;

                }

            } );

        }
        /*
         */
        private pick() : void {

            //render the picking scene off-screen
            this.renderer.render( this.pickingScene, this.camera, this.pickingTexture );

            var gl : WebGLRenderingContext = this.renderer.getContext();

            //read the pixel under the mouse from the texture
            var pixelBuffer = new Uint8Array( 4 );
            gl.readPixels( this.mouse.x, this.pickingTexture.height - this.mouse.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBuffer );

            //interpret the pixel as an ID

            var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
            var data : any = this.pickingData[ id ];

            if ( data ) {

                //move our highlightBox so that it surrounds the picked object

                if ( data.position && data.rotation && data.scale ){

                    this.highlightBox.position.copy( data.position );
                    this.highlightBox.rotation.copy( data.rotation );
                    this.highlightBox.scale.copy( data.scale ).add( this.offset );
                    this.highlightBox.visible = true;

                }

            } else {

                this.highlightBox.visible = false;

            }

        }
        /*
         */
        private startRender() : void {

            var updateFunc = () => {

                this.render();
                requestAnimationFrame(updateFunc);

            }

            requestAnimationFrame(updateFunc);

        }
        /*
         */
        private render() : void {

            var timer               = Date.now() * 0.0001;
            this.controls.update();

            this.pick();

            this.renderer.render( this.scene, this.camera );

        }

        //------------------------------------------------------------------------

        /*
         */
        private onMouseMove( e ) : void {

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

        }
        /*
         */
        private controlChange( event ) : void {

            //console.log('controlChange'); // Test for EventDispatcher/**/

        }
        /*
        */
        private onWindowResize( event ): void  {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );

        }

    }

}