import { M3 } from '../math/M3';
import { V3 } from '../math/V3';
import { Bone3D } from './Bone3D';
import { Chain3D } from './Chain3D';
import * as THREE from 'three';
export declare class Structure3D {
    fixedBaseMode: boolean;
    chains: Chain3D[];
    meshChains: THREE.Mesh[][];
    targets: V3[];
    numChains: number;
    scene?: THREE.Scene;
    tmpMtx: M3;
    isWithMesh: boolean;
    constructor(scene?: THREE.Scene);
    update(): void;
    clear(): void;
    add(chain: Chain3D, target: V3, meshBone?: boolean): void;
    remove(id: number): void;
    setFixedBaseMode(value: boolean): void;
    getNumChains(): number;
    getChain(id: number): Chain3D;
    connectChain(Chain: Chain3D, chainNumber: number, boneNumber: number, point: string, target: V3, meshBone: THREE.Mesh, color?: number): void;
    addChainMeshs(chain: Chain3D): void;
    addBoneMesh(bone: Bone3D, prev: number, ar: THREE.Mesh[], chain: Chain3D): THREE.Mesh<THREE.CylinderGeometry, THREE.MeshStandardMaterial>;
    clearAllBoneMesh(): void;
}
