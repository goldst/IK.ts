"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.V2 = void 0;
var V2 = /** @class */ (function () {
    function V2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    V2.prototype.set = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        return this;
    };
    V2.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    V2.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    V2.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    V2.prototype.divideScalar = function (scalar) {
        return this.multiplyScalar(1 / scalar);
    };
    V2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    V2.prototype.normalize = function () {
        return this.divideScalar(this.length() || 1);
    };
    V2.prototype.normalised = function () {
        return new V2(this.x, this.y).normalize();
    };
    V2.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    V2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    V2.prototype.plus = function (v) {
        return new V2(this.x + v.x, this.y + v.y);
    };
    V2.prototype.min = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    V2.prototype.minus = function (v) {
        return new V2(this.x - v.x, this.y - v.y);
    };
    V2.prototype.divideBy = function (value) {
        return new V2(this.x, this.y).divideScalar(value);
    };
    V2.prototype.dot = function (a) {
        return this.x * a.x + this.y * a.y;
    };
    V2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    V2.prototype.negated = function () {
        return new V2(-this.x, -this.y);
    };
    V2.prototype.clone = function () {
        return new V2(this.x, this.y);
    };
    V2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    V2.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    V2.prototype.sign = function (v) {
        var s = this.cross(v);
        return s >= 0 ? 1 : -1;
    };
    V2.prototype.approximatelyEquals = function (v, t) {
        if (t < 0)
            return false;
        var xDiff = Math.abs(this.x - v.x);
        var yDiff = Math.abs(this.y - v.y);
        return (xDiff < t && yDiff < t);
    };
    V2.prototype.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x = this.x * cos - this.y * sin;
        var y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    };
    V2.prototype.angleTo = function (v) {
        var a = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));
        if (a <= -1)
            return Math.PI;
        if (a >= 1)
            return 0;
        return Math.acos(a);
    };
    V2.prototype.getSignedAngle = function (v) {
        var a = this.angleTo(v);
        var s = this.sign(v);
        return s === 1 ? a : -a;
    };
    V2.prototype.constrainedUV = function (baselineUV, min, max) {
        var angle = baselineUV.getSignedAngle(this);
        if (angle > max)
            this.copy(baselineUV).rotate(max);
        if (angle < min)
            this.copy(baselineUV).rotate(min);
        return this;
    };
    V2.isVector2 = true;
    return V2;
}());
exports.V2 = V2;
