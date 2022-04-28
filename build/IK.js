"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structure2D = exports.Chain2D = exports.Bone2D = exports.Joint2D = exports.Structure3D = exports.Chain3D = exports.Bone3D = exports.Joint3D = exports.M3 = exports.V3 = exports.V2 = exports._Math = void 0;
require("./polyfills");
var Math_1 = require("./math/Math");
Object.defineProperty(exports, "_Math", { enumerable: true, get: function () { return Math_1._Math; } });
var V2_1 = require("./math/V2");
Object.defineProperty(exports, "V2", { enumerable: true, get: function () { return V2_1.V2; } });
var V3_1 = require("./math/V3");
Object.defineProperty(exports, "V3", { enumerable: true, get: function () { return V3_1.V3; } });
var M3_1 = require("./math/M3");
Object.defineProperty(exports, "M3", { enumerable: true, get: function () { return M3_1.M3; } });
var Joint3D_1 = require("./core/Joint3D");
Object.defineProperty(exports, "Joint3D", { enumerable: true, get: function () { return Joint3D_1.Joint3D; } });
var Bone3D_1 = require("./core/Bone3D");
Object.defineProperty(exports, "Bone3D", { enumerable: true, get: function () { return Bone3D_1.Bone3D; } });
var Chain3D_1 = require("./core/Chain3D");
Object.defineProperty(exports, "Chain3D", { enumerable: true, get: function () { return Chain3D_1.Chain3D; } });
var Structure3D_1 = require("./core/Structure3D");
Object.defineProperty(exports, "Structure3D", { enumerable: true, get: function () { return Structure3D_1.Structure3D; } });
var Joint2D_1 = require("./core/Joint2D");
Object.defineProperty(exports, "Joint2D", { enumerable: true, get: function () { return Joint2D_1.Joint2D; } });
var Bone2D_1 = require("./core/Bone2D");
Object.defineProperty(exports, "Bone2D", { enumerable: true, get: function () { return Bone2D_1.Bone2D; } });
var Chain2D_1 = require("./core/Chain2D");
Object.defineProperty(exports, "Chain2D", { enumerable: true, get: function () { return Chain2D_1.Chain2D; } });
var Structure2D_1 = require("./core/Structure2D");
Object.defineProperty(exports, "Structure2D", { enumerable: true, get: function () { return Structure2D_1.Structure2D; } });
__exportStar(require("./constants"), exports);
