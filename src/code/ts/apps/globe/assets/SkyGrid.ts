/// <reference path="../../../kurst/events/EventDispatcher.ts" />
/// <reference path="../../../libs/maps/three.d.ts" />
/*
 * Author: Karim Beyrouti ( karim@kurst.co.uk )
 */
module apps.globe.assets {

    //------------------------------------------------------------------------

    export class SkyGrid extends kurst.event.EventDispatcher {

        //------------------------------------------------------------------------

        private scene                   : THREE.Scene;
        private earthGridMat            : THREE.MeshBasicMaterial;
        private materials               : THREE.Material[];
        private gridMesh                : THREE.Object3D;
        private gridGeom                : THREE.SphereGeometry;

        //------------------------------------------------------------------------

        public container                : THREE.Object3D;

        //------------------------------------------------------------------------

        constructor(  scene : THREE.Scene ) {

            super();

            this.scene          = scene;

            this.initGrid();

        }

        //------------------------------------------------------------------------

        /*
         */
        private initGrid() : void {

            this.earthGridMat                 = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, transparent: true, opacity: 0.015 } );//new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: this.map, side: THREE.DoubleSide } );

            this.materials                    = [];
            this.materials.push( this.earthGridMat );

            this.gridGeom = new THREE.SphereGeometry( 4000  , 60 , 40 );
            this.gridGeom.computeTangents();

            this.gridMesh = THREE.SceneUtils.createMultiMaterialObject( this.gridGeom , this.materials );
            this.gridMesh.position.set( 0, 0, 0 );

            this.scene.add(  this.gridMesh );

        }

    }

}