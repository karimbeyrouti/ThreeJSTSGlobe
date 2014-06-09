/// <reference path="../events/EventDispatcher.ts" />
/// <reference path="JSonLoader.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module kurst.data {

    //------------------------------------------------------------------------------------------

    export class GeoData {

        public statusCode       : string ;// "OK",
        public statusMessage    : string ;// "",
        public ipAddress        : string ;//"81.97.40.44",
        public countryCode      : string;// "GB",
        public countryName      : string;//"UNITED KINGDOM",
        public regionName       : string ;//"ENGLAND",
        public cityName         : string;//"STOKE-ON-TRENT",
        public zipCode          : string;//"-",
        public latitude         : number;// "53.0042",
        public longitude        : number ;//"-2.18538",
        public timeZone         : string;// "+01:00"

    }

    //------------------------------------------------------------------------------------------

}