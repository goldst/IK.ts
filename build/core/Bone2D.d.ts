import { ConnectionType, JointType } from '../constants';
import { Joint2D } from './Joint2D';
import { V2 } from '../math/V2';
export declare class Bone2D {
    isBone2D: boolean;
    start: V2;
    end: V2;
    length: number;
    joint: Joint2D;
    globalConstraintUV: V2;
    boneConnectionPoint: ConnectionType;
    name: string;
    constructor(Start: V2, End?: V2, directionUV?: V2, length?: number, clockwiseDegs?: number, anticlockwiseDegs?: number);
    clone(): Bone2D;
    setName(name: string): void;
    setBoneConnectionPoint(bcp: number): void;
    setStartLocation(v: V2): void;
    setEndLocation(v: V2): void;
    setLength(length: number): void;
    setGlobalConstraintUV(v: V2): void;
    setJoint(joint: Joint2D): void;
    setClockwiseConstraintDegs(angleDegs: number): void;
    setAnticlockwiseConstraintDegs(angleDegs: number): void;
    setJointConstraintCoordinateSystem(coordSystem: JointType): void;
    getGlobalConstraintUV(): V2;
    getBoneConnectionPoint(): ConnectionType;
    getDirectionUV(): V2;
    getLength(): number;
}
