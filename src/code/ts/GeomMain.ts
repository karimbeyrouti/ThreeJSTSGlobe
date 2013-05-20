/// <reference path="apps/controller/GeomTest.ts" />


module Main {

    var cubesTest   : threejs.GeomTest;


    export function start() {
        //
        cubesTest = new threejs.GeomTest();


    }

}

function onWindowLoad( event ) {

    Main.start();

}


function onWindowError( event ) {}

window.onload  = onWindowLoad;
window.onerror = onWindowError;







