import { V2 } from './V2';
import { V3 } from './V3';
export declare const _Math: {
    toRad: number;
    toDeg: number;
    pi90: number;
    findAngle: <T extends V2, Bone extends {
        start: T;
        end: T;
    }>(b0: Bone, b1: Bone) => number;
    clamp: (v: number, min: number, max: number) => number;
    lerp: (x: number, y: number, t: number) => number;
    rand: (low: number, high: number) => number;
    randInt: (low: number, high: number) => number;
    nearEquals: (a: number, b: number, t: number) => boolean;
    perpendicular: (a: V3, b: V3) => boolean;
    genPerpendicularVectorQuick: (v: V3) => V3;
    genPerpendicularVectorFrisvad: (v: V3) => V3;
    rotateXDegs: (v: V2 | V3, angle: number) => V2 | V3;
    rotateYDegs: (v: V2 | V3, angle: number) => V2 | V3;
    rotateZDegs: (v: V3, angle: number) => V3;
    withinManhattanDistance: (v1: V3, v2: V3, distance: number) => boolean;
    manhattanDistanceBetween: (v1: V2 | V3, v2: V2 | V3) => number;
    distanceBetween: (v1: V2 | V3, v2: V2 | V3) => number;
    rotateDegs: (v: V2, angle: number) => V2;
    validateDirectionUV: (directionUV: V2) => void;
    validateLength: (length: number) => void;
};
