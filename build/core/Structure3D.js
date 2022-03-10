"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Structure3D = void 0;
var constants_1 = require("../constants");
var M3_1 = require("../math/M3");
var THREE = require("three");
var three_1 = require("three");
var Structure3D = /** @class */ (function () {
    function Structure3D(scene) {
        this.fixedBaseMode = true;
        this.chains = [];
        this.meshChains = [];
        this.targets = [];
        this.numChains = 0;
        this.scene = scene;
        this.tmpMtx = new M3_1.M3();
        this.isWithMesh = false;
    }
    Structure3D.prototype.update = function () {
        var _a;
        var chain, mesh, bone, target;
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
            // update 3d mesh
            if (this.isWithMesh) {
                mesh = this.meshChains[i];
                for (var j = 0; j < chain.numBones; j++) {
                    bone = chain.bones[j];
                    console.log(bone.end);
                    mesh[j].position.set(bone.start.x, bone.start.y, bone.start.z);
                    mesh[j].lookAt(new THREE.Vector3(bone.end.x, bone.end.y, bone.end.z));
                }
            }
        }
    };
    Structure3D.prototype.clear = function () {
        this.clearAllBoneMesh();
        var i;
        i = this.numChains;
        while (i--) {
            this.remove(i);
        }
        this.chains = [];
        this.meshChains = [];
        this.targets = [];
    };
    Structure3D.prototype.add = function (chain, target, meshBone) {
        this.chains.push(chain);
        this.targets.push(target);
        this.numChains++;
        if (meshBone)
            this.addChainMeshs(chain);
    };
    Structure3D.prototype.remove = function (id) {
        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.meshChains.splice(id, 1);
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
    Structure3D.prototype.connectChain = function (Chain, chainNumber, boneNumber, point, target, meshBone, color) {
        var c = chainNumber;
        var n = boneNumber;
        if (chainNumber > this.numChains)
            return;
        if (boneNumber > this.chains[chainNumber].numBones)
            return;
        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var chain = Chain.clone(); //new Fullik.Chain( newChain );
        if (color !== undefined)
            chain.setColor(color);
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
        this.add(chain, target, !!meshBone);
    };
    // 3D THREE
    Structure3D.prototype.addChainMeshs = function (chain) {
        this.isWithMesh = true;
        var meshBone = [];
        var lng = chain.bones.length;
        for (var i = 0; i < lng; i++) {
            meshBone.push(this.addBoneMesh(chain.bones[i], i - 1, meshBone, chain));
        }
        this.meshChains.push(meshBone);
    };
    Structure3D.prototype.addBoneMesh = function (bone, prev, ar, chain) {
        //const momimamu = new THREE.Mesh(
        //	new THREE.CylinderBufferGeometry( 1, 0.5, size, 4 ),
        //	new THREE.MeshStandardMaterial( { color: color, wireframe: false, shadowSide: DoubleSide } )
        //);
        //this.scene.add(momimamu);
        var _a;
        var size = bone.length;
        var color = bone.color;
        var g = new THREE.CylinderBufferGeometry(1, 0.5, size, 4);
        g.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
        g.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, size * 0.5));
        var m = new THREE.MeshStandardMaterial({ color: color, wireframe: false, shadowSide: three_1.DoubleSide });
        var m2 = new THREE.MeshBasicMaterial({ wireframe: true });
        //var m4 = new THREE.MeshBasicMaterial({ wireframe : true, color:color, transparent:true, opacity:0.3 });
        var extraMesh = null;
        var extraGeo;
        var type = bone.joint.type;
        var axe;
        var r = 2;
        var a1 = bone.joint.min;
        var a2 = bone.joint.max;
        var s = 2; //size/4;
        var angle;
        switch (type) {
            case constants_1.JointType.J_BALL:
                m2.color.setHex(0xFF6600);
                angle = bone.joint.rotor;
                if (angle === Math.PI)
                    break;
                extraGeo = new THREE.CylinderBufferGeometry(0, r, s, 6, 1, true);
                extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
                extraGeo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, s * 0.5));
                extraMesh = new THREE.Mesh(extraGeo, m2);
                break;
            case constants_1.JointType.J_GLOBAL:
                axe = bone.joint.getHingeRotationAxis();
                //console.log( axe );
                //console.log('global', a1, a2)
                m2.color.setHex(0xFFFF00);
                extraGeo = new THREE.CircleBufferGeometry(r, 12, a1, -a1 + a2);
                //extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
                if (axe.z === 1)
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
                if (axe.y === 1) {
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI * 0.5));
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
                }
                if (axe.x === 1) {
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI * 0.5));
                }
                extraMesh = new THREE.Mesh(extraGeo, m2);
                break;
            case constants_1.JointType.J_LOCAL:
                axe = bone.joint.getHingeRotationAxis();
                //console.log('local', a1, a2)
                m2.color.setHex(0x00FFFF);
                extraGeo = new THREE.CircleBufferGeometry(r, 12, a1, -a1 + a2);
                extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI * 0.5));
                if (axe.z === 1) {
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI * 0.5));
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI * 0.5));
                }
                if (axe.x === 1)
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI * 0.5));
                if (axe.y === 1) {
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI * 0.5));
                    extraGeo.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI * 0.5));
                }
                extraMesh = new THREE.Mesh(extraGeo, m2);
                break;
        }
        var axeThree = new THREE.AxesHelper(1.5);
        //var bw = new THREE.Mesh( g,  m4 );
        var b = new THREE.Mesh(g, m);
        b.add(axeThree);
        //b.add(bw);
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.add(b);
        b.castShadow = true;
        b.receiveShadow = true;
        if (prev !== -1) {
            if (extraMesh !== null) {
                if (type !== constants_1.JointType.J_GLOBAL) {
                    extraMesh.position.z = chain.bones[prev].length;
                    ar[prev].add(extraMesh);
                }
                else {
                    b.add(extraMesh);
                }
            }
        }
        else {
            if (extraMesh !== null)
                b.add(extraMesh);
        }
        return b;
    };
    Structure3D.prototype.clearAllBoneMesh = function () {
        var _a;
        if (!this.isWithMesh)
            return;
        var i, j, b;
        i = this.meshChains.length;
        while (i--) {
            j = this.meshChains[i].length;
            while (j--) {
                b = this.meshChains[i][j];
                (_a = this.scene) === null || _a === void 0 ? void 0 : _a.remove(b);
                b.geometry.dispose();
                if (b.material instanceof THREE.Material) {
                    b.material.dispose();
                }
                else {
                    b.material.forEach(function (m) { return m.dispose(); });
                }
            }
            this.meshChains[i] = [];
        }
        this.meshChains = [];
    };
    return Structure3D;
}());
exports.Structure3D = Structure3D;
