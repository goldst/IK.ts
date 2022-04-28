import { BaseboneConstraintType } from '../constants';
import { Vector } from '../math/Vector';
import { Bone } from './Bone';
import { Chain } from './Chain';
import { Joint } from './Joint';
export interface Structure<TC extends Chain<B, V, J, C, T>, V extends Vector<T>, B extends Bone<V, J, T>, J extends Joint<T>, C extends BaseboneConstraintType, T> {
    update(): void;
    clear(): void;
    add( chain: TC, target: V ): void;
    remove( id: number ): void;
    setFixedBaseMode( value: boolean ): void;
    getNumChains(): number
    getChain( id: number ): TC;
    connectChain( Chain: TC, chainNumber: number, boneNumber: number, point: string, target: V): void;
}