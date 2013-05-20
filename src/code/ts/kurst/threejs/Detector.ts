/// <reference path="../../libs/maps/webgl.d.ts" />
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 * @author kB / http://kurst.co.uk/
 */
/**
 * Notes:
 **
 *      var canvas  : HTMLCanvasElement         = <HTMLCanvasElement>document.createElement("canvas");
 *      var context : any                       = this.createCanvas().getContext("experimental-webgl");
 *      var gl      : WebGLRenderingContext      = <WebGLRenderingContext> context;
 *      canvas.getContext('webgl');
 */
module kurst.threejs {

    class credits{

        public authorA : string = 'alteredq / http://alteredqualia.com/';
        public authorB : string = 'mr.doob / http://mrdoob.com/';
        public authorC : string = 'Karim Beyrouti / http://kurst.co.uk ( typescript conversion )';

    }

    export class Detector{

        public webgl    : bool;
        public canvas   : bool;
        public workers  : bool;
        public fileAPI  : bool;

        //--------------------------------------------------------------------------

        constructor() {

            this.canvas     = <bool> !! this.createCanvas();
            this.webgl      = this.testWebGlRenderingContext();
            this.workers    = <bool> !! window['Worker'];
            this.fileAPI    = <bool> !! ( window['File'] && window['FileReader'] && window['FileList'] && window['Blob'] );

        }

        //--------------------------------------------------------------------------

        /*
         */
        public addGetWebGLMessage ( parameters ? ) {

            var parent, id, element;

            parameters = parameters || {};

            parent = parameters.parent !== undefined ? parameters.parent : document.body;
            id = parameters.id !== undefined ? parameters.id : 'oldie';

            element = this.getWebGLErrorMessage();
            element.id = id;

            parent.appendChild( element );

        }
        /*
         */
        private getWebGLErrorMessage() : HTMLElement  {

            var element = document.createElement( 'div' );
                element.id = 'webgl-error-message2';
                element.style.fontFamily = 'monospace';
                element.style.fontSize = '13px';
                element.style.fontWeight = 'normal';
                element.style.textAlign = 'center';
                element.style.background = '#fff';
                element.style.color = '#000';
                element.style.padding = '1.5em';
                element.style.width = '400px';
                element.style.margin = '5em auto 0';

                element.innerHTML = window['WebGLRenderingContext'] ? [
                    'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                    'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
                ].join( '\n' ) : [
                    'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                    'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
                ].join( '\n' );

            return element;

        }

        /*
         */
        private testWebGlRenderingContext() : bool {

            try{

                var experimental : bool =  <bool> !! this.createCanvas().getContext("experimental-webgl" );

                var webGL        : bool =  <bool> !! this.createCanvas().getContext("webgl" );

                return experimental || webGL ;

            } catch ( e ) {

                return false;

            }

        }
        /*
         */
        private createCanvas() : HTMLCanvasElement{

            return <HTMLCanvasElement>document.createElement("canvas");

        }

        //--------------------------------------------------------------------------

    }

}