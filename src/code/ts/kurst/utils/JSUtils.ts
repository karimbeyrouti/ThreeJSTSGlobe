/// <reference path="../../libs/maps/jquery.d.ts" />
/// <reference path="../../libs/maps/ax.d.ts" />

/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */

module kurst.utils {

    export class JSUtils{

        //--------------------------------------------------------------------------


        /*
         */
        static isFireFox() : bool{

            return ( navigator.userAgent.search("Firefox") != -1 );


        }

        /*
         */
        static isIE() : bool{

            return ( navigator.appVersion.indexOf("MSIE") != -1 );


        }
        /*
         */
        static getIEVersion() : number {

            if ( JSUtils.isIE() ){

                return parseFloat( navigator.appVersion.split( "MSIE" )[1] );

            }

            return -1;

        }
        /*
         */
        static isFlashEnabled() : bool {

            if( JSUtils.isIE() ) {

                var version : number = JSUtils.getIEVersion();

                if ( version > 8 ) {

                    return ( window['ActiveXObject'] && ( new ActiveXObject("ShockwaveFlash.ShockwaveFlash") ) != false );

                } else {

                    try {

                        var aXObj = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' );

                        if ( aXObj ){

                            return true;

                        }

                        return false;

                    } catch ( ex ) {

                        return false;

                    }

                }

                return false;

            } else {

                return ((typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object")  != false );

            }

        }

    }

}

