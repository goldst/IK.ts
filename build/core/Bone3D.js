"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bone3D = void 0;
var constants_1 = require("../constants");
var Joint3D_1 = require("./Joint3D");
var V3_1 = require("../math/V3");
var Bone3D = /** @class */ (function () {
    function Bone3D(startLocation, endLocation, directionUV, length, color) {
        this.joint = new Joint3D_1.Joint3D();
        this.start = new V3_1.V3();
        this.end = new V3_1.V3();
        this.boneConnectionPoint = constants_1.ConnectionType.END;
        this.length = 0;
        this.color = color || 0xFFFFFF;
        this.name = '';
        this.init(startLocation, endLocation, directionUV, length);
    }
    Bone3D.prototype.init = function (startLocation, endLocation, directionUV, length) {
        this.setStartLocation(startLocation);
        if (endLocation) {
            this.setEndLocation(endLocation);
            this.length = this.getLength();
        }
        else if (length && directionUV) {
            this.setLength(length);
            this.setEndLocation(this.start.plus(directionUV.normalised().multiplyScalar(length)));
        }
    };
    Bone3D.prototype.clone = function () {
        var b = new Bone3D(this.start, this.end);
        b.joint = this.joint.clone();
        return b;
    };
    // SET
    Bone3D.prototype.setColor = function (c) {
        this.color = c;
    };
    Bone3D.prototype.setBoneConnectionPoint = function (bcp) {
        this.boneConnectionPoint = bcp;
    };
    Bone3D.prototype.setHingeClockwise = function (angle) {
        this.joint.setHingeClockwise(angle);
    };
    Bone3D.prototype.setHingeAnticlockwise = function (angle) {
        this.joint.setHingeAnticlockwise(angle);
    };
    Bone3D.prototype.setBallJointConstraintDegs = function (angle) {
        this.joint.setBallJointConstraintDegs(angle);
    };
    Bone3D.prototype.setStartLocation = function (location) {
        this.start.copy(location);
    };
    Bone3D.prototype.setEndLocation = function (location) {
        this.end.copy(location);
    };
    Bone3D.prototype.setLength = function (lng) {
        if (lng > 0)
            this.length = lng;
    };
    Bone3D.prototype.setJoint = function (joint) {
        this.joint = joint;
    };
    // GET
    Bone3D.prototype.getBoneConnectionPoint = function () {
        return this.boneConnectionPoint;
    };
    Bone3D.prototype.getDirectionUV = function () {
        return this.end.minus(this.start).normalize();
    };
    Bone3D.prototype.getLength = function () {
        return this.start.distanceTo(this.end);
    };
    Bone3D.isBone3D = true;
    return Bone3D;
}());
exports.Bone3D = Bone3D;
