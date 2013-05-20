/// <reference path="../GlobeView.ts" />
/// <reference path="../../../libs/maps/three.d.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe.assets {

    //------------------------------------------------------------------------

    export class Atmosphere {

        //--------------------------------------------------------------------

        private atmosphereMaterial  : THREE.ShaderMaterial;
        private globeView           : apps.globe.GlobeView;
        private scene               : THREE.Scene;
        private camera              : THREE.PerspectiveCamera;
        private atmosphereMesh      : THREE.Mesh;
        private composer2           : THREE.EffectComposer;
        private renderTarget        : THREE.WebGLRenderTarget;
        private render2Pass         : THREE.RenderPass;
        private finalComposer       : THREE.EffectComposer;
        private renderModel         : THREE.RenderPass;
        private effectBlend         : THREE.ShaderPass;

        //--------------------------------------------------------------------

        constructor( globeView : apps.globe.GlobeView , earth ? : THREE.SphereGeometry ){

            this.globeView = globeView;

            this.atmosphereMaterial = new THREE.ShaderMaterial( {

                uniforms: {

                    "c":   { type: "f", value: 0.4 },
                    "p":   { type: "f", value: 5.0 }

                },

                vertexShader: [

                    "varying vec3 vNormal;",

                    "void main(){",

                        "vNormal = normalize( normalMatrix * normal );",
                        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                    "}"

                ].join("\n"),

                fragmentShader: [

                    "uniform float c;",
                    "uniform float p;",
                    "varying vec3 vNormal;",

                    "void main(){",

                        "float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );",
                        "gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;",

                    "}"

                ].join("\n")
            } );

            this.scene                          = new THREE.Scene();

            this.camera                         = new THREE.PerspectiveCamera( globeView.camera.fov , window.innerWidth / window.innerHeight, 1, 20000 );
            this.camera.position                = globeView.camera.position;
            this.camera.rotation                = globeView.camera.rotation;
            this.scene.add( this.camera );

            this.atmosphereMesh                 = new THREE.Mesh( earth.clone(), this.atmosphereMaterial );
            this.atmosphereMesh.scale.x         = this.atmosphereMesh.scale.y = this.atmosphereMesh.scale.z = 1.2;
            this.atmosphereMesh.material.side   = THREE.BackSide;

            this.scene.add( this.atmosphereMesh );

            var blackMaterial                   = new THREE.MeshBasicMaterial( {color: 0x000000} );
            var sphere                          = new THREE.Mesh(earth.clone(), blackMaterial);
                sphere.scale.x                  = sphere.scale.y = sphere.scale.z = 1;
            this.scene.add(sphere);

            // prepare secondary composer
            var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat, stencilBuffer: false };
            this.renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
            this.composer2 = new THREE.EffectComposer( globeView.renderer , this.renderTarget );
            //this.composer2.

            // prepare the secondary render's passes
            this.render2Pass = new THREE.RenderPass( this.scene , this.camera );
            this.composer2.addPass( this.render2Pass );

            this.finalComposer  = new THREE.EffectComposer( globeView.renderer, this.renderTarget );
            this.renderModel    = new THREE.RenderPass( globeView.scene, globeView.camera );

            this.finalComposer.addPass( this.renderModel );

            this.effectBlend = new THREE.ShaderPass( THREE['AdditiveBlendShader'], "tDiffuse1" );
            this.effectBlend.uniforms[ 'tDiffuse2' ].value = this.composer2.renderTarget2;
            this.effectBlend.renderToScreen = true;
            this.finalComposer.addPass( this.effectBlend );

            globeView.renderer.autoClear = false;
            globeView.renderer.setClearColorHex(0x000000, 0.0);

        }

        //--------------------------------------------------------------------

        /*
         */
        public resize() :  void {

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderTarget.width =window.innerWidth;
            this.renderTarget.height = window.innerHeight;


        }
        /*
         */
        public render() : void {

            this.composer2.render();
            this.finalComposer.render();



        }


    }

}