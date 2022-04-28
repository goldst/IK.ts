import { UP, ConnectionType, BaseboneConstraintType } from '../constants';
import { V2 } from '../math/V2';
import { Bone2D } from './Bone2D';
import { Chain2D } from './Chain2D';
import { Joint2D } from './Joint2D';
import { Structure } from './Structure';
import { Tools } from './Tools';

export class Structure2D implements Structure<Chain2D, V2, Bone2D, Joint2D, BaseboneConstraintType, 2> {
    static isStructure2D = true;
    fixedBaseMode: boolean;
    chains: Chain2D[];
    targets: V2[];
    numChains: number;

    constructor( ) {

        this.fixedBaseMode = true;

        this.chains = [];
        this.targets = [];
        this.numChains = 0;

    }

    update() {

        //console.log('up')

        let chain, target;
        let hostChainNumber;
        let constraintType;

        for ( let i = 0; i < this.numChains; i ++ ) {

            chain = this.chains[ i ];

            target = this.targets[ i ] || null;

            hostChainNumber = chain.getConnectedChainNumber();

            // Get the basebone constraint type of the chain we're working on
            constraintType = chain.getBaseboneConstraintType();

            // If this chain is not connected to another chain and the basebone constraint type of this chain is not global absolute
            // then we must update the basebone constraint UV for LOCAL_RELATIVE and the basebone relative constraint UV for LOCAL_ABSOLUTE connection types.
            // Note: For NONE or GLOBAL_ABSOLUTE we don't need to update anything before calling solveForTarget().
            if ( hostChainNumber !== - 1 && constraintType !== BaseboneConstraintType.GLOBAL_ABSOLUTE ) {

                // Get the bone which this chain is connected to in the 'host' chain
                const hostBone = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === ConnectionType.START ? hostBone.start : hostBone.end );


                // If the basebone is constrained to the direction of the bone it's connected to...
                const hostBoneUV = hostBone.getDirectionUV();

                if ( constraintType === BaseboneConstraintType.LOCAL_RELATIVE ) {

                    // ...then set the basebone constraint UV to be the direction of the bone we're connected to.
                    chain.setBaseboneConstraintUV( hostBoneUV );

                } else if ( constraintType === BaseboneConstraintType.LOCAL_ABSOLUTE ) {

                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
                    // will be updated to be left with regard to the host bone.

                    // Get the angle between UP and the hostbone direction
                    const angle = UP.getSignedAngle( hostBoneUV );

                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV...
                    const relativeConstraintUV = chain.getBaseboneConstraintUV()?.clone().rotate( angle );

                    // ...which we then update.
                    chain.setBaseboneRelativeConstraintUV( relativeConstraintUV );

                }

                // NOTE: If the basebone constraint type is NONE then we don't do anything with the basebone constraint of the connected chain.

            } // End of if chain is connected to another chain section

            // Finally, update the target and solve the chain

            if ( ! chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else console.log( 'embed', chain.solveForEmbeddedTarget() );


        }

    }

    setFixedBaseMode( value: boolean ) {

        // Update our flag and set the fixed base mode on the first (i.e. 0th) chain in this structure.
        this.fixedBaseMode = value;
        let i = this.numChains, host;
        while ( i -- ) {

            host = this.chains[ i ].getConnectedChainNumber();
            if ( host === - 1 ) this.chains[ i ].setFixedBaseMode( this.fixedBaseMode );

        }
        //this.chains[0].setFixedBaseMode( this.fixedBaseMode );

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

    add( chain: Chain2D, target: V2 ) {

        this.chains.push( chain );
        this.numChains ++;

        //if( target.isVector3 ) target = new V2(target.x, target.y);

        if ( target ) this.targets.push( target );

    }

    remove( id: number ) {

        this.chains[ id ].clear();
        this.chains.splice( id, 1 );
        this.targets.splice( id, 1 );
        this.numChains --;

    }

    /*setFixedBaseMode:function( fixedBaseMode ){
        for ( var i = 0; i < this.numChains; i++) {
            this.chains[i].setFixedBaseMode( fixedBaseMode );
        }
    },*/

    getNumChains() {

        return this.numChains;

    }

    getChain( id: number ) {

        return this.chains[ id ];

    }

    connectChain( Chain: Chain2D, chainNumber: number, boneNumber: number, point: string ) {

        const c = chainNumber;
        const n = boneNumber;

        point = point || 'end';

        if ( c > this.numChains ) {

            Tools.error( 'Chain does not exist!' ); return;

        }

        if ( n > this.chains[ c ].numBones ) {

            Tools.error( 'Bone does not exist!' ); return;

        }

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        const chain = Chain.clone();

        chain.setBoneConnectionPoint( point === 'end' ? ConnectionType.END : ConnectionType.START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start or end position of the given bone in the given chain.

        const position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;

        //if ( connectionPoint === 'start' ) connectionLocation = this.chains[chainNumber].getBone(boneNumber).start;
        //else connectionLocation = this.chains[chainNumber].getBone(boneNumber).end;


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

    }

}
