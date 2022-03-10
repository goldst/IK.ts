import { Bone3D } from '../core/Bone3D';
import { Chain3D } from '../core/Chain3D';
import { Structure3D } from '../core/Structure3D';
import { V3 } from '../math/V3';
export declare class IKSolver {
    startBones?: Bone3D;
    endBones?: Bone3D;
    target?: V3;
    goal?: null;
    swivelAngle: number;
    iteration: number;
    thresholds: {
        position: number;
        rotation: number;
    };
    solver?: Structure3D;
    chain?: Chain3D;
    constructor();
}
