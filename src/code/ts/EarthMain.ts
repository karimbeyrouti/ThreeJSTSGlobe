/// <reference path="apps/controller/GlobeController.ts" />
// <reference path="apps/globe/GlobeView.ts" />

/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module Main {

    //--------------------------------------------------------------

    var globeController : apps.controller.GlobeController;

    //--------------------------------------------------------------

    export function start() {

        globeController = new apps.controller.GlobeController();// Start Application

    }


}

//--------------------------------------------------------------

function onWindowLoad( event ) { Main.start();}
function onWindowError( event ) {}

//--------------------------------------------------------------

window.onload  = onWindowLoad;
window.onerror = onWindowError;

//--------------------------------------------------------------
