import { V3 } from '../math/V3';
import { JointType, PI, TORAD } from '../constants';
import { Joint } from './Joint';

export class Joint3D implements Joint<3> {
    static isJoint3D = true;
    rotor: number;
    min: number;
    max: number;
    freeHinge: boolean;
    rotationAxisUV: V3;
    referenceAxisUV: V3;
    type: JointType;

    constructor() {

        this.rotor = PI;
        this.min = - PI;
        this.max = PI;

        this.freeHinge = true;

        this.rotationAxisUV = new V3();
        this.referenceAxisUV = new V3();
        this.type = JointType.J_BALL;

    }

    clone() {

        const j = new Joint3D();

        j.type = this.type;
        j.rotor = this.rotor;
        j.max = this.max;
        j.min = this.min;
        j.freeHinge = this.freeHinge;
        j.rotationAxisUV.copy( this.rotationAxisUV );
        j.referenceAxisUV.copy( this.referenceAxisUV );

        return j;

    }

    testAngle() {

        if ( this.max === PI && this.min === - PI ) this.freeHinge = true;
        else this.freeHinge = false;

    }

    validateAngle( a: number ) {

        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;

    }

    set( joint: Joint3D ) {

        this.rotor = joint.rotor;
        this.min = joint.min;
        this.max = joint.max;

        this.freeHinge = joint.freeHinge;

        this.rotationAxisUV = joint.rotationAxisUV;
        this.referenceAxisUV = joint.referenceAxisUV;
        this.type = joint.type;

    }

    setAsBallJoint( angle: number ) {

        this.rotor = this.validateAngle( angle ) * TORAD;
        this.type = JointType.J_BALL;

    }

    // Specify this joint to be a hinge with the provided settings

    setHinge( type: JointType, rotationAxis: V3, clockwise: number, anticlockwise: number, referenceAxis: V3 ) {

        this.type = type;
        if ( clockwise < 0 ) clockwise *= - 1;
        this.min = - this.validateAngle( clockwise ) * TORAD;
        this.max = this.validateAngle( anticlockwise ) * TORAD;

        this.testAngle();

        this.rotationAxisUV.copy( rotationAxis ).normalize();
        this.referenceAxisUV.copy( referenceAxis ).normalize();

    }

    // GET

    getHingeReferenceAxis() {

        return this.referenceAxisUV;

    }

    getHingeRotationAxis() {

        return this.rotationAxisUV;

    }

    // SET

    setBallJointConstraintDegs( angle: number ) {

        this.rotor = this.validateAngle( angle ) * TORAD;

    }

    setHingeClockwise( angle: number ) {

        if ( angle < 0 ) angle *= - 1;
        this.min = - this.validateAngle( angle ) * TORAD;
        this.testAngle();

    }

    setHingeAnticlockwise( angle: number ) {

        this.max = this.validateAngle( angle ) * TORAD;
        this.testAngle();

    }

    /*setHingeRotationAxis( axis ) {

        this.rotationAxisUV.copy( axis ).normalize();

    },

    setHingeReferenceAxis( referenceAxis ) {

        this.referenceAxisUV.copy( referenceAxis ).normalize();

    },*/



}
