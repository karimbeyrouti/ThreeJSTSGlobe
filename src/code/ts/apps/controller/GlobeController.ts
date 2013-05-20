/// <reference path="../globe/GlobeView.ts" />
/// <reference path="../../kurst/core/UIBase.ts" />
/// <reference path="../../kurst/data/IPGeoCoder.ts" />
/// <reference path="../../kurst/data/DataLoader.ts" />
/// <reference path="../../kurst/utils/CookiesUtil.ts" />
/// <reference path="../../kurst/threejs/Detector.ts" />
/// <reference path="../../kurst/data/DataSender.ts" />

/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */

module apps.controller {

    export class GlobeController extends kurst.core.UIBase {

        //------------------------------------------------------------------------------

        private detector        : kurst.threejs.Detector;
        private globe           : apps.globe.GlobeView;
        private ipGeoCoder      : kurst.data.IPGeoCoder;
        private ipLoader        : kurst.data.DataLoader;
        private ipSender        : kurst.data.DataSender;
        private ipGroupLoader   : kurst.data.DataLoader;

        //------------------------------------------------------------------------------

        private debug           : bool      = false;
        private geoCookieName   : string    = 'GeoCookie_dataSent';

        //------------------------------------------------------------------------------

        private IPGeoCoderKEY   : string = ''; // API Key from - http://ipinfodb.com/

        //------------------------------------------------------------------------------

        constructor(){

            super();

            this.detector = new kurst.threejs.Detector();

            if( this.detector.webgl ) {

                // Globe View
                this.globe = new apps.globe.GlobeView();

                //---------------------------------
                // IP Geo Coder ( Geo locate an IP address )

                this.ipGeoCoder = new kurst.data.IPGeoCoder( this.IPGeoCoderKEY );
                this.ipGeoCoder.addEventListener( this.ipGeoCoder.LOAD_ERROR.type, ( event ) => this.onGeoCodeInfoLoadError() );
                this.ipGeoCoder.addEventListener( this.ipGeoCoder.LOAD_SUCCESS.type , ( event ) => this.onGeoCodeInfoLoaded() ) ;

                //---------------------------------
                // DataLoader - Get user's IP ( from Php )

                //if (  kurst.utils.CookiesUtil.get( this.geoCookieName ) !== 'true') {

                    this.ipLoader = new kurst.data.DataLoader();
                    this.ipLoader.addEventListener( this.ipLoader.LOAD_ERROR.type , ( event ) => this.ipLoadFailed () );
                    this.ipLoader.addEventListener( this.ipLoader.LOAD_SUCCESS.type, ( event ) => this.ipLoaded () );
                    this.ipLoader.loadData( 'getIP.php?' + String( Math.random() ) );

                //}

                //---------------------------------
                // Data Loader - Load stored IP addresses

                this.ipGroupLoader = new kurst.data.DataLoader();
                this.ipGroupLoader.addEventListener( this.ipGroupLoader.LOAD_ERROR.type , ( event ) => this.ipGroupDataLoadFailed () );
                this.ipGroupLoader.addEventListener( this.ipGroupLoader.LOAD_SUCCESS.type, ( event ) => this.ipGroupDataLoaded () );
                this.ipGroupLoader.loadData( 'data.txt?' + String( Math.random() ) );

            } else {

                this.detector.addGetWebGLMessage();// No WebGL support

            }

        }

        //------------------------------------------------------------------------------

        /*
         * User's IP Address Loaded
         */
        private ipLoaded() {

            if ( this.debug ) {

                this.ipGeoCoder.locateIP( '81.97.40.44' );

            } else {

                this.ipGeoCoder.locateIP( this.ipLoader.getData() );

            }

        }
        /*
         * Users IP Geo located
         */
        private onGeoCodeInfoLoaded () {

            var locationData : kurst.data.GeoData = this.ipGeoCoder.getLocationData();

            //if (  kurst.utils.CookiesUtil.get( this.geoCookieName ) !== 'true') {

                this.ipSender = new kurst.data.DataSender();

                var formData : FormData = new FormData();
                    formData.append( 'lat' , String( locationData.latitude ) );
                    formData.append( 'long' , String( locationData.longitude ) );
                    formData.append( 'country' , String( locationData.countryName) );
                    formData.append( 'city' , String( locationData.cityName ) );

                this.ipSender.sendData( 'saveData.php' , formData );

               // kurst.utils.CookiesUtil.set( this.geoCookieName , 'true' );


            //}

            this.globe.addMarker( locationData );


        }
        /*
         * Saved IP addresses data loaded
         */
        private ipGroupDataLoaded() {

            var loadedData      : String = this.ipGroupLoader.getData();
            var loadedDataArray : Object[] = loadedData.split( '\n');
            var l               : number = loadedDataArray.length;
            var entry           : Object[];
            var locationData    : kurst.data.GeoData = new kurst.data.GeoData();
            var str             : string;

            for ( var c : number = 0 ; c < l ; c++ ){

                str         = <string> loadedDataArray[c];
                entry       = str.split('|');

                locationData.longitude      = <number> entry[0];
                locationData.latitude       = <number> entry[1] ;
                locationData.countryName    = <string >  entry[2];
                locationData.cityName       = <string > entry[3];

                this.globe.addMarker( locationData );

            }

        }
        /*
         */
        private onGeoCodeInfoLoadError () {}
        /*
         */
        private ipLoadFailed() {}
        /*
         */
        private ipGroupDataLoadFailed() {}

    }

}
