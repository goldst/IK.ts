import { M3 } from '../math/M3';
import { V3 } from '../math/V3';
import { Chain3D } from './Chain3D';
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
export declare class Structure3D {
    fixedBaseMode: boolean;
    chains: Chain3D[];
    targets: V3[];
    numChains: number;
    tmpMtx: M3;
    constructor();
    update(): void;
    clear(): void;
    add(chain: Chain3D, target: V3): void;
    remove(id: number): void;
    setFixedBaseMode(value: boolean): void;
    getNumChains(): number;
    getChain(id: number): Chain3D;
    connectChain(Chain: Chain3D, chainNumber: number, boneNumber: number, point: string, target: V3): void;
}
