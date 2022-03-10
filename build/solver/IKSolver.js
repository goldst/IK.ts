"use strict";
//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants';
Object.defineProperty(exports, "__esModule", { value: true });
exports.IKSolver = void 0;
var IKSolver = /** @class */ (function () {
    function IKSolver() {
        this.goal = null;
        this.swivelAngle = 0;
        this.iteration = 40;
        this.thresholds = { position: 0.1, rotation: 0.1 };
    }
    return IKSolver;
}());
exports.IKSolver = IKSolver;
