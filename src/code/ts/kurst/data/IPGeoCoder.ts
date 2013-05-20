/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="JSonLoader.ts" />
/// <reference path="GeoData.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module kurst.data {

    //------------------------------------------------------------------------------------------

    export class IPGeoCoder  extends kurst.event.EventDispatcher{

        //------------------------------------------------------------------------

        private apikey      : string;
        private jsonLoader  : JSonLoader;
        private useProxy    : bool = true;
        private proxy       : string = 'proxy.php';
        private proxyParam  : string = 'url';
        private data        : GeoData;

        //------------------------------------------------------------------------

        public LOAD_SUCCESS : kurst.event.Event = new kurst.event.Event('IPGeoCoder_loaded');
        public LOAD_ERROR   : kurst.event.Event = new kurst.event.Event('IPGeoCoder_loadfailed');

        //------------------------------------------------------------------------

        constructor( apikey : string ) {

            super();

            this.apikey = apikey;
            this.jsonLoader = new kurst.data.JSonLoader();

            this.jsonLoader.addEventListener( this.jsonLoader.LOAD_ERROR.type , ( event ) => this.jsonLoadFail() );
            this.jsonLoader.addEventListener( this.jsonLoader.LOAD_SUCCESS.type , ( event ) => this.jsonLoaded() );

        }

        //------------------------------------------------------------------------

        /*
         */
        public locateIP( ip : string ) : void {

            var uri : string = 'http://api.ipinfodb.com/v3/ip-city/?key=' + this.apikey + '&ip=' + ip + '&format=json';

            if ( this.useProxy ) {

                uri = this.proxy + '?' + this.proxyParam + '=' + encodeURIComponent( uri );

            }

            this.jsonLoader.loadJson( uri );


        }
        /*
         */
        public enableProxy( flag : bool , uri : string , param : string ) : void {

            this.useProxy   = flag;
            this.proxy      = uri;
            this.proxyParam = param;

        }
        /*
         */
        public getLocationData() : GeoData {

            return this.data;

        }

        //------------------------------------------------------------------------

        /*
         */
        private jsonLoaded() : void {

            var json : Object = this.jsonLoader.getData();

            this.data                  = new kurst.data.GeoData();
            this.data.statusCode       = json['statusCode'];
            this.data.statusMessage    = json['statusMessage'];
            this.data.ipAddress        = json['ipAddress'];
            this.data.countryCode      = json['countryCode'];
            this.data.countryName      = json['countryName'];
            this.data.regionName       = json['regionName'];
            this.data.cityName         = json['cityName'];
            this.data.zipCode          = json['zipCode'];
            this.data.latitude         = parseFloat( json['latitude'] );
            this.data.longitude        = parseFloat( json['longitude'] );
            this.data.timeZone         = json['timeZone'];

            this.dispatchEvent( this.LOAD_SUCCESS );

        }
        /*
         */
        private jsonLoadFail() : void {

            this.dispatchEvent( this.LOAD_ERROR );

        }

    }

    //------------------------------------------------------------------------------------------

}