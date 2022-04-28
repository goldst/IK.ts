import { ConnectionType } from '../constants';
import { Joint3D } from './Joint3D';
import { V3 } from '../math/V3';
import { Bone } from './Bone';


export class Bone3D implements Bone<V3, Joint3D, 3>{
    static isBone3D = true;
    joint: Joint3D;
    start: V3;
    end: V3;
    boneConnectionPoint: ConnectionType;
    length: number;
    name: string;

    constructor( startLocation: V3, endLocation?: V3, directionUV?: V3, length?: number ) {

        this.joint = new Joint3D();
        this.start = new V3();
        this.end = new V3();

        this.boneConnectionPoint = ConnectionType.END;
        this.length = 0;

        this.name = '';

        this.init( startLocation, endLocation, directionUV, length );

    }


    init( startLocation: V3, endLocation?: V3, directionUV?: V3, length?: number ) {

        this.setStartLocation( startLocation );
        if ( endLocation ) {

            this.setEndLocation( endLocation );
            this.length = this.getLength();

        } else if(length && directionUV) {

            this.setLength( length );
            this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( length ) ) );

        }

    }

    clone() {

        const b = new Bone3D( this.start, this.end );
        b.joint = this.joint.clone();
        return b;

    }

    // SET

    setBoneConnectionPoint( bcp: ConnectionType ) {

        this.boneConnectionPoint = bcp;

    }

    setHingeClockwise( angle: number ) {


        this.joint.setHingeClockwise( angle );

    }

    setHingeAnticlockwise( angle: number ) {

        this.joint.setHingeAnticlockwise( angle );

    }

    setBallJointConstraintDegs( angle: number ) {

        this.joint.setBallJointConstraintDegs( angle );

    }

    setStartLocation( location: V3 ) {

        this.start.copy( location );

    }

    setEndLocation( location: V3 ) {

        this.end.copy( location );

    }

    setLength( lng: number ) {

        if ( lng > 0 ) this.length = lng;

    }

    setJoint( joint: Joint3D ) {

        this.joint = joint;

    }


    // GET

    getBoneConnectionPoint() {

        return this.boneConnectionPoint;

    }

    getDirectionUV() {

        return this.end.minus( this.start ).normalize();

    }

    getLength() {

        return this.start.distanceTo( this.end );

    }

}
