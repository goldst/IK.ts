import { ConnectionType } from '../constants';
import { Joint3D } from './Joint3D';
import { V3 } from '../math/V3';
export declare class Bone3D {
    static isBone3D: boolean;
    joint: Joint3D;
    start: V3;
    end: V3;
    boneConnectionPoint: ConnectionType;
    length: number;
    name: string;
    constructor(startLocation: V3, endLocation?: V3, directionUV?: V3, length?: number);
    init(startLocation: V3, endLocation?: V3, directionUV?: V3, length?: number): void;
    clone(): Bone3D;
    setBoneConnectionPoint(bcp: ConnectionType): void;
    setHingeClockwise(angle: number): void;
    setHingeAnticlockwise(angle: number): void;
    setBallJointConstraintDegs(angle: number): void;
    setStartLocation(location: V3): void;
    setEndLocation(location: V3): void;
    setLength(lng: number): void;
    setJoint(joint: Joint3D): void;
    getBoneConnectionPoint(): ConnectionType;
    getDirectionUV(): V3;
    getLength(): number;
}
