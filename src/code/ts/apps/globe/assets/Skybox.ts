/// <reference path="../../../kurst/events/EventDispatcher.ts" />
/// <reference path="../../../libs/maps/three.d.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe.assets {

    //------------------------------------------------------------------------

    export class SkyboxData {

        public size : number = 4000;

        public path : string;
        public format : string;

        public posx : string;
        public negx : string;

        public posy : string;
        public negy : string;

        public posz : string;
        public negz : string;

    }

    //------------------------------------------------------------------------

    export class Skybox extends kurst.event.EventDispatcher {

        //------------------------------------------------------------------------

        private scene       : THREE.Scene;
        private data        : SkyboxData;

        //------------------------------------------------------------------------

        public textureCube  : THREE.Texture;
        public materialCube : THREE.ShaderMaterial;
        public cubeMesh     : THREE.Mesh;
        public cubeGeom     : THREE.CubeGeometry;

        //------------------------------------------------------------------------

        constructor( scene : THREE.Scene , data : SkyboxData ) {

            super();

            this.data   = data;
            this.scene  = scene;

            this.init();

        }

        //------------------------------------------------------------------------

        /*
         */
        private init() : void {

            var urls = [

                this.data.path + this.data.posx + this.data.format, this.data.path + this.data.negx + this.data.format,
                this.data.path + this.data.posy + this.data.format, this.data.path + this.data.negy + this.data.format,
                this.data.path + this.data.posz + this.data.format, this.data.path + this.data.negz + this.data.format

            ];

            this.textureCube = THREE.ImageUtils.loadTextureCube( urls );

            var shader = THREE.ShaderLib[ "cube" ];
                shader.uniforms[ "tCube" ].value = this.textureCube;

            this.materialCube = new THREE.ShaderMaterial( {

                fragmentShader: shader.fragmentShader,
                vertexShader:   shader.vertexShader,
                uniforms:       shader.uniforms,
                depthWrite:     false,
                side:           THREE.BackSide

            } );

            this.cubeGeom = new THREE.CubeGeometry( this.data.size , this.data.size , this.data.size );
            this.cubeMesh = new THREE.Mesh( this.cubeGeom , this.materialCube );
            this.scene.add( this.cubeMesh );

        }

    }

}