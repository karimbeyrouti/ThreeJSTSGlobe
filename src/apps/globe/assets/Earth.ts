/// <reference path="../../../kurst/events/EventDispatcher.ts" />
/// <reference path="../../../libs/maps/three.d.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe.assets {

    //------------------------------------------------------------------------

    export class EarthSettings{

        public cloudsMap    : string;
        public earthNormal  : string;
        public earthMap     : string;
        public earthNight   : string;
        public earthAO      : string;
        public normalScale  : number = 2.5;
        public radius       : number = 200;

    }

    //------------------------------------------------------------------------

    export class Earth extends kurst.event.EventDispatcher {

        //------------------------------------------------------------------------

        private scene                   : THREE.Scene;
        private earthMeshMat            : THREE.MeshBasicMaterial;
        private earthNormal             : THREE.ShaderMaterial;
        private materials               : THREE.Material[];
        private earth                   : THREE.Object3D;
        private earthSettings           : EarthSettings;
        private cloudsMaterial          : THREE.MeshLambertMaterial;
        private cloudsTexture           : THREE.Texture;
        private cloudsGeom              : THREE.SphereGeometry;
        private cloudsMesh              : THREE.Mesh;


        //------------------------------------------------------------------------


        public earthGeom               : THREE.SphereGeometry;
        public container                : THREE.Object3D;

        //------------------------------------------------------------------------

        constructor(  scene : THREE.Scene , earthSettings: EarthSettings ) {

            super();

            this.earthSettings  = earthSettings;
            this.scene          = scene;

            this.initEarth();
            this.initClouds();

        }

        //------------------------------------------------------------------------

        /*
         */
        private initClouds() : void {

            this.cloudsTexture              = THREE.ImageUtils.loadTexture( this.earthSettings.cloudsMap );//new //this.earthTexture               = THREE.ImageUtils.loadTexture( 'media/textures/earth_day.jpg' );
            this.cloudsMaterial             = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: this.cloudsTexture, side: THREE.DoubleSide } );

            this.cloudsMaterial.transparent = true;
            this.cloudsMaterial.opacity     = .9;

            this.cloudsGeom                 = new THREE.SphereGeometry( this.earthSettings.radius + 2 , 30 , 30 );
            this.cloudsMesh                 = new THREE.Mesh( this.cloudsGeom  , this.cloudsMaterial );
            this.cloudsMesh.castShadow      = true;
            this.cloudsMesh.receiveShadow   = true;

            this.container.add( this.cloudsMesh );

        }

        /*
         */
        private initEarth() : void {

            var normalTexture : THREE.Texture           = THREE.ImageUtils.loadTexture( this.earthSettings.earthNormal );
            var earthTexture  : THREE.Texture           = THREE.ImageUtils.loadTexture( this.earthSettings.earthMap );

            //*
            var normalTexture : THREE.Texture           = THREE.ImageUtils.loadTexture( this.earthSettings.earthNormal );
            var earthTexture  : THREE.Texture           = THREE.ImageUtils.loadTexture( this.earthSettings.earthMap );

            var shader      : THREE.Shader              = THREE.ShaderLib[ "normalmap" ];
            var uniforms    : THREE.Uniforms            = THREE.UniformsUtils.clone( shader.uniforms );

                uniforms[ "enableAO" ].value            = false;
                uniforms[ "enableDiffuse" ].value       = true;
                uniforms[ "enableSpecular" ].value      = true;
                uniforms[ "enableReflection" ].value    = false;
                uniforms[ "enableDisplacement" ].value  = false;

                uniforms[ "tNormal" ].value             = normalTexture;
                uniforms[ "tDiffuse" ].value            = earthTexture;
                uniforms[ "tSpecular" ].value           = earthTexture;

                uniforms[ "uNormalScale" ].value.set( this.earthSettings.normalScale , this.earthSettings.normalScale );

            this.earthNormal    = new THREE.ShaderMaterial(  {      fragmentShader: shader.fragmentShader,
                                                                    vertexShader: shader.vertexShader,
                                                                    uniforms: uniforms,
                                                                    lights: true,
                                                                    fog: false } );
            //*/


            /*
            var earthMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: earthTexture,
                bumpMap: earthTexture, bumpScale: 4, specular: 0xffffff, emissive: 0x888888 } );
            //*/
            this.earthMeshMat   = new THREE.MeshBasicMaterial( {    color: 0xffffff,
                                                                    wireframe: true,
                                                                    transparent: true,
                                                                    opacity: 0.02,
                                                                    side: THREE.DoubleSide } );

            this.materials = [];
            this.materials.push( this.earthNormal );
            this.materials.push( this.earthMeshMat );

            this.earthGeom = new THREE.SphereGeometry( this.earthSettings.radius , 40 , 30 );
            this.earthGeom.computeTangents();

            this.earth = THREE.SceneUtils.createMultiMaterialObject( this.earthGeom , this.materials );
            this.earth.position.set( 0, 0, 0 );

            this.earth.castShadow = true;
            this.earth.receiveShadow = true;

            this.container = new THREE.Object3D();
            this.container.add( this.earth );

            this.scene.add( this.container );

        }
        /*
         */
        public render() : void {

            this.cloudsMesh.rotation.y += .0001;

        }

    }

}