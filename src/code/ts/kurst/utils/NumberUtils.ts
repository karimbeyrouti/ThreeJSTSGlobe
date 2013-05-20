/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */

module kurst.utils {

    export class NumberUtils{

        //--------------------------------------------------------------------------

        /*
         */
        static rgbToHex ( rgb : string ) {

            var rgbRegex : RegExp = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
            var result, r, g, b, hex = "";

            if ( ( result = rgbRegex['exec']( rgb ) ) ) {

                r   = kurst.utils.NumberUtils.componentFromStr( result[ 1 ] , result[ 2 ] );
                g   = kurst.utils.NumberUtils.componentFromStr( result[ 3 ] , result[ 4 ] );
                b   = kurst.utils.NumberUtils.componentFromStr( result[ 5 ] , result[ 6 ] );

                hex = "#" + ( 0x1000000 + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice( 1 );

            }
            return hex;

        }
        /*
         */
        static componentFromStr ( numStr , percent ) {

            var num = Math.max( 0 , parseInt( numStr , 10 ) );
            return percent ? Math.floor( 255 * Math.min( 100 , num ) / 100 ) : Math.min( 255 , num );

        }

    }

}


