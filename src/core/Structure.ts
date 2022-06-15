import { BaseboneConstraintType } from '../constants';
import { Vector } from '../math/Vector';
import { Bone } from './Bone';
import { Chain } from './Chain';
import { Joint } from './Joint';

/**
 * Structure interface
 */
export interface Structure<TC extends Chain<B, V, J, C, T>, V extends Vector<T>, B extends Bone<V, J, T>, J extends Joint<T>, C extends BaseboneConstraintType, T> {
    update(): void;
    clear(): void;

    /**
     * Add a Chain object to a Structure object.
     * <p>
     * Adding a chain using this method adds the chain to the structure, but does not connect it to any existing chain in the structure.
     * However, all chains in a structure share the same target, and all chains in the structure can be solved for the target location
     * via a single call to updateTarget on this structure.
     *  
     * @param  chain	The chain to add to this structure.
     **/
    add( chain: TC, target: V ): void;
    remove( id: number ): void;
    setFixedBaseMode( value: boolean ): void;

    /**
     * Return the number of chains in this structure.
     * 
     * @return  The number of chains in this structure.
     */
    getNumChains(): number

    /**
     * Return a chain which exists in this structure.
     * <p>
     * Note: Chains are zero-indexed.
     * 
     * @param id The zero-indexed chain in this structure to return.
     * @return The desired chain.
     */
    getChain( id: number ): TC;

    /**
     * Connect a chain to an existing chain in this structure.
     * <p>
     * Both chains and bones are are zero indexed.
     * <p>
     * If the existingChainNumber or existingBoneNumber specified to connect to does not exist in this structure
     * then an IllegalArgumentExeception is thrown.
     * 
     * @param chain The chain to connect to this structure
     * @param chainNumber The index of the chain to connect the new chain to.
     * @param boneNumber The index of the bone to connect the new chain to within the existing chain.
     * @param point Whether the new chain should connect to the START or END of the specified bone in the specified chain.
     */
    connectChain( chain: TC, chainNumber: number, boneNumber: number, point: string, target: V): void;
}