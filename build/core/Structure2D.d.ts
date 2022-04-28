import { V2 } from '../math/V2';
import { Chain2D } from './Chain2D';
export declare class Structure2D {
    static isStructure2D: boolean;
    fixedBaseMode: boolean;
    chains: Chain2D[];
    targets: V2[];
    numChains: number;
    constructor();
    update(): void;
    setFixedBaseMode(value: boolean): void;
    clear(): void;
    add(chain: Chain2D, target: V2): void;
    remove(id: number): void;
    getNumChains(): number;
    getChain(id: number): Chain2D;
    connectChain(Chain: Chain2D, chainNumber: number, boneNumber: number, point: string): void;
}
