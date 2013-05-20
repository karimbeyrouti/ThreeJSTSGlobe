/// <reference path="../events/EventDispatcher.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module kurst.data {

    export class JSonLoader extends kurst.event.EventDispatcher {

        //--------------------------------------------------------------------------

        private loader              : XMLHttpRequest;
        private jsonData            : Object;
        private jsonString          : string;

        //--------------------------------------------------------------------------

        public LOAD_SUCCESS         : kurst.event.Event = new kurst.event.Event('JSonLoader_loaded');
        public LOAD_ERROR           : kurst.event.Event = new kurst.event.Event('JSonLoader_loaderror');

        //--------------------------------------------------------------------------

        constructor( ) {

            super();

            this.loader                 = new XMLHttpRequest();

        }

        //--------------------------------------------------------------------------

        /*
         * Load a JSON data file
         */
        public loadJson( uri : string ) : void {

            if ( ! this.loader ) {

                this.loader = new XMLHttpRequest();

            }

            var controller : JSonLoader = this;

            this.loader.open( 'GET' , uri , true );
            this.loader.onload  = function ( event ) { controller.onLoadComplete( event ); }
            this.loader.onerror = function ( event ) { controller.onLoadError( event ); }
            this.loader.responseType = 'text';

            this.loader.send();


        }
        /*
         * Get JSON data
         */
        public getData() : Object {

            return this.jsonData;

        }
        /*
         * Get RAW JSON string
         */
        public getJSONString() : string {

            return this.jsonString;

        }
        /*
         * Set Callback

        public setLoadCallback( target : Object , loadedCallback : Function , loadErrorCallback ? : Function ) : void {

            this.target                 = target;
            this.loadedCallback         = loadedCallback;
            this.loadErrorCallback      = loadErrorCallback;

        }
         */
        //--------------------------------------------------------------------------

        /*
         * Data load completed
         */
        private onLoadComplete( event ) {

            var xhr : XMLHttpRequest    = event['currentTarget'];

            try {

                this.jsonData               = JSON.parse( xhr.responseText );
                this.jsonString             = xhr.responseText;

                this.dispatchEvent( this.LOAD_SUCCESS );

                /*
                if ( this.loadedCallback ){

                    this.loadedCallback.apply( this.target );

                }
                */

            } catch ( e ) {

                this.jsonString             = xhr.responseText;

                this.dispatchEvent( this.LOAD_ERROR );
                /*
                if ( this.loadErrorCallback ){

                    this.loadErrorCallback.apply( this.target );

                }
                */
            }

        }
        /*
         * Data load error
         */
        private onLoadError( event ) {

            var xhr : XMLHttpRequest = event['currentTarget'];
                xhr.abort();

            this.dispatchEvent( this.LOAD_ERROR );

            /*
            if ( this.loadErrorCallback ){

                this.loadErrorCallback.apply( this.target );

            }
            */

        }

    }

}


