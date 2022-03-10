import { ConnectionType, JointType, BaseboneConstraintType } from '../constants';
import { M3 } from '../math/M3';
import { V3 } from '../math/V3';
import { Bone3D } from './Bone3D';
import { Chain3D } from './Chain3D';
import * as THREE from 'three';
import { DoubleSide } from 'three';

export class Structure3D {
    fixedBaseMode: boolean;
    chains: Chain3D[];
    meshChains: THREE.Mesh[][];
    targets: V3[];
    numChains: number;
    scene?: THREE.Scene;
    tmpMtx: M3;
    isWithMesh: boolean;

    constructor( scene?: THREE.Scene ) {

        this.fixedBaseMode = true;

        this.chains = [];
        this.meshChains = [];
        this.targets = [];
        this.numChains = 0;

        this.scene = scene;

        this.tmpMtx = new M3();

        this.isWithMesh = false;

    }

    update() {

        let chain, mesh, bone, target;
        let hostChainNumber;
        let hostBone, constraintType;

        //var i =  this.numChains;

        //while(i--){

        for ( let i = 0; i < this.numChains; i ++ ) {

            chain = this.chains[ i ];
            
            target = this.targets[ i ];

            hostChainNumber = chain.getConnectedChainNumber();

            if ( hostChainNumber !== - 1 ) {

                hostBone = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === ConnectionType.START ? hostBone.start : hostBone.end );

                // Now that we've clamped the base location of this chain to the start or end point of the bone in the chain we are connected to, it's
                // time to deal with any base bone constraints...

                constraintType = chain.getBaseboneConstraintType();

                let relativeBaseboneConstraintUV;

                switch ( constraintType ) {

                case BaseboneConstraintType.NONE: // Nothing to do because there's no basebone constraint
                case BaseboneConstraintType.GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                case BaseboneConstraintType.GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                    break;

                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling solveForTarget
                case BaseboneConstraintType.LOCAL_ROTOR:
                case BaseboneConstraintType.LOCAL_HINGE:

                    //chain.resetTarget(); // ??

                    // Get the direction of the bone this chain is connected to and create a rotation matrix from it.
                    this.tmpMtx.createRotationMatrix( hostBone.getDirectionUV() );
                    //var connectionBoneMatrix = new FIK.M3().createRotationMatrix( hostBone.getDirectionUV() );

                    // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone
                    // to make the basebone constraint UV relative to the direction of bone it's connected to.
                    //var relativeBaseboneConstraintUV = connectionBoneMatrix.times( c.getBaseboneConstraintUV() ).normalize();
                    relativeBaseboneConstraintUV = chain.getBaseboneConstraintUV()?.clone().applyM3( this.tmpMtx );

                    // Update our basebone relative constraint UV property
                    chain.setBaseboneRelativeConstraintUV( relativeBaseboneConstraintUV );

                    // Update the relative reference constraint UV if we hav a local hinge
                    if ( constraintType === BaseboneConstraintType.LOCAL_HINGE )
                        chain.setBaseboneRelativeReferenceConstraintUV( chain.bones[ 0 ].joint.getHingeReferenceAxis().clone().applyM3( this.tmpMtx ) );

                    break;

                }




            }

            // Finally, update the target and solve the chain

            if ( ! chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else chain.solveForEmbeddedTarget();

            // update 3d mesh

            if ( this.isWithMesh ) {

                mesh = this.meshChains[ i ];

                for ( let j = 0; j < chain.numBones; j ++ ) {

                    bone = chain.bones[ j ];
                    console.log(bone.end);
                    mesh[ j ].position.set(
                        bone.start.x,
                        bone.start.y,
                        bone.start.z
                    );
                    mesh[ j ].lookAt(new THREE.Vector3(
                        bone.end.x,
                        bone.end.y,
                        bone.end.z
                    ));

                }

            }

        }

    }

    clear() {

        this.clearAllBoneMesh();

        let i;

        i = this.numChains;
        while ( i -- ) {

            this.remove( i );

        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    }

    add( chain: Chain3D, target: V3, meshBone?: boolean ) {

        this.chains.push( chain );

        this.targets.push( target );
        this.numChains ++;

        if ( meshBone ) this.addChainMeshs( chain );

    }



    remove( id: number ) {

        this.chains[ id ].clear();
        this.chains.splice( id, 1 );
        this.meshChains.splice( id, 1 );
        this.targets.splice( id, 1 );
        this.numChains --;

    }

    setFixedBaseMode( value: boolean ) {

        this.fixedBaseMode = value;
        let i = this.numChains, host;
        while ( i -- ) {

            host = this.chains[ i ].getConnectedChainNumber();
            if ( host === - 1 ) this.chains[ i ].setFixedBaseMode( this.fixedBaseMode );

        }

    }

    getNumChains() {

        return this.numChains;

    }

    getChain( id: number ) {

        return this.chains[ id ];

    }

    connectChain( Chain: Chain3D, chainNumber: number, boneNumber: number, point: string, target: V3, meshBone: THREE.Mesh, color?: number ) {

        const c = chainNumber;
        const n = boneNumber;

        if ( chainNumber > this.numChains ) return;
        if ( boneNumber > this.chains[ chainNumber ].numBones ) return;

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        const chain = Chain.clone();//new Fullik.Chain( newChain );
        if ( color !== undefined ) chain.setColor( color );

        // Connect the copy of the provided chain to the specified chain and bone in this structure
        //chain.connectToStructure( this, chainNumber, boneNumber );

        chain.setBoneConnectionPoint( point === 'end' ? ConnectionType.END : ConnectionType.START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start location of the given bone in the given chain.

        const position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;


        chain.setBaseLocation( position );
        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        chain.setFixedBaseMode( true );

        // Translate the chain we're connecting to the connection point
        for ( let i = 0; i < chain.numBones; i ++ ) {

            chain.bones[ i ].start.add( position );
            chain.bones[ i ].end.add( position );

        }

        this.add( chain, target, !!meshBone );

    }


    // 3D THREE

    addChainMeshs( chain: Chain3D ) {

        this.isWithMesh = true;

        const meshBone: THREE.Mesh[] = [];
        const lng = chain.bones.length;
        for ( let i = 0; i < lng; i ++ ) {

            meshBone.push( this.addBoneMesh( chain.bones[ i ], i - 1, meshBone, chain ) );

        }

        this.meshChains.push( meshBone );

    }

    addBoneMesh( bone: Bone3D, prev: number, ar: THREE.Mesh[], chain: Chain3D ) {

        //const momimamu = new THREE.Mesh(
        //	new THREE.CylinderBufferGeometry( 1, 0.5, size, 4 ),
        //	new THREE.MeshStandardMaterial( { color: color, wireframe: false, shadowSide: DoubleSide } )
        //);
        //this.scene.add(momimamu);

        const size = bone.length;
        const color = bone.color;
        const g = new THREE.CylinderBufferGeometry( 1, 0.5, size, 4 );
        g.applyMatrix4( new THREE.Matrix4().makeRotationX( - Math.PI * 0.5 ) );
        g.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0, size * 0.5 ) );
        const m = new THREE.MeshStandardMaterial( { color: color, wireframe: false, shadowSide: DoubleSide } );

        const m2 = new THREE.MeshBasicMaterial( { wireframe: true } );
        //var m4 = new THREE.MeshBasicMaterial({ wireframe : true, color:color, transparent:true, opacity:0.3 });

        let extraMesh = null;
        let extraGeo;

        const type = bone.joint.type;
        let axe;
        const r = 2;
        const a1 = bone.joint.min;
        const a2 = bone.joint.max;
        const s = 2;//size/4;
        let angle;

        switch ( type ) {
        case JointType.J_BALL :
            m2.color.setHex( 0xFF6600 );
            angle = bone.joint.rotor;

            if ( angle === Math.PI ) break;
            extraGeo = new THREE.CylinderBufferGeometry( 0, r, s, 6, 1, true );
            extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( - Math.PI * 0.5 ) );
            extraGeo.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0, s * 0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo, m2 );
            break;
        case JointType.J_GLOBAL :
            axe = bone.joint.getHingeRotationAxis();
            //console.log( axe );
            //console.log('global', a1, a2)
            m2.color.setHex( 0xFFFF00 );
            extraGeo = new THREE.CircleBufferGeometry( r, 12, a1, - a1 + a2 );
            //extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            if ( axe.z === 1 ) extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( - Math.PI * 0.5 ) );
            if ( axe.y === 1 ) {

                extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationY( - Math.PI * 0.5 ) ); extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( - Math.PI * 0.5 ) );

            }

            if ( axe.x === 1 ) {

                extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI * 0.5 ) );

            }

            extraMesh = new THREE.Mesh( extraGeo, m2 );
            break;
        case JointType.J_LOCAL :

            axe = bone.joint.getHingeRotationAxis();


            //console.log('local', a1, a2)
            m2.color.setHex( 0x00FFFF );
            extraGeo = new THREE.CircleBufferGeometry( r, 12, a1, - a1 + a2 );
            extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( - Math.PI * 0.5 ) );

            if ( axe.z === 1 ) {

                extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationY( - Math.PI * 0.5 ) ); extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI * 0.5 ) );

            }

            if ( axe.x === 1 ) extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationZ( - Math.PI * 0.5 ) );
            if ( axe.y === 1 ) {

                extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationX( Math.PI * 0.5 ) ); extraGeo.applyMatrix4( new THREE.Matrix4().makeRotationY( Math.PI * 0.5 ) );

            }

            extraMesh = new THREE.Mesh( extraGeo, m2 );
            break;

        }

        const axeThree = new THREE.AxesHelper( 1.5 );
        //var bw = new THREE.Mesh( g,  m4 );

        const b = new THREE.Mesh( g, m );
        b.add( axeThree );
        //b.add(bw);
        this.scene?.add( b );

        b.castShadow = true;
        b.receiveShadow = true;

        if ( prev !== - 1 ) {

            if ( extraMesh !== null ) {

                if ( type !== JointType.J_GLOBAL ) {

                    extraMesh.position.z = chain.bones[ prev ].length;
                    ar[ prev ].add( extraMesh );

                } else {

                    b.add( extraMesh );

                }

            }

        } else {

            if ( extraMesh !== null ) b.add( extraMesh );

        }

        return b;

    }

    clearAllBoneMesh() {

        if ( ! this.isWithMesh ) return;

        let i, j, b;

        i = this.meshChains.length;
        while ( i -- ) {

            j = this.meshChains[ i ].length;
            while ( j -- ) {

                b = this.meshChains[ i ][ j ];
                this.scene?.remove( b );
                b.geometry.dispose();
                if(b.material instanceof THREE.Material) {
                    b.material.dispose();
                } else {
                    b.material.forEach(m => m.dispose());
                }

            }

            this.meshChains[ i ] = [];

        }

        this.meshChains = [];

    }

}
