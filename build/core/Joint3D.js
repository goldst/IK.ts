"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joint3D = void 0;
var V3_1 = require("../math/V3");
var constants_1 = require("../constants");
var Joint3D = /** @class */ (function () {
    function Joint3D() {
        this.rotor = constants_1.PI;
        this.min = -constants_1.PI;
        this.max = constants_1.PI;
        this.freeHinge = true;
        this.rotationAxisUV = new V3_1.V3();
        this.referenceAxisUV = new V3_1.V3();
        this.type = constants_1.JointType.J_BALL;
    }
    Joint3D.prototype.clone = function () {
        var j = new Joint3D();
        j.type = this.type;
        j.rotor = this.rotor;
        j.max = this.max;
        j.min = this.min;
        j.freeHinge = this.freeHinge;
        j.rotationAxisUV.copy(this.rotationAxisUV);
        j.referenceAxisUV.copy(this.referenceAxisUV);
        return j;
    };
    Joint3D.prototype.testAngle = function () {
        if (this.max === constants_1.PI && this.min === -constants_1.PI)
            this.freeHinge = true;
        else
            this.freeHinge = false;
    };
    Joint3D.prototype.validateAngle = function (a) {
        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;
    };
    Joint3D.prototype.setAsBallJoint = function (angle) {
        this.rotor = this.validateAngle(angle) * constants_1.TORAD;
        this.type = constants_1.JointType.J_BALL;
    };
    // Specify this joint to be a hinge with the provided settings
    Joint3D.prototype.setHinge = function (type, rotationAxis, clockwise, anticlockwise, referenceAxis) {
        this.type = type;
        if (clockwise < 0)
            clockwise *= -1;
        this.min = -this.validateAngle(clockwise) * constants_1.TORAD;
        this.max = this.validateAngle(anticlockwise) * constants_1.TORAD;
        this.testAngle();
        this.rotationAxisUV.copy(rotationAxis).normalize();
        this.referenceAxisUV.copy(referenceAxis).normalize();
    };
    // GET
    Joint3D.prototype.getHingeReferenceAxis = function () {
        return this.referenceAxisUV;
    };
    Joint3D.prototype.getHingeRotationAxis = function () {
        return this.rotationAxisUV;
    };
    // SET
    Joint3D.prototype.setBallJointConstraintDegs = function (angle) {
        this.rotor = this.validateAngle(angle) * constants_1.TORAD;
    };
    Joint3D.prototype.setHingeClockwise = function (angle) {
        if (angle < 0)
            angle *= -1;
        this.min = -this.validateAngle(angle) * constants_1.TORAD;
        this.testAngle();
    };
    Joint3D.prototype.setHingeAnticlockwise = function (angle) {
        this.max = this.validateAngle(angle) * constants_1.TORAD;
        this.testAngle();
    };
    Joint3D.isJoint3D = true;
    return Joint3D;
}());
exports.Joint3D = Joint3D;
