import { V3 } from '../math/V3';
import { JointType } from '../constants';
export declare class Joint3D {
    static isJoint3D: boolean;
    rotor: number;
    min: number;
    max: number;
    freeHinge: boolean;
    rotationAxisUV: V3;
    referenceAxisUV: V3;
    type: JointType;
    constructor();
    clone(): Joint3D;
    testAngle(): void;
    validateAngle(a: number): number;
    setAsBallJoint(angle: number): void;
    setHinge(type: JointType, rotationAxis: V3, clockwise: number, anticlockwise: number, referenceAxis: V3): void;
    getHingeReferenceAxis(): V3;
    getHingeRotationAxis(): V3;
    setBallJointConstraintDegs(angle: number): void;
    setHingeClockwise(angle: number): void;
    setHingeAnticlockwise(angle: number): void;
}
