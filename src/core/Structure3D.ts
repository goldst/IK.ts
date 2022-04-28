import { ConnectionType, BaseboneConstraintType } from '../constants';
import { M3 } from '../math/M3';
import { V3 } from '../math/V3';
import { Bone3D } from './Bone3D';
import { Chain3D } from './Chain3D';
import { Joint3D } from './Joint3D';
import { Structure } from './Structure';

/** 
 * A Structure3D contains one or more Chain3D objects, which we can solve using the FABRIK (Forward And
 * Backward Reaching Inverse Kinematics) algorithm for specified target locations.
 * The Structure3D class is merely a convenient holder for a list of Chain3D objects which allows
 * multiple chains to have their target location updated, as well as solving and drawing the multiple chains
 * attached to the Structure3D object using one method call per structure.
 * If you do not intend on attaching multiple Chain3D objects into a complex structure, for example one with
 * multiple effectors, then you may be better served by creating individual Chain3D objects and using those
 * objects directly.
 **/
export class Structure3D implements Structure<Chain3D, V3, Bone3D, Joint3D, BaseboneConstraintType, 3>  {
    fixedBaseMode: boolean;
    chains: Chain3D[];
    targets: V3[];
    numChains: number;
    tmpMtx: M3;

    constructor() {

        this.fixedBaseMode = true;

        this.chains = [];
        this.targets = [];
        this.numChains = 0;

        this.tmpMtx = new M3();

    }

    update() {

        let chain, target;
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

        }

    }

    clear() {

        let i;

        i = this.numChains;
        while ( i -- ) {

            this.remove( i );

        }

        this.chains = [];
        this.targets = [];

    }

    add( chain: Chain3D, target: V3 ) {

        this.chains.push( chain );

        this.targets.push( target );
        this.numChains ++;

    }



    remove( id: number ) {

        this.chains[ id ].clear();
        this.chains.splice( id, 1 );
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

    connectChain( Chain: Chain3D, chainNumber: number, boneNumber: number, point: string, target: V3) {

        const c = chainNumber;
        const n = boneNumber;

        if ( chainNumber > this.numChains ) return;
        if ( boneNumber > this.chains[ chainNumber ].numBones ) return;

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        const chain = Chain.clone();//new Fullik.Chain( newChain );

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

        this.add( chain, target );

    }

}
