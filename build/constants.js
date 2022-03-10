"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RIGHT = exports.LEFT = exports.DOWN = exports.UP = exports.Z_NEG = exports.Y_NEG = exports.X_NEG = exports.Z_AXE = exports.Y_AXE = exports.X_AXE = exports.ConnectionType = exports.JointType = exports.BaseboneConstraintType = exports.TODEG = exports.TORAD = exports.PI = exports.MAX_VALUE = exports.PRECISION_DEG = exports.PRECISION = exports.REVISION = void 0;
/*
 * A list of constants built-in for
 * the Fik engine.
 */
var V3_1 = require("./math/V3");
var V2_1 = require("./math/V2");
exports.REVISION = '1.3.3';
exports.PRECISION = 0.001;
exports.PRECISION_DEG = 0.01;
exports.MAX_VALUE = Infinity;
exports.PI = Math.PI;
exports.TORAD = Math.PI / 180;
exports.TODEG = 180 / Math.PI;
// chain Basebone Constraint Type
var BaseboneConstraintType;
(function (BaseboneConstraintType) {
    BaseboneConstraintType[BaseboneConstraintType["NONE"] = 1] = "NONE";
    // 3D
    BaseboneConstraintType[BaseboneConstraintType["GLOBAL_ROTOR"] = 2] = "GLOBAL_ROTOR";
    BaseboneConstraintType[BaseboneConstraintType["GLOBAL_HINGE"] = 3] = "GLOBAL_HINGE";
    BaseboneConstraintType[BaseboneConstraintType["LOCAL_ROTOR"] = 4] = "LOCAL_ROTOR";
    BaseboneConstraintType[BaseboneConstraintType["LOCAL_HINGE"] = 5] = "LOCAL_HINGE";
    // 2D
    BaseboneConstraintType[BaseboneConstraintType["GLOBAL_ABSOLUTE"] = 6] = "GLOBAL_ABSOLUTE";
    BaseboneConstraintType[BaseboneConstraintType["LOCAL_RELATIVE"] = 7] = "LOCAL_RELATIVE";
    BaseboneConstraintType[BaseboneConstraintType["LOCAL_ABSOLUTE"] = 8] = "LOCAL_ABSOLUTE"; // Constrained about a direction with relative to the direction of the connected bone
})(BaseboneConstraintType = exports.BaseboneConstraintType || (exports.BaseboneConstraintType = {}));
// joint Type
var JointType;
(function (JointType) {
    JointType[JointType["J_BALL"] = 10] = "J_BALL";
    JointType[JointType["J_LOCAL"] = 11] = "J_LOCAL";
    JointType[JointType["J_GLOBAL"] = 12] = "J_GLOBAL";
})(JointType = exports.JointType || (exports.JointType = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType[ConnectionType["START"] = 20] = "START";
    ConnectionType[ConnectionType["END"] = 21] = "END";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
// Define world-space axis
exports.X_AXE = new V3_1.V3(1, 0, 0);
exports.Y_AXE = new V3_1.V3(0, 1, 0);
exports.Z_AXE = new V3_1.V3(0, 0, 1);
exports.X_NEG = new V3_1.V3(-1, 0, 0);
exports.Y_NEG = new V3_1.V3(0, -1, 0);
exports.Z_NEG = new V3_1.V3(0, 0, -1);
// Define world-space 2D cardinal axes
exports.UP = new V2_1.V2(0, 1);
exports.DOWN = new V2_1.V2(0, -1);
exports.LEFT = new V2_1.V2(-1, 0);
exports.RIGHT = new V2_1.V2(1, 0);
