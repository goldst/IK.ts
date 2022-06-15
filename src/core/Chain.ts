import { BaseboneConstraintType, ConnectionType } from '../constants';
import { Vector } from '../math/Vector';
import { Bone } from './Bone';
import { Joint } from './Joint';
export interface Chain<B extends Bone<V, J, T>, V extends Vector<T>, J extends Joint<T>, C extends BaseboneConstraintType, T> {
    clone(): Chain<B, V, J, C, T>;
    clear(): void;

    /**
     * Add a bone to the end of this IK chain of this chain.
	 * <p>
	 * This chain's {@link #getLiveChainLength()} property is updated to take into account the length of the
	 * new bone added to the chain.
	 * <p>
	 * In addition, if the bone being added is the very first bone, then this chain's
	 * {@link #getBaseLocation()} property is set from the start joint location of the bone.
	 * 
	 * @param bone The Bone to add to this Chain.
     */
    addBone( bone: B ): void;

    /**
	 * Add a bone to the end of this IK chain given the direction unit vector and length of the new bone to add.
	 * <p>
	 * The bone added does not have any rotational constraints enforced, and will be drawn with a default color
	 * of white at full opacity.
	 * <p>
	 * This method can only be used when the IK chain contains a basebone, as without it we do not
	 * have a start location for this bone (i.e. the end location of the previous bone).
	 * <p>
	 * If this method is executed on a chain which does not contain a basebone then a {@link RuntimeException}
	 * is thrown.
	 * <p>
	 * If this method is provided with a direction unit vector of zero, or a bone length of zero then then an
	 * {@link IllegalArgumentException} is thrown.
	 * 
	 * @param directionUV The initial direction of the new bone
	 * @param length The length of the new bone
	 */
	addConsecutiveBone(directionUV: V, length: number): void;

    /**
	 * Remove a bone from this IK chain by its zero-indexed location in the chain.
	 * If the bone number to be removed does not exist in the chain then an IllegalArgumentException is thrown.
	 * 
	 * @param boneNumber The zero-indexed bone to remove from this IK chain.
	 */
    removeBone( id: number ): void;
    
    getBoneConnectionPoint(): ConnectionType;

    /**
	 * Return the index of the bone in another chain that this this chain is connected to.
	 * <p>
	 * Returns -1 (default) if this chain is not connected to another chain.
	 * 
	 * @return The zero-indexed number of the bone we are connected to in the chain we are connected to.
	 */
    getConnectedBoneNumber(): number;

    /**
	 * Return the index of the chain in a FabrikStructure that this this chain is connected to.
	 * <p>
	 * Returns -1 (default) if this chain is not connected to another chain.
	 * 
	 * @return The zero-index number of the chain we are connected to.
	 */ 
    getConnectedChainNumber(): number;

	/**
	 * Return the basebone constraint type of this chain.
	 * 
	 * @return The basebone constraint type of this chain.
	 */
    getBaseboneConstraintType(): number;

    /**
	 * Return the basebone relative unit vector of this chain.
	 * 
	 * This direction is updated by the Structure when this chain is connected to another chain. There is
	 * no other possible way of doing it as we have no knowledge of other chains, but the structure does, allowing
	 * us to calculate this relative constraint UV.
	 *  
	 * @return The basebone relative constraint UV as updated (on solve) by the structure containing this chain.
	 */ 
    getBaseboneConstraintUV(): V | undefined;

    /**
	 * Return the base location of the IK chain.
	 * <p>
	 * Regardless of how many bones are contained in the chain, the base location is always the start location of the
	 * first bone in the chain.
	 * 
	 * @return	The location of the start joint of the first bone in this chain.
	 */
    getBaseLocation(): V;

    /**
	 * Return the location of the end effector in the IK chain.
	 * <p>
	 * Regardless of how many bones are contained in the chain, the end effector is always the end location
	 * of the final bone in the chain. 
	 * 
	 * @return	The location of this chain's end effector.
	 */
    getEffectorLocation(): V;

    /**
	 * Return the target of the last solve attempt.
	 * <p>
	 * The target location and the effector location are not necessarily at the same location unless the chain has been solved
	 * for distance, and even then they are still likely to be <i>similar</i> rather than <b>identical</b> values.
	 * 
	 * @return	The target location of the last solve attempt.
	 */
    getLastTargetLocation(): V;

    /**
	 * Return the current length of this IK chain.
	 * <p>
	 * This method does not dynamically re-calculate the length of the chain - it merely returns the previously
	 * calculated chain length, which gets updated each time a bone is added to the chain.
	 * 
	 * @return The length of this IK chain.
	 */
    getLiveChainLength(): number;
    
    setConnectedBoneNumber( boneNumber: number ): void;
    setConnectedChainNumber( chainNumber: number ): void;
    setBoneConnectionPoint( point: ConnectionType ): void;

    /**
	 * Set a directional constraint for the basebone.
	 * <p>
	 * @param constraintUV The direction unit vector to constrain the basebone to.
	 */
    setBaseboneConstraintUV( uv: V ): void;

    /**
	 * Set the base location of this chain.
	 *
	 * @param baseLocation The location.
	 */
    setBaseLocation( baseLocation: V ): void;

    /**
	 * Set the fixed basebone mode for this chain.
	 * <p>
	 * If the basebone is 'fixed' in place, then its start location cannot move. The bone is still allowed to
	 * rotate, with or without constraints.
	 * <p>
	 * Specifying a non-fixed base location while this chain is connected to another chain will result in a
	 * RuntimeException being thrown.
	 * <p>
	 * Fixing the basebone's start location in place and constraining to a global absolute direction are
	 * mutually exclusive. Disabling fixed base mode while the chain's constraint type is
	 * BaseboneConstraintType2/3D.GLOBAL_ABSOLUTE will result in a RuntimeException being thrown.	 * 
	 *  
	 * @param value Whether or not to fix the basebone start location in place.
	 */
    setFixedBaseMode( value: boolean ): void;

    /**
	 * Set the maximum number of attempts that will be made to solve this IK chain.
	 * <p>
	 * The FABRIK algorithm may require more than a single pass in order to solve
	 * a given IK chain for an acceptable distance threshold. If we reach this
	 * iteration limit then we stop attempting to solve the IK chain.
	 * <p>
	 * Specifying a maxIterations value of less than 1 will result in an IllegalArgumentException is thrown.
	 * 
	 * @param maxIterations The maximum number of attempts that will be made to solve this IK chain.
	 */
    setMaxIterationAttempts( maxIterations: number ): void;

    /**
	 * Set the minimum iteration change before we dynamically abort any further attempts to solve this IK chain.
	 * <p>
	 * If the current solve distance changes by less than this amount between solve attempt then we consider the
	 * solve process to have stalled and dynamically abort any further attempts to solve the chain to minimize CPU usage.
	 * <p>
	 * If a minIterationChange value of less than zero is provided then an IllegalArgumentException is thrown.
	 * 
	 * @param minIterationChange The minimum change in solve distance from one iteration to the next.
	 */
    setMinIterationChange( minIterationChange: number ): void;

    /**
	 * Set the distance threshold within which we consider the IK chain to be solved.
	 * <p>
	 * If a solve distance of less than zero is provided then an IllegalArgumentException is thrown.
	 * 
	 * @param solveDistance The distance between the end effector of this IK chain and target within which we will accept the solution.
	 */
    setSolveDistanceThreshold( solveDistance: number ): void;
    
    /**
	 * Solve this IK chain for the current embedded target location.
	 * 
	 * The embedded target location can be updated by calling updateEmbeddedTarget(V).
	 * 
	 * @return The distance between the end effector and the chain's embedded target location for our best solution.
	 */
    solveForEmbeddedTarget(): void;

    resetTarget(): void;

    /**
	 * Solve the IK chain for the target.
	 * <p>
	 * Iteratively attempt up to solve the chain up to a maximum of mMaxIterationAttempts.
	 * 
	 * This method may return early if any of the following conditions are met:
	 * <ul>
	 * <li>We've already solved for this target location,</li>
	 * <li>We successfully solve for distance, or</li>
	 * <li>We grind to a halt (i.e. low iteration change compared to previous solution).</li>
	 * </ul>
	 * 
	 * @param newTarget The target location to solve this IK chain for.
	 * 
	 * @return The distance between the end effector and the target for our best solution
	 */
    solveForTarget( t: V ): number;
    
    solveIK( target: V ): number | undefined;

    /***
	 * Calculate the length of this IK chain by adding up the lengths of each bone.
	 * <p>
	 * The resulting chain length is returned by the {@link #getLiveChainLength()} property.
	 * <p>
	 * This method is called each time a bone is added to the chain. In addition, the
	 * length of each bone is recalculated during the process to ensure that our chain
	 * length is accurate.
	 */
    updateChainLength(): void;
}