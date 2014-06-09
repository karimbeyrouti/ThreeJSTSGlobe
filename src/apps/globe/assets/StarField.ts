/// <reference path="../../../kurst/events/EventDispatcher.ts" />
/// <reference path="../../../libs/maps/three.d.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe.assets {

    export class StarFieldData {

        public fieldWidth       : number  = 3800;
        public fieldHeight      : number  = 3800;
        public fieldDepth       : number  = 3800;
        public excludeBounds    : number  = 400;
        public opacity          : number  = .35;
        public size             : number  = 1;
        public numParticles     : number  = 4000;

    }
    //------------------------------------------------------------------------

    export class StarField extends kurst.event.EventDispatcher {

        //------------------------------------------------------------------------

        private scene       : THREE.Scene;
        private geometry    : THREE.Geometry;
        private particleMat : THREE.ParticleBasicMaterial;
        private particles   : THREE.ParticleSystem;
        private data        : StarFieldData;

        //------------------------------------------------------------------------

        constructor( scene : THREE.Scene , data ? : StarFieldData) {

            super();

            if ( data === undefined ){

                data = new apps.globe.assets.StarFieldData();

            }

            this.data   = data;
            this.scene  = scene;

            this.init();

        }

        //------------------------------------------------------------------------

        /*
         */
        private init() : void {

            this.geometry = new THREE.Geometry();

            var fieldWidth      : number = this.data.fieldWidth;
            var fieldHeight     : number = this.data.fieldHeight;
            var fieldDepth      : number = this.data.fieldDepth;
            var excludeBounds   : number = this.data.excludeBounds;

            for ( var i = 0; i < this.data.numParticles ; i ++ ) {

                var dx :number = Math.random() * fieldWidth  - fieldWidth / 2;
                var dy :number = Math.random() * fieldHeight - fieldHeight / 2;
                var dz :number = Math.random() * fieldDepth  - fieldDepth / 2;

                var dist :number = Math.sqrt( dx*dx + dy*dy + dz*dz );

                if ( dist > excludeBounds){

                    var vertex = new THREE.Vector3();
                        vertex.x = dx;
                        vertex.y = dy;
                        vertex.z = dz;
                    this.geometry.vertices.push( vertex );

                }

            }

            this.particleMat = new THREE.ParticleBasicMaterial( { size : this.data.size });
            this.particleMat.color.setRGB(25,25,25);// = 0xffffff;
            this.particleMat.opacity = this.data.opacity;//.5;//.5;
            this.particleMat.transparent = true;

            this.particles = new THREE.ParticleSystem( this.geometry, this.particleMat );

            this.scene.add( this.particles );

        }

    }

}