import { V2 } from '../math/V2';
import { Chain2D } from './Chain2D';
import * as THREE from 'three';
import { Bone2D } from './Bone2D';
export declare class Structure2D {
    static isStructure2D: boolean;
    fixedBaseMode: boolean;
    chains: Chain2D[];
    meshChains: THREE.Mesh[][];
    targets: V2[];
    numChains: number;
    scene: THREE.Scene;
    isWithMesh: boolean;
    constructor(scene: THREE.Scene);
    update(): void;
    setFixedBaseMode(value: boolean): void;
    clear(): void;
    add(chain: Chain2D, target: V2, meshBone?: boolean): void;
    remove(id: number): void;
    getNumChains(): number;
    getChain(id: number): Chain2D;
    connectChain(Chain: Chain2D, chainNumber: number, boneNumber: number, point: string, target: V2, meshBone: THREE.Mesh): void;
    addChainMeshs(chain: Chain2D): void;
    addBoneMesh(bone: Bone2D): THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial>;
    clearAllBoneMesh(): void;
}
