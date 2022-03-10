"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bone2D = void 0;
var constants_1 = require("../constants");
var Joint2D_1 = require("./Joint2D");
var V2_1 = require("../math/V2");
var Bone2D = /** @class */ (function () {
    function Bone2D(Start, End, directionUV, length, clockwiseDegs, anticlockwiseDegs, color) {
        this.isBone2D = true;
        this.globalConstraintUV = new V2_1.V2(1, 0);
        this.boneConnectionPoint = constants_1.ConnectionType.END;
        this.start = new V2_1.V2();
        this.end = new V2_1.V2();
        this.length = length || 0;
        this.joint = new Joint2D_1.Joint2D(clockwiseDegs, anticlockwiseDegs);
        this.color = color;
        this.name = '';
        // init
        this.setStartLocation(Start);
        if (End) {
            this.setEndLocation(End);
            if (this.length === 0)
                this.length = this.getLength();
        }
        else if (directionUV) {
            this.setEndLocation(this.start.plus(directionUV.normalised().multiplyScalar(this.length)));
        }
    }
    Bone2D.prototype.clone = function () {
        var b = new Bone2D(this.start, this.end);
        b.length = this.length;
        b.globalConstraintUV = this.globalConstraintUV;
        b.boneConnectionPoint = this.boneConnectionPoint;
        b.joint = this.joint.clone();
        b.color = this.color;
        b.name = this.name;
        return b;
    };
    // SET
    Bone2D.prototype.setName = function (name) {
        this.name = name;
    };
    Bone2D.prototype.setColor = function (c) {
        this.color = c;
    };
    Bone2D.prototype.setBoneConnectionPoint = function (bcp) {
        this.boneConnectionPoint = bcp;
    };
    Bone2D.prototype.setStartLocation = function (v) {
        this.start.copy(v);
    };
    Bone2D.prototype.setEndLocation = function (v) {
        this.end.copy(v);
    };
    Bone2D.prototype.setLength = function (length) {
        if (length > 0)
            this.length = length;
    };
    Bone2D.prototype.setGlobalConstraintUV = function (v) {
        this.globalConstraintUV = v;
    };
    // SET JOINT
    Bone2D.prototype.setJoint = function (joint) {
        this.joint = joint;
    };
    Bone2D.prototype.setClockwiseConstraintDegs = function (angleDegs) {
        this.joint.setClockwiseConstraintDegs(angleDegs);
    };
    Bone2D.prototype.setAnticlockwiseConstraintDegs = function (angleDegs) {
        this.joint.setAnticlockwiseConstraintDegs(angleDegs);
    };
    Bone2D.prototype.setJointConstraintCoordinateSystem = function (coordSystem) {
        this.joint.setConstraintCoordinateSystem(coordSystem);
    };
    // GET
    Bone2D.prototype.getGlobalConstraintUV = function () {
        return this.globalConstraintUV;
    };
    Bone2D.prototype.getBoneConnectionPoint = function () {
        return this.boneConnectionPoint;
    };
    Bone2D.prototype.getDirectionUV = function () {
        return this.end.minus(this.start).normalize();
    };
    Bone2D.prototype.getLength = function () {
        return this.start.distanceTo(this.end);
    };
    return Bone2D;
}());
exports.Bone2D = Bone2D;
