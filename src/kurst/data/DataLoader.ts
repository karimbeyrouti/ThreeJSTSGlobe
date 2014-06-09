/// <reference path="../events/EventDispatcher.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module kurst.data {

    export class DataLoader extends kurst.event.EventDispatcher {

        //--------------------------------------------------------------------------

        private loader              : XMLHttpRequest;
        private data                : string;

        //------------------------------------------------------------------------

        public LOAD_SUCCESS : kurst.event.Event = new kurst.event.Event('DataSender_loaded');
        public LOAD_ERROR   : kurst.event.Event = new kurst.event.Event('DataSender_loadfailed');

        //--------------------------------------------------------------------------

        constructor( ) {

            super();
            this.loader                 = new XMLHttpRequest();

        }

        //--------------------------------------------------------------------------

        /*
         * Load a JSON data file
         */
        public loadData( uri : string ) : void {

            if ( ! this.loader ) {

                this.loader = new XMLHttpRequest();

            }

            var controller : DataLoader = this;

            this.loader.open( 'GET' , uri , true );
            this.loader.onload  = function ( event ) { controller.onLoadComplete( event ); }
            this.loader.onerror = function ( event ) { controller.onLoadError( event ); }
            this.loader.responseType = 'text';

            this.loader.send();


        }
        /*
         * Get data
         */
        public getData() : string {

            return this.data;

        }

        //--------------------------------------------------------------------------

        /*
         * Data load completed
         */
        private onLoadComplete( event ) {

            var xhr : XMLHttpRequest    = event['currentTarget'];

            try {

                this.data             = xhr.responseText;

                this.dispatchEvent( this.LOAD_SUCCESS );

            } catch ( e ) {

                this.data             = xhr.responseText;
                this.dispatchEvent( this.LOAD_ERROR );

            }

        }
        /*
         * Data load error
         */
        private onLoadError( event ) {

            var xhr : XMLHttpRequest = event['currentTarget'];
                xhr.abort();

            this.dispatchEvent( this.LOAD_ERROR );

        }

    }

}


