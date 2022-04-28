import { MAX_VALUE, BaseboneConstraintType, ConnectionType, JointType } from '../constants';
import { _Math } from '../math/Math';
import { V3 } from '../math/V3';
import { M3 } from '../math/M3';
import { Bone3D } from './Bone3D';
import { Tools } from './Tools';
import { Chain } from './Chain';
import { Joint3D } from './Joint3D';

export class Chain3D implements Chain<Bone3D, V3, Joint3D, BaseboneConstraintType, 3> {
    static isChain3D = true;
    tmpTarget: V3;
    tmpMtx: M3;
    bones: Bone3D[];
    name: string;
    solveDistanceThreshold: number;
    minIterationChange: number;
    maxIteration: number;
    precision: number;
    chainLength: number;
    numBones: number;
    baseLocation: V3;
    fixedBaseMode: boolean;
    baseboneConstraintType: BaseboneConstraintType;
    baseboneConstraintUV: V3;
    baseboneRelativeConstraintUV: V3;
    baseboneRelativeReferenceConstraintUV: V3;
    lastTargetLocation: V3;
    lastBaseLocation: V3;
    currentSolveDistance: number;
    connectedChainNumber: number;
    connectedBoneNumber: number;
    boneConnectionPoint: ConnectionType;
    isFullForward: boolean;
    embeddedTarget: V3;
    useEmbeddedTarget: boolean;

    constructor() {

        this.tmpTarget = new V3();
        this.tmpMtx = new M3();

        this.bones = [];
        this.name = '';

        this.solveDistanceThreshold = 1.0;
        this.minIterationChange = 0.01;
        this.maxIteration = 20;
        this.precision = 0.001;

        this.chainLength = 0;
        this.numBones = 0;

        this.baseLocation = new V3();
        this.fixedBaseMode = true;

        this.baseboneConstraintType = BaseboneConstraintType.NONE;

        this.baseboneConstraintUV = new V3();
        this.baseboneRelativeConstraintUV = new V3();
        this.baseboneRelativeReferenceConstraintUV = new V3();
        this.lastTargetLocation = new V3( MAX_VALUE, MAX_VALUE, MAX_VALUE );

        this.lastBaseLocation = new V3( MAX_VALUE, MAX_VALUE, MAX_VALUE );
        this.currentSolveDistance = MAX_VALUE;

        this.connectedChainNumber = - 1;
        this.connectedBoneNumber = - 1;
        this.boneConnectionPoint = ConnectionType.END;

        // test full restrict angle
        this.isFullForward = false;



        this.embeddedTarget = new V3();
        this.useEmbeddedTarget = false;

    }

    clone() {

        const c = new Chain3D();

        c.solveDistanceThreshold = this.solveDistanceThreshold;
        c.minIterationChange = this.minIterationChange;
        c.maxIteration = this.maxIteration;
        c.precision = this.precision;

        c.bones = this.cloneBones();
        c.baseLocation.copy( this.baseLocation );
        c.lastTargetLocation.copy( this.lastTargetLocation );
        c.lastBaseLocation.copy( this.lastBaseLocation );

        // Copy the basebone constraint UV if there is one to copy
        if ( ! ( this.baseboneConstraintType === BaseboneConstraintType.NONE ) ) {

            c.baseboneConstraintUV.copy( this.baseboneConstraintUV );
            c.baseboneRelativeConstraintUV.copy( this.baseboneRelativeConstraintUV );

        }

        // Native copy by value for primitive members
        c.fixedBaseMode = this.fixedBaseMode;

        c.chainLength = this.chainLength;
        c.numBones = this.numBones;
        c.currentSolveDistance = this.currentSolveDistance;

        c.boneConnectionPoint = this.boneConnectionPoint;
        c.connectedChainNumber = this.connectedChainNumber;
        c.connectedBoneNumber = this.connectedBoneNumber;
        c.baseboneConstraintType = this.baseboneConstraintType;

        c.embeddedTarget = this.embeddedTarget.clone();
        c.useEmbeddedTarget = this.useEmbeddedTarget;

        return c;

    }

    clear() {

        let i = this.numBones;
        while ( i -- ) this.removeBone( i );
        this.numBones = 0;

    }

    addBone( bone: Bone3D ) {

        // Add the new bone to the end of the ArrayList of bones
        this.bones.push( bone );
        // Increment the number of bones in the chain and update the chain length
        this.numBones ++;

        // If this is the basebone...
        if ( this.numBones === 1 ) {

            // ...then keep a copy of the fixed start location...
            this.baseLocation.copy( bone.start );

            // ...and set the basebone constraint UV to be around the initial bone direction
            this.baseboneConstraintUV.copy( bone.getDirectionUV() );

        }

        // Increment the number of bones in the chain and update the chain length
        this.updateChainLength();

    }

    removeBone( id: number ) {

        if ( id < this.numBones ) {

            // ...then remove the bone, decrease the bone count and update the chain length.
            this.bones.splice( id, 1 );
            this.numBones --;
            this.updateChainLength();

        }

    }

    addConsecutiveBone( directionUV: V3, length: number ) {

        if ( this.numBones > 0 ) {

            // Get the end location of the last bone, which will be used as the start location of the new bone
            // Add a bone to the end of this IK chain
            // Note: We use a normalised version of the bone direction
            this.addBone( new Bone3D( this.bones[ this.numBones - 1 ].end, undefined, directionUV.normalised(), length ) );

        }

    }

    addConsecutiveFreelyRotatingHingedBone( directionUV: V3, length: number, type: string, hingeRotationAxis: V3 ) {

        this.addConsecutiveHingedBone( directionUV, length, type, hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );

    }

    addConsecutiveHingedBone( DirectionUV: V3, length: number, type: string, HingeRotationAxis: V3, clockwiseDegs: number, anticlockwiseDegs: number, hingeReferenceAxis: V3 ) {

        // Cannot add a consectuive bone of any kind if the there is no basebone
        if ( this.numBones === 0 ) return;

        // Normalise the direction and hinge rotation axis
        const directionUV = DirectionUV.normalised();
        const hingeRotationAxis = HingeRotationAxis.normalised();

        // Create a bone, get the end location of the last bone, which will be used as the start location of the new bone
        const bone = new Bone3D( this.bones[ this.numBones - 1 ].end, undefined, directionUV, length );

        type = type || 'global';

        // ...set up a joint which we'll apply to that bone.
        bone.joint.setHinge( type === 'global' ? JointType.J_GLOBAL : JointType.J_LOCAL, hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis );

        // Finally, add the bone to this chain
        this.addBone( bone );

    }

    addConsecutiveRotorConstrainedBone( boneDirectionUV: V3, length: number, constraintAngleDegs: number ) {

        if ( this.numBones === 0 ) return;

        // Create the bone starting at the end of the previous bone, set its direction, constraint angle and colour
        // then add it to the chain. Note: The default joint type of a new Bone is J_BALL.
        boneDirectionUV = boneDirectionUV.normalised();
        const bone = new Bone3D( this.bones[ this.numBones - 1 ].end, undefined, boneDirectionUV, length );
        bone.joint.setAsBallJoint( constraintAngleDegs );
        this.addBone( bone );

    }

    // -------------------------------
    //      GET
    // -------------------------------

    getBoneConnectionPoint() {

        return this.boneConnectionPoint;

    }

    getConnectedBoneNumber() {

        return this.connectedBoneNumber;

    }

    getConnectedChainNumber() {

        return this.connectedChainNumber;

    }

    getBaseboneConstraintType() {

        return this.baseboneConstraintType;

    }

    getBaseboneConstraintUV() {

        if ( ! ( this.baseboneConstraintType === BaseboneConstraintType.NONE ) ) return this.baseboneConstraintUV;

    }

    getBaseLocation() {

        return this.bones[ 0 ].start;

    }

    getEffectorLocation() {

        return this.bones[ this.numBones - 1 ].end;

    }

    getLastTargetLocation() {

        return this.lastTargetLocation;

    }

    getLiveChainLength() {

        let lng = 0;
        let i = this.numBones;
        while ( i -- ) lng += this.bones[ i ].getLength();
        return lng;

    }


    getBaseboneRelativeReferenceConstraintUV() {

        return this.baseboneRelativeReferenceConstraintUV;

    }

    // -------------------------------
    //      SET
    // -------------------------------

    setConnectedBoneNumber( boneNumber: number ) {

        this.connectedBoneNumber = boneNumber;

    }

    setConnectedChainNumber( chainNumber: number ) {

        this.connectedChainNumber = chainNumber;

    }

    setBoneConnectionPoint( point: ConnectionType ) {

        this.boneConnectionPoint = point;

    }

    setBaseboneRelativeConstraintUV( uv?: V3 ) {

        if(uv) this.baseboneRelativeConstraintUV = uv.normalised();

    }

    setBaseboneRelativeReferenceConstraintUV( uv: V3 ) {

        this.baseboneRelativeReferenceConstraintUV = uv.normalised();

    }

    setBaseboneConstraintUV( uv: V3 ) {

        this.baseboneConstraintUV = uv.normalised();

    }

    setRotorBaseboneConstraint( type: string, constraintAxis: V3, angleDegs: number ) {

        // Sanity checking
        if ( this.numBones === 0 ) {

            Tools.error( 'Chain must contain a basebone before we can specify the basebone constraint type.' ); return;

        }

        if ( ! ( constraintAxis.length() > 0 ) ) {

            Tools.error( 'Constraint axis cannot be zero.' ); return;

        }

        type = type || 'global';
        // Set the constraint type, axis and angle
        this.baseboneConstraintType = type === 'global' ? BaseboneConstraintType.GLOBAL_ROTOR : BaseboneConstraintType.LOCAL_ROTOR;
        this.baseboneConstraintUV = constraintAxis.normalised();
        this.baseboneRelativeConstraintUV.copy( this.baseboneConstraintUV );
        this.bones[ 0 ].joint.setAsBallJoint( angleDegs );

    }

    setHingeBaseboneConstraint( type: string, hingeRotationAxis: V3, cwDegs: number, acwDegs: number, hingeReferenceAxis: V3 ) {

        // Sanity checking
        if ( this.numBones === 0 ) {

            Tools.error( 'Chain must contain a basebone before we can specify the basebone constraint type.' ); return;

        }

        if ( hingeRotationAxis.length() <= 0 ) {

            Tools.error( 'Hinge rotation axis cannot be zero.' ); return;

        }

        if ( hingeReferenceAxis.length() <= 0 ) {

            Tools.error( 'Hinge reference axis cannot be zero.' ); return;

        }

        if ( ! ( _Math.perpendicular( hingeRotationAxis, hingeReferenceAxis ) ) ) {

            Tools.error( 'The hinge reference axis must be in the plane of the hinge rotation axis, that is, they must be perpendicular.' ); return;

        }

        type = type || 'global';

        // Set the constraint type, axis and angle
        this.baseboneConstraintType = type === 'global' ? BaseboneConstraintType.GLOBAL_HINGE : BaseboneConstraintType.LOCAL_HINGE;
        this.baseboneConstraintUV = hingeRotationAxis.normalised();
        this.bones[ 0 ].joint.setHinge( type === 'global' ? JointType.J_GLOBAL : JointType.J_LOCAL, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );

    }

    setFreelyRotatingGlobalHingedBasebone( hingeRotationAxis: V3 ) {

        this.setHingeBaseboneConstraint( 'global', hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );

    }

    setGlobalHingedBasebone( hingeRotationAxis: V3, cwDegs: number, acwDegs: number, hingeReferenceAxis: V3 ) {

        this.setHingeBaseboneConstraint( 'global', hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );

    }

    setFreelyRotatingLocalHingedBasebone( hingeRotationAxis: V3 ) {

        this.setHingeBaseboneConstraint( 'local', hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );

    }

    setLocalHingedBasebone( hingeRotationAxis: V3, cwDegs: number, acwDegs: number, hingeReferenceAxis: V3 ) {

        this.setHingeBaseboneConstraint( 'local', hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );

    }

    setBaseLocation( baseLocation: V3 ) {

        this.baseLocation.copy( baseLocation );

    }

    setFixedBaseMode( value: boolean ) {

        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
        if ( ! value && this.connectedChainNumber !== - 1 ) return;
        if ( this.baseboneConstraintType === BaseboneConstraintType.GLOBAL_ROTOR && ! value ) return;
        // Above conditions met? Set the fixedBaseMode
        this.fixedBaseMode = value;

    }

    setMaxIterationAttempts( maxIterations: number ) {

        if ( maxIterations < 1 ) return;
        this.maxIteration = maxIterations;

    }

    setMinIterationChange( minIterationChange: number ) {

        if ( minIterationChange < 0 ) return;
        this.minIterationChange = minIterationChange;

    }

    setSolveDistanceThreshold( solveDistance: number ) {

        if ( solveDistance < 0 ) return;
        this.solveDistanceThreshold = solveDistance;

    }

    // -------------------------------
    //
    //      UPDATE TARGET
    //
    // -------------------------------

    solveForEmbeddedTarget() {

        if ( this.useEmbeddedTarget ) return this.solveForTarget( this.embeddedTarget );

    }

    resetTarget() {

        this.lastBaseLocation = new V3( MAX_VALUE, MAX_VALUE, MAX_VALUE );
        this.currentSolveDistance = MAX_VALUE;

    }


    // Method to solve this IK chain for the given target location.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the solveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the minIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the maxIteration.

    solveForTarget( t: V3 ) {

        this.tmpTarget.set( t.x, t.y, t.z );
        const p = this.precision;

        const isSameBaseLocation = this.lastBaseLocation.approximatelyEquals( this.baseLocation, p );

        // If we have both the same target and base location as the last run then do not solve
        if ( this.lastTargetLocation.approximatelyEquals( this.tmpTarget, p ) && isSameBaseLocation ) return this.currentSolveDistance;

        // Keep starting solutions and distance
        let startingDistance;
        let startingSolution = null;

        // If the base location of a chain hasn't moved then we may opt to keep the current solution if our
        // best new solution is worse...
        if ( isSameBaseLocation ) {

            startingDistance = this.bones[ this.numBones - 1 ].end.distanceTo( this.tmpTarget );
            startingSolution = this.cloneBones();

        } else {

            // Base has changed? Then we have little choice but to recalc the solution and take that new solution.
            startingDistance = MAX_VALUE;

        }

        /*
         * NOTE: We must allow the best solution of THIS run to be used for a new target or base location - we cannot
         * just use the last solution (even if it's better) - because that solution was for a different target / base
         * location combination and NOT for the current setup.
         */

        // Not the same target? Then we must solve the chain for the new target.
        // We'll start by creating a list of bones to store our best solution
        let bestSolution: Bone3D[] = [];

        // We'll keep track of our best solve distance, starting it at a huge value which will be beaten on first attempt
        let bestSolveDistance = MAX_VALUE;
        let lastPassSolveDistance = MAX_VALUE;

        // Allow up to our iteration limit attempts at solving the chain
        let solveDistance;

        let i = this.maxIteration;

        while ( i -- ) {

            // Solve the chain for this target
            solveDistance = this.solveIK( this.tmpTarget );

            // Did we solve it for distance? If so, update our best distance and best solution, and also
            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run.
            if ( solveDistance !== undefined && solveDistance < bestSolveDistance ) {

                bestSolveDistance = solveDistance;
                bestSolution = this.cloneBones();

                // If we are happy that this solution meets our distance requirements then we can exit the loop now
                if ( solveDistance <= this.solveDistanceThreshold ) break;

            } else { // Did not solve to our satisfaction? Okay...

                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
                if ( solveDistance === undefined || Math.abs( solveDistance - lastPassSolveDistance ) < this.minIterationChange ) break;

            }

            // Update the last pass solve distance
            lastPassSolveDistance = solveDistance;

        } // End of loop

        // Did we get a solution that's better than the starting solution's to the new target location?
        if ( bestSolveDistance < startingDistance ) {

            // If so, set the newly found solve distance and solution as the best found.
            this.currentSolveDistance = bestSolveDistance;
            this.bones = bestSolution;

        } else {

            // Did we make things worse? Then we keep our starting distance and solution!
            this.currentSolveDistance = startingDistance;
            this.bones = startingSolution || this.bones;

        }

        // Update our base and target locations
        this.lastBaseLocation.copy( this.baseLocation );
        this.lastTargetLocation.copy( this.tmpTarget );

        return this.currentSolveDistance;

    }

    // -------------------------------
    //
    //      SOLVE IK
    //
    // -------------------------------

    // Solve the IK chain for the given target using the FABRIK algorithm.
    // retun the best solve distance found between the end-effector of this chain and the provided target.

    solveIK( target: V3 ) {

        if ( this.numBones === 0 ) return;

        let bone, boneLength, joint, jointType, nextBone;
        let hingeRotationAxis;
        const tmpMtx = this.tmpMtx;

        // ---------- Forward pass from end effector to base -----------

        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0)
        let i = this.numBones;

        while ( i -- ) {


            // Get the length of the bone we're working on
            bone = this.bones[ i ];
            boneLength = bone.length;
            joint = bone.joint;
            jointType = joint.type;

            // If we are NOT working on the end effector bone
            if ( i !== this.numBones - 1 ) {

                nextBone = this.bones[ i + 1 ];

                // Get the outer-to-inner unit vector of the bone further out
                const outerBoneOuterToInnerUV = nextBone.getDirectionUV().negate();

                // Get the outer-to-inner unit vector of this bone
                const boneOuterToInnerUV = bone.getDirectionUV().negate();

                // Get the joint type for this bone and handle constraints on boneInnerToOuterUV

                /*if( this.isFullForward ){

                    switch ( jointType ) {
                        case J_BALL:
                            // Constrain to relative angle between this bone and the next bone if required
                            boneOuterToInnerUV.limitAngle( outerBoneOuterToInnerUV, tmpMtx, nextBone.joint.rotor );
                        break;
                        case J_GLOBAL:

                            hingeRotationAxis = nextBone.joint.getHingeRotationAxis().negated();
                            hingeReferenceAxis = nextBone.joint.getHingeReferenceAxis().negated();

                            // Project this bone outer-to-inner direction onto the hinge rotation axis
                            boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );

                            // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                            if( !nextBone.joint.freeHinge ) boneOuterToInnerUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx,  nextBone.joint.min,  nextBone.joint.max );


                        break;
                        case J_LOCAL:


                            if ( i > 0 ) {// Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                                // ...and transform the hinge rotation axis into the previous bones frame of reference.

                                tmpMtx.createRotationMatrix( outerBoneOuterToInnerUV );
                                hingeRotationAxis = nextBone.joint.getHingeRotationAxis().clone().negate().applyM3( tmpMtx );
                                hingeReferenceAxis = nextBone.joint.getHingeReferenceAxis().clone().negate().applyM3( tmpMtx );



                            } else {// ...basebone? Need to construct matrix from the relative constraint UV.

                                hingeRotationAxis = this.baseboneRelativeConstraintUV.negated();
                                hingeReferenceAxis = this.baseboneRelativeReferenceConstraintUV.negated();

                            }

                            // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                            boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );

                            // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                            if( !nextBone.joint.freeHinge ){

                                boneOuterToInnerUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, nextBone.joint.min, nextBone.joint.max );

                            }
                        break;
                    }
                } else {*/

                switch ( jointType ) {

                case JointType.J_BALL:
                    // Constrain to relative angle between this bone and the next bone if required
                    boneOuterToInnerUV.limitAngle( outerBoneOuterToInnerUV, tmpMtx, joint.rotor );
                    break;
                case JointType.J_GLOBAL:

                    hingeRotationAxis = joint.getHingeRotationAxis();

                    // Project this bone outer-to-inner direction onto the hinge rotation axis
                    boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );

                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                    break;
                case JointType.J_LOCAL:


                    if ( i > 0 ) { // Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...

                        // ...and transform the hinge rotation axis into the previous bones frame of reference.

                        tmpMtx.createRotationMatrix( this.bones[ i - 1 ].getDirectionUV() );
                        hingeRotationAxis = joint.getHingeRotationAxis().clone().applyM3( tmpMtx );

                    } else { // ...basebone? Need to construct matrix from the relative constraint UV.

                        hingeRotationAxis = this.baseboneRelativeConstraintUV;

                    }

                    // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                    boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );

                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                    break;

                }
                //}

                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                const newStartLocation = bone.end.plus( boneOuterToInnerUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone
                bone.setStartLocation( newStartLocation );

                // If we are not working on the basebone, then we also set the end joint location of
                // the previous bone in the chain (i.e. the bone closer to the base) to be the new
                // start joint location of this bone.
                if ( i > 0 ) this.bones[ i - 1 ].setEndLocation( newStartLocation );

            } else { // If we ARE working on the end effector bone...

                // Snap the end effector's end location to the target
                bone.setEndLocation( target );

                // Get the UV between the target / end-location (which are now the same) and the start location of this bone
                const boneOuterToInnerUV = bone.getDirectionUV().negated();

                // If the end effector is global hinged then we have to snap to it, then keep that
                // resulting outer-to-inner UV in the plane of the hinge rotation axis
                switch ( jointType ) {

                case JointType.J_BALL:
                    // Ball joints do not get constrained on this forward pass
                    break;
                case JointType.J_GLOBAL:
                    hingeRotationAxis = joint.getHingeRotationAxis();
                    // Global hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                    boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );
                    break;
                case JointType.J_LOCAL:
                    // Local hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane

                    // Construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                    tmpMtx.createRotationMatrix( this.bones[ i - 1 ].getDirectionUV() );

                    // ...and transform the hinge rotation axis into the previous bones frame of reference.
                    hingeRotationAxis = joint.getHingeRotationAxis().clone().applyM3( tmpMtx );

                    // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                    boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );
                    break;

                }

                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
                // multiplied by the length of the bone.
                const newStartLocation = target.plus( boneOuterToInnerUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone to be new start location...
                bone.setStartLocation( newStartLocation );

                // ...and set the end joint location of the bone further in to also be at the new start location (if there IS a bone
                // further in - this may be a single bone chain)
                if ( i > 0 ) this.bones[ i - 1 ].setEndLocation( newStartLocation );

            }

        } // End of forward pass

        // ---------- Backward pass from base to end effector -----------

        for ( i = 0; i < this.numBones; i ++ ) {

            bone = this.bones[ i ];
            boneLength = bone.length;
            joint = bone.joint;
            jointType = joint.type;

            // If we are not working on the basebone
            if ( i !== 0 ) {

                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
                const boneInnerToOuterUV = bone.getDirectionUV();

                const prevBoneInnerToOuterUV = this.bones[ i - 1 ].getDirectionUV();

                let hingeRotationAxis, hingeReferenceAxis;

                switch ( jointType ) {

                case JointType.J_BALL:

                    // Keep this bone direction constrained within the rotor about the previous bone direction
                    boneInnerToOuterUV.limitAngle( prevBoneInnerToOuterUV, tmpMtx, joint.rotor );

                    break;
                case JointType.J_GLOBAL:

                    // Get the hinge rotation axis and project our inner-to-outer UV onto it
                    hingeRotationAxis = joint.getHingeRotationAxis();
                    hingeReferenceAxis = joint.getHingeReferenceAxis();

                    boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                    // Constrain rotation about reference axis if required
                    if ( ! joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;
                case JointType.J_LOCAL:

                    // Transform the hinge rotation axis to be relative to the previous bone in the chain
                    // Construct a rotation matrix based on the previous bone's direction
                    tmpMtx.createRotationMatrix( prevBoneInnerToOuterUV );

                    // Transform the hinge rotation axis into the previous bone's frame of reference
                    hingeRotationAxis = joint.getHingeRotationAxis().clone().applyM3( tmpMtx );
                    hingeReferenceAxis = joint.getHingeReferenceAxis().clone().applyM3( tmpMtx );


                    // Project this bone direction onto the plane described by the hinge rotation axis
                    // Note: The returned vector is normalised.
                    boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                    // Constrain rotation about reference axis if required
                    if ( ! joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;

                }

                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                const newEndLocation = bone.start.plus( boneInnerToOuterUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone
                bone.setEndLocation( newEndLocation );

                // If we are not working on the end effector bone, then we set the start joint location of the next bone in
                // the chain (i.e. the bone closer to the target) to be the new end joint location of this bone.
                if ( i < ( this.numBones - 1 ) ) {

                    this.bones[ i + 1 ].setStartLocation( newEndLocation );

                }

            } else { // If we ARE working on the basebone...

                // If the base location is fixed then snap the start location of the basebone back to the fixed base...
                if ( this.fixedBaseMode ) {

                    bone.setStartLocation( this.baseLocation );

                } else { // ...otherwise project it backwards from the end to the start by its length.

                    bone.setStartLocation( bone.end.minus( bone.getDirectionUV().multiplyScalar( boneLength ) ) );

                }

                // Get the inner-to-outer direction of this bone
                const boneInnerToOuterUV = bone.getDirectionUV();

                let hingeRotationAxis, hingeReferenceAxis;

                switch ( this.baseboneConstraintType ) {

                case BaseboneConstraintType.NONE: // Nothing to do because there's no basebone constraint
                    break;
                case BaseboneConstraintType.GLOBAL_ROTOR:

                    boneInnerToOuterUV.limitAngle( this.baseboneConstraintUV, tmpMtx, joint.rotor );

                    break;
                case BaseboneConstraintType.LOCAL_ROTOR:

                    boneInnerToOuterUV.limitAngle( this.baseboneRelativeConstraintUV, tmpMtx, joint.rotor );

                    break;
                case BaseboneConstraintType.GLOBAL_HINGE:

                    hingeRotationAxis = joint.getHingeRotationAxis();
                    hingeReferenceAxis = joint.getHingeReferenceAxis();

                    // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                    boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                    // Constrain as necessary
                    if ( ! joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;
                case BaseboneConstraintType.LOCAL_HINGE:

                    hingeRotationAxis = this.baseboneRelativeConstraintUV;
                    hingeReferenceAxis = this.baseboneRelativeReferenceConstraintUV;

                    // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                    //var boneInnerToOuterUV = bone.getDirectionUV();
                    boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                    // Constrain as necessary
                    if ( ! joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;

                }


                // Set the new end location of this bone, and if there are more bones,
                // then set the start location of the next bone to be the end location of this bone
                const newEndLocation = bone.start.plus( boneInnerToOuterUV.multiplyScalar( boneLength ) );
                bone.setEndLocation( newEndLocation );

                if ( this.numBones > 1 ) {

                    this.bones[ 1 ].setStartLocation( newEndLocation );

                }

            } // End of basebone handling section

        } // End of backward-pass i over all bones

        // Update our last target location
        this.lastTargetLocation.copy( target );

        // DEBUG - check the live chain length and the originally calculated chain length are the same
        // if (Math.abs( this.getLiveChainLength() - chainLength) > 0.01) Tools.error(""Chain length off by > 0.01");

        // Finally, calculate and return the distance between the current effector location and the target.
        //return _Math.distanceBetween( this.bones[this.numBones-1].end, target );
        return this.bones[ this.numBones - 1 ].end.distanceTo( target );

    }

    updateChainLength() {

        // Loop over all the bones in the chain, adding the length of each bone to the chainLength property
        this.chainLength = 0;
        let i = this.numBones;
        while ( i -- ) this.chainLength += this.bones[ i ].length;

    }

    cloneBones() {

        // Use clone to create a new Bone with the values from the source Bone.
        const chain = [];
        for ( let i = 0, n = this.bones.length; i < n; i ++ ) chain.push( this.bones[ i ].clone() );
        return chain;

    }

}
