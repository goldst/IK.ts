import { V3 } from './math/V3';
import { V2 } from './math/V2';
export declare const REVISION = "1.3.3";
export declare const PRECISION = 0.001;
export declare const PRECISION_DEG = 0.01;
export declare const MAX_VALUE: number;
export declare const PI: number;
export declare const TORAD: number;
export declare const TODEG: number;
export declare enum BaseboneConstraintType {
    NONE = 1,
    GLOBAL_ROTOR = 2,
    GLOBAL_HINGE = 3,
    LOCAL_ROTOR = 4,
    LOCAL_HINGE = 5,
    GLOBAL_ABSOLUTE = 6,
    LOCAL_RELATIVE = 7,
    LOCAL_ABSOLUTE = 8
}
export declare enum JointType {
    J_BALL = 10,
    J_LOCAL = 11,
    J_GLOBAL = 12
}
export declare enum ConnectionType {
    START = 20,
    END = 21
}
export declare const X_AXE: V3;
export declare const Y_AXE: V3;
export declare const Z_AXE: V3;
export declare const X_NEG: V3;
export declare const Y_NEG: V3;
export declare const Z_NEG: V3;
export declare const UP: V2;
export declare const DOWN: V2;
export declare const LEFT: V2;
export declare const RIGHT: V2;
