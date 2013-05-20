/// <reference path="../../../kurst/events/EventDispatcher.ts" />
/// <reference path="../../../kurst/utils/JSUtils.ts" />
/// <reference path="../../../libs/maps/three.d.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe.assets {

    //------------------------------------------------------------------------

    export class SunData {

        public textureFlare     : string = "media/textures/flare/bright-sun.png";
        public textureFlare10   : string = "media/textures/flare/flare10.jpg";
        public textureFlare11   : string = "media/textures/flare/flare11.jpg";
        public textureFlare7    : string = "media/textures/flare/flare7.jpg";
        public textureFlare12   : string = "media/textures/flare/flare12.jpg";
        public textureFlare6    : string = "media/textures/flare/flare6.jpg";
        public textureFlare2    : string = "media/textures/flare/flare2.jpg";
        public textureFlare3    : string = "media/textures/flare/flare3.jpg";
        public textureFlare4    : string = "media/textures/flare/flare4.jpg";
        public textureFlare8    : string = "media/textures/flare/flare8.jpg";
        public sunMap           : string = "media/textures/flare/sunmap.png";
        public enableFlare      : bool   = true;

    }

    //------------------------------------------------------------------------

    export class Sun extends kurst.event.EventDispatcher {

        //------------------------------------------------------------------------

        private scene       : THREE.Scene;
        private light       : THREE.PointLight;
        private lensFlare   : THREE.LensFlare;
        private sunData     : apps.globe.assets.SunData;

        //------------------------------------------------------------------------

        constructor( scene : THREE.Scene , light : THREE.PointLight , sunData ? : apps.globe.assets.SunData ) {

            super();

            if ( sunData === undefined ) {

                sunData = new apps.globe.assets.SunData();

            }

            this.sunData    = sunData;
            this.scene      = scene;
            this.light      = light;

            if ( ! kurst.utils.JSUtils.isFireFox() ) { // Lens Flare does not really work in FireFox

                if ( this.sunData.enableFlare) {

                    this.initFlare();

                }

            }

            this.initSun();

        }

        //------------------------------------------------------------------------

        /*
         */
        private initFlare() : void {

            var textureFlare    : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare ) ;//"media/textures/flare/bright-sun.png" );
            var textureFlare10  : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare10 ) ;//"media/textures/flare/flare10.jpg" );
            var textureFlare11  : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare11 ) ;//"media/textures/flare/flare11.jpg" );
            var textureFlare7   : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare7 ) ;//"media/textures/flare/flare7.jpg" );
            var textureFlare12  : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare12 ) ;//"media/textures/flare/flare12.jpg" );
            var textureFlare6   : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare6 ) ;//"media/textures/flare/flare6.jpg" );
            var textureFlare2   : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare2 ) ;//"media/textures/flare/flare2.jpg" );
            var textureFlare3   : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare3 ) ;//"media/textures/flare/flare3.jpg" );
            var textureFlare4   : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare4 ) ;//"media/textures/flare/flare4.jpg" );
            var textureFlare8   : THREE.Texture = THREE.ImageUtils.loadTexture( this.sunData.textureFlare8 ) ;//"media/textures/flare/flare8.jpg" );

            var flareColor      : THREE.Color   = new THREE.Color( 0xffffff );
            var opacity         : number        = .103;

            this.lensFlare = new THREE.LensFlare( undefined , 300, 0, THREE.AdditiveBlending, flareColor );

            this.lensFlare.add( textureFlare, 200, -0.04, THREE.AdditiveBlending ,flareColor,1 );
            this.lensFlare.add( textureFlare10, 160, -0.01, THREE.AdditiveBlending ,flareColor, opacity );
            this.lensFlare.add( textureFlare11, 460, 0, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare7, 360,0, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare12, 100,.1, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare12, 50,.2, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare2, 250,.3, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare6, 150,.58, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare3, 175,.7, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare4, 240,.8, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare8, 100,.9, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare6, 350,1, THREE.AdditiveBlending , flareColor, opacity );
            this.lensFlare.add( textureFlare7, 650,1.5, THREE.AdditiveBlending , flareColor, opacity );

            this.lensFlare.position     = this.light.position;
            this.lensFlare.position.x   -= 500;

            this.scene.add( this.lensFlare );

        }
        /*
         */
        private initSun() : void {

            var sunTexture              = THREE.ImageUtils.loadTexture( this.sunData.sunMap );

            var sunPhong                = new THREE.MeshPhongMaterial(  { map: sunTexture }  );
                sunPhong.emissive       = new THREE.Color( 0xffffff );

            var sunMaterial             = new THREE.MeshLambertMaterial( { map: sunTexture } );
                sunMaterial.ambient     = new THREE.Color( 0xffffff );
                sunMaterial.blending    = THREE.AdditiveBlending;

            var sunGeom                 = new THREE.SphereGeometry( 140 , 16 , 16 );
            var sunMesh                 = new THREE.Mesh( sunGeom  , sunPhong );

            sunMesh.position.x = this.light.position.x + 250;
            sunMesh.position.y = this.light.position.y;
            sunMesh.position.z = this.light.position.z;

            this.scene.add( sunMesh );

        }

    }

}