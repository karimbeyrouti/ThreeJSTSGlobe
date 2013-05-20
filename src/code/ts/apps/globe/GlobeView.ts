/// <reference path="../../kurst/threejs/OrbitControls.ts" />
/// <reference path="../../kurst/data/GeoData.ts" />
/// <reference path="../../kurst/threejs/ThreeJSWebGLView.ts" />
/// <reference path="../../libs/maps/three.d.ts" />
/// <reference path="assets/Earth.ts" />
/// <reference path="assets/Atmosphere.ts" />
/// <reference path="assets/Skybox.ts" />
/// <reference path="assets/StarField.ts" />
/// <reference path="assets/Sun.ts" />
/// <reference path="assets/SkyGrid.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe {

    export class GlobeView extends kurst.threejs.ThreeJSWebGLView {

        //------------------------------------------------------------------------

        private orbitControl    : kurst.threejs.OrbitControls;
        private atmos           : apps.globe.assets.Atmosphere;
        private earth           : apps.globe.assets.Earth;
        private skybox          : apps.globe.assets.Skybox;
        private earthSettings   : apps.globe.assets.EarthSettings;
        private markers         : apps.globe.MarkerVO[];
        private starField       : apps.globe.assets.StarField;
        private sun             : apps.globe.assets.Sun;
        private skyGrid         : apps.globe.assets.SkyGrid;
        private defaultMarker   : MarkerSettings;
        private ambientLight    : THREE.AmbientLight;
        private pointLight      : THREE.PointLight;
        private composer        : THREE.EffectComposer;
        private markerCounter   : number = 0;

        //------------------------------------------------------------------------

        constructor() {

            super();

            this.markers                    = [];

            this.defaultMarker              = new apps.globe.MarkerSettings();
            this.defaultMarker.material     = <THREE.Material> new THREE.MeshBasicMaterial( { color: 0xffea00 } );
            this.defaultMarker.geom         = <THREE.Geometry> new THREE.TetrahedronGeometry( .8 , 2 );

            this.initGlobeView();
            this.addEventListener( this.resizeEvent.type , ( event ) => this.onResizeHandler( event ));

        }

        //------------------------------------------------------------------------

        /*
         * Add a marker at the specified geo coordinated
         */
        public addMarker( data : kurst.data.GeoData , marker ? : MarkerSettings ) : void {

            if ( data.latitude === 0 || data.longitude === 0 || data.longitude === undefined || data.latitude === undefined){

                return ;

            }

            if ( marker === undefined ) {

                marker =  this.defaultMarker;

            }

            var mesh : THREE.Mesh   = new THREE.Mesh( marker.geom, <THREE.MeshBasicMaterial> marker.material );
                mesh.position       = this.translateGeoCoords( data.latitude , data.longitude , this.earthSettings.radius + 5 );
                mesh.lookAt( this.earth.container.position );

            var markerVO : MarkerVO = new MarkerVO();
                markerVO.id       = this.markerCounter ++;
                markerVO.mesh     = mesh;
                markerVO.data     = data;

            this.markers.push( markerVO );
            this.earth.container.add( mesh );

        }

        //------------------------------------------------------------------------

        /*
         * Translate Lat / Long to Vector3
         */
        private translateGeoCoords( latitude : number , longitude : number , radius : number ) : THREE.Vector3 {

            var phi     = ( latitude ) * Math.PI / 180;
            var theta   = ( longitude - 180 ) * Math.PI / 180;

            var x       = -( radius ) * Math.cos( phi ) * Math.cos( theta );
            var y       = ( radius ) * Math.sin( phi );
            var z       = ( radius ) * Math.cos( phi ) * Math.sin( theta );

            return new THREE.Vector3( x , y , z );

        }
        /*
         * Render the globe
         */
        private render() : void {

            this.earth.container.rotation.y += .0006;
            this.earth.render();
            this.orbitControl.update();
            this.renderer.render( this.scene, this.camera );

            if ( this.composer ){
                this.renderer.clear();
                this.composer.render( .015 );
            }

            if ( this.atmos ){
                this.atmos.render();
            }

            if ( this.composer ){
                this.composer.render();
            }

        }

        //------------------------------------------------------------------------

        /*
         */
        private initGlobeView() : void {

            this.initLights();
            this.initLensFlare();
            this.initEarth();
            this.initSkybox();
            this.startRender();
            this.initStarField();
            this.initOrbitControls();
            this.initAtmosphere();

            //this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0125 );
            this.scene.fog = new THREE.FogExp2( 0xffffff, 0.0007 );

            /*
            var renderModel = new THREE.RenderPass( this.scene, this.camera );
            var effectBloom = new THREE.BloomPass( 1.15 , 15 );
            var effectCopy = new THREE.ShaderPass( THREE['CopyShader'] );
            effectCopy.renderToScreen = true;
            this.composer = new THREE.EffectComposer( this.renderer );
            this.composer.addPass( renderModel );
            this.composer.addPass( effectBloom );
            this.composer.addPass( effectCopy );
            //*/

        }
        /*
         * Initialise the Atmosphere
         */
        private initAtmosphere() : void {

            this.atmos = new apps.globe.assets.Atmosphere( <GlobeView> this , this.earth.earthGeom );

        }
        /*
         * Initialise the Orbit controls
         */
        private initOrbitControls(): void {

            this.orbitControl                   = new kurst.threejs.OrbitControls( this.camera );
            this.orbitControl.autoRotate        = true;
            this.orbitControl.autoRotateSpeed   = .15;
            this.orbitControl.maxDistance       = 2500;
            this.orbitControl.minDistance       = 600;

        }
        /*
         * Initialise the Lens Flare
         */
        private initLensFlare( ) : void {

            this.sun = new apps.globe.assets.Sun( this.scene , this.pointLight );

        }
        /*
         * Initialise the SkyBox
         */
        private initSkybox() : void {

            var data : apps.globe.assets.SkyboxData = new apps.globe.assets.SkyboxData();
                data.path   = 'media/textures/skybox/';
                data.format = '.jpg';
                data.posx   = 'spacescape_right1';
                data.negx   = 'spacescape_left2';
                data.posy   = 'spacescape_top3'
                data.negy   = 'spacescape_bottom4';
                data.posz   = 'spacescape_front5';
                data.negz   = 'spacescape_back6';

            this.skybox     = new apps.globe.assets.Skybox( this.scene , data );
            this.skyGrid    = new apps.globe.assets.SkyGrid(  this.scene );

        }
        /*
         * Initialise the Lights
         */
        private initLights() : void {

            this.ambientLight = new THREE.AmbientLight( 0x444444 );

            this.scene.add( this.ambientLight  );

            this.pointLight = new THREE.PointLight( 0xffffff, 3 , 3000);
            this.pointLight.lookAt( new THREE.Vector3(0,0,0) );
            this.pointLight.position.set( 2800, 0, 0 );

            this.scene.add( this.pointLight );

        }
        /*
         * Initialise the Star Field
         */
        private initStarField() : void {

            this.starField = new apps.globe.assets.StarField( this.scene );

        }
        /*
         * Initialise the Earth Globe
         */
        private initEarth() : void {

            this.earthSettings                  = new apps.globe.assets.EarthSettings();
            this.earthSettings.earthMap         = 'media/textures/earth_day.jpg';
            this.earthSettings.earthNight       = 'media/textures/earth_night.jpg';
            this.earthSettings.earthNormal      = 'media/textures/earth_normal.jpg';
            this.earthSettings.cloudsMap        = 'media/textures/earth_clouds.png';
            this.earthSettings.earthAO          = 'media/textures/earth_normal_OCC.png';

            this.earth                          = new apps.globe.assets.Earth( this.scene , this.earthSettings );

        }

        //------------------------------------------------------------------------

        /*
         * Resize Event Handler
         */
        private onResizeHandler( event ) : void {

            if ( this.atmos ){

                this.atmos.resize();

            }

        }


    }

    //------------------------------------------------------------------------

    export class MarkerSettings {

        public geom         : THREE.Geometry;
        public material     : THREE.Material;

    }

    //------------------------------------------------------------------------

    export class MarkerVO {

        public id       : number;
        public mesh     : THREE.Mesh;
        public data     : kurst.data.GeoData;

    }

}