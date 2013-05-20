/// <reference path="apps/controller/CubesTest.ts" />

module Main {

    var cubesTest : threejs.CubesTest;

    export function start() {

        cubesTest = new threejs.CubesTest();

    }

}

function onWindowLoad( event ) {

    Main.start();

}
function onWindowError( event ) {}

window.onload  = onWindowLoad;
window.onerror = onWindowError;







