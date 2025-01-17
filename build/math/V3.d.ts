import { M3 } from './M3';
export declare class V3 {
    static isVector3: boolean;
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    distanceTo(v: V3): number;
    distanceToSquared(v: V3): number;
    abs(): V3;
    dot(v: V3): number;
    length(): number;
    lengthSq(): number;
    normalize(): this;
    normalised(): V3;
    add(v: V3): this;
    min(v: V3): this;
    plus(v: V3): V3;
    minus(v: V3): V3;
    divideBy(s: number): V3;
    multiply(s: number): V3;
    multiplyScalar(scalar: number): this;
    divideScalar(scalar: number): this;
    cross(v: V3): V3;
    crossVectors(a: V3, b: V3): this;
    negate(): this;
    negated(): V3;
    clone(): V3;
    copy(v: V3): this;
    approximatelyEquals(v: V3, t: number): boolean;
    zero(): this;
    rotate(angle: number, axe: 'X' | 'Y' | 'Z'): this;
    projectOnVector(vector: V3): this;
    get projectOnPlane(): (planeNormal: V3) => this;
    applyM3(m: M3): this;
    applyMatrix3(m: M3): this;
    applyQuaternion(q: V3 & {
        w: number;
    }): this;
    sign(v: V3, normal: V3): 1 | -1;
    angleTo(v: V3): number;
    getSignedAngle(v: V3, normal: V3): number;
    constrainedUV(referenceAxis: V3, rotationAxis: V3, mtx: M3, min: number, max: number): this;
    limitAngle(base: V3, mtx: M3, max: number): this;
}
