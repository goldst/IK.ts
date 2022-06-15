import { Vector } from '../math/Vector';
import { Joint } from './Joint';
import { ConnectionType } from '../constants';

/**
 * Interface for a bone
 */
export interface Bone<V extends Vector<T>, J extends Joint<T>, T> {
    /**
     * Each bone has precisely one joint. Although the joint does not
	 * have a location, it can conceptually be thought of to be located at the start location
	 * of the bone.
     */
    joint: J;

    /**
     * 
     */
    clone(): Bone<V, J, T>;

    /**
     * 
     * @param bcp 
     */
    setBoneConnectionPoint( bcp: ConnectionType ): void;
    
    /**
     * Set the start location of this bone from a provided vector.
	 * <p>
	 * No validation is performed on the value of the start location - be aware
	 * that adding a bone with identical start and end locations will result in
	 * undefined behaviour. 
	 * @param location The bone start location specified as a vector.
     */
    setStartLocation( location: V ): void;
    
    /**
     * Set the end location of this bone from a provided vector.
	 * <p>
	 * No validation is performed on the value of the end location - be aware
	 * that adding a bone with identical start and end locations will result in
	 * undefined behaviour. 
	 * @param location The bone end location specified as a vector.
     */
    setEndLocation( location: V ): void;
    
    /**
     * 
     * @param lng 
     */
    setLength( lng: number ): void;
    
    /**
     * 
     * @param joint 
     */
    setJoint( joint: Joint<T> ): void;

    /**
     * 
     */
    getBoneConnectionPoint(): ConnectionType;
    
    /**
     * 
     */
    getDirectionUV(): V;

    /**
     * Return the length of this bone. This value is calculated when the bone is constructed
	 * and used throughout the lifetime of the bone.
	 * 
	 * @return The length of this bone, as stored in the mLength property.
     */
    getLength(): number;
}
