import { V3 } from './V3';
export declare class M3 {
    static isMatrix3: boolean;
    elements: number[];
    constructor();
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
    identity(): this;
    setV3(xAxis: V3, yAxis: V3, zAxis: V3): this;
    transpose(): this;
    createRotationMatrix(referenceDirection: V3): this;
    rotateAboutAxis(v: V3, angle: number, rotationAxis: V3): V3;
}
