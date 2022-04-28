"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structure3D = void 0;
var constants_1 = require("../constants");
var M3_1 = require("../math/M3");
/**
 * A Structure3D contains one or more Chain3D objects, which we can solve using the FABRIK (Forward And
 * Backward Reaching Inverse Kinematics) algorithm for specified target locations.
 * The Structure3D class is merely a convenient holder for a list of Chain3D objects which allows
 * multiple chains to have their target location updated, as well as solving and drawing the multiple chains
 * attached to the Structure3D object using one method call per structure.
 * If you do not intend on attaching multiple Chain3D objects into a complex structure, for example one with
 * multiple effectors, then you may be better served by creating individual Chain3D objects and using those
 * objects directly.
 **/
var Structure3D = /** @class */ (function () {
    function Structure3D() {
        this.fixedBaseMode = true;
        this.chains = [];
        this.targets = [];
        this.numChains = 0;
        this.tmpMtx = new M3_1.M3();
    }
    Structure3D.prototype.update = function () {
        var _a;
        var chain, target;
        var hostChainNumber;
        var hostBone, constraintType;
        //var i =  this.numChains;
        //while(i--){
        for (var i = 0; i < this.numChains; i++) {
            chain = this.chains[i];
            target = this.targets[i];
            hostChainNumber = chain.getConnectedChainNumber();
            if (hostChainNumber !== -1) {
                hostBone = this.chains[hostChainNumber].bones[chain.getConnectedBoneNumber()];
                chain.setBaseLocation(chain.getBoneConnectionPoint() === constants_1.ConnectionType.START ? hostBone.start : hostBone.end);
                // Now that we've clamped the base location of this chain to the start or end point of the bone in the chain we are connected to, it's
                // time to deal with any base bone constraints...
                constraintType = chain.getBaseboneConstraintType();
                var relativeBaseboneConstraintUV = void 0;
                switch (constraintType) {
                    case constants_1.BaseboneConstraintType.NONE: // Nothing to do because there's no basebone constraint
                    case constants_1.BaseboneConstraintType.GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                    case constants_1.BaseboneConstraintType.GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                        break;
                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling solveForTarget
                    case constants_1.BaseboneConstraintType.LOCAL_ROTOR:
                    case constants_1.BaseboneConstraintType.LOCAL_HINGE:
                        //chain.resetTarget(); // ??
                        // Get the direction of the bone this chain is connected to and create a rotation matrix from it.
                        this.tmpMtx.createRotationMatrix(hostBone.getDirectionUV());
                        //var connectionBoneMatrix = new FIK.M3().createRotationMatrix( hostBone.getDirectionUV() );
                        // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone
                        // to make the basebone constraint UV relative to the direction of bone it's connected to.
                        //var relativeBaseboneConstraintUV = connectionBoneMatrix.times( c.getBaseboneConstraintUV() ).normalize();
                        relativeBaseboneConstraintUV = (_a = chain.getBaseboneConstraintUV()) === null || _a === void 0 ? void 0 : _a.clone().applyM3(this.tmpMtx);
                        // Update our basebone relative constraint UV property
                        chain.setBaseboneRelativeConstraintUV(relativeBaseboneConstraintUV);
                        // Update the relative reference constraint UV if we hav a local hinge
                        if (constraintType === constants_1.BaseboneConstraintType.LOCAL_HINGE)
                            chain.setBaseboneRelativeReferenceConstraintUV(chain.bones[0].joint.getHingeReferenceAxis().clone().applyM3(this.tmpMtx));
                        break;
                }
            }
            // Finally, update the target and solve the chain
            if (!chain.useEmbeddedTarget)
                chain.solveForTarget(target);
            else
                chain.solveForEmbeddedTarget();
        }
    };
    Structure3D.prototype.clear = function () {
        var i;
        i = this.numChains;
        while (i--) {
            this.remove(i);
        }
        this.chains = [];
        this.targets = [];
    };
    Structure3D.prototype.add = function (chain, target) {
        this.chains.push(chain);
        this.targets.push(target);
        this.numChains++;
    };
    Structure3D.prototype.remove = function (id) {
        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.targets.splice(id, 1);
        this.numChains--;
    };
    Structure3D.prototype.setFixedBaseMode = function (value) {
        this.fixedBaseMode = value;
        var i = this.numChains, host;
        while (i--) {
            host = this.chains[i].getConnectedChainNumber();
            if (host === -1)
                this.chains[i].setFixedBaseMode(this.fixedBaseMode);
        }
    };
    Structure3D.prototype.getNumChains = function () {
        return this.numChains;
    };
    Structure3D.prototype.getChain = function (id) {
        return this.chains[id];
    };
    Structure3D.prototype.connectChain = function (Chain, chainNumber, boneNumber, point, target) {
        var c = chainNumber;
        var n = boneNumber;
        if (chainNumber > this.numChains)
            return;
        if (boneNumber > this.chains[chainNumber].numBones)
            return;
        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var chain = Chain.clone(); //new Fullik.Chain( newChain );
        // Connect the copy of the provided chain to the specified chain and bone in this structure
        //chain.connectToStructure( this, chainNumber, boneNumber );
        chain.setBoneConnectionPoint(point === 'end' ? constants_1.ConnectionType.END : constants_1.ConnectionType.START);
        chain.setConnectedChainNumber(c);
        chain.setConnectedBoneNumber(n);
        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start location of the given bone in the given chain.
        var position = point === 'end' ? this.chains[c].bones[n].end : this.chains[c].bones[n].start;
        chain.setBaseLocation(position);
        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        chain.setFixedBaseMode(true);
        // Translate the chain we're connecting to the connection point
        for (var i = 0; i < chain.numBones; i++) {
            chain.bones[i].start.add(position);
            chain.bones[i].end.add(position);
        }
        this.add(chain, target);
    };
    return Structure3D;
}());
exports.Structure3D = Structure3D;
