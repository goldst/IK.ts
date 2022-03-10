import { JointType } from '../constants';
export declare class Joint2D {
    isJoint2D: boolean;
    coordinateSystem: JointType;
    min: number;
    max: number;
    constructor(clockwise?: number, antiClockwise?: number, coordSystem?: JointType);
    clone(): Joint2D;
    validateAngle(a: number): number;
    set(joint: Joint2D): void;
    setClockwiseConstraintDegs(angle: number): void;
    setAnticlockwiseConstraintDegs(angle: number): void;
    setConstraintCoordinateSystem(coordSystem: JointType): void;
    getConstraintCoordinateSystem(): JointType;
}
