import { Structure2D } from '../core/Structure2D';
import { Bone2D } from '../core/Bone2D';
import * as THREE from 'three';
import { V3 } from '../math/V3';
export declare class HISolver {
    static isHISolver: boolean;
    startBones?: THREE.Object3D;
    endBones?: THREE.Object3D;
    scene: THREE.Scene;
    target?: V3;
    goal: null;
    swivelAngle: number;
    iteration: number;
    thresholds: {
        position: number;
        rotation: number;
    };
    solver: Structure2D;
    bones: THREE.Object3D[];
    numBones: number;
    rotation: number[];
    fakeBone?: Bone2D;
    angles?: number[][];
    constructor(o: {
        scene: THREE.Scene;
        start: THREE.Object3D;
        end: THREE.Object3D;
        angles: number[][];
    });
    initStructure(o: {
        scene: THREE.Scene;
        start: THREE.Object3D;
        end: THREE.Object3D;
        angles: number[][];
    }): void;
    createChain(): void;
    update(): void;
}
