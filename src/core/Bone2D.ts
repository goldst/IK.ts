import { END, JointType, START } from '../constants';
import { Joint2D } from './Joint2D';
import { V2 } from '../math/V2';

export class Bone2D {
	isBone2D = true;
	start: V2;
	end: V2;
	length: number;
	joint: Joint2D;
	globalConstraintUV = new V2( 1, 0 );
	boneConnectionPoint = END;
	color?: number;
	name: string;

	constructor( Start: V2, End?: V2, directionUV?: V2, length?: number, clockwiseDegs?: number, anticlockwiseDegs?: number, color?: any ) {

		this.start = new V2();
		this.end = new V2();
		this.length = length || 0;

		this.joint = new Joint2D( clockwiseDegs, anticlockwiseDegs );


		this.color = color || null;
		this.name = '';

		// init

		this.setStartLocation( Start );

		if ( End ) {

			this.setEndLocation( End );
			if ( this.length === 0 ) this.length = this.getLength();

		} else if ( directionUV ) {

			this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( this.length ) ) );

		}

	}


	clone() {

		var b = new Bone2D( this.start, this.end );
		b.length = this.length;
		b.globalConstraintUV = this.globalConstraintUV;
		b.boneConnectionPoint = this.boneConnectionPoint;
		b.joint = this.joint.clone();
		b.color = this.color;
		b.name = this.name;
		return b;

	}


	// SET

	setName( name: string ) {

		this.name = name;

	}

	setColor( c: number ) {

		this.color = c;

	}

	setBoneConnectionPoint( bcp: number ) {

		this.boneConnectionPoint = bcp;

	}

	setStartLocation( v: V2 ) {

		this.start.copy( v );

	}

	setEndLocation( v: V2 ) {

		this.end.copy( v );

	}

	setLength( length: number ) {

		if ( length > 0 ) this.length = length;

	}

	setGlobalConstraintUV( v: V2 ) {

		this.globalConstraintUV = v;

	}

	// SET JOINT

	setJoint( joint: Joint2D ) {

		this.joint = joint;

	}

	setClockwiseConstraintDegs( angleDegs: number ) {

		this.joint.setClockwiseConstraintDegs( angleDegs );

	}

	setAnticlockwiseConstraintDegs( angleDegs: number ) {

		this.joint.setAnticlockwiseConstraintDegs( angleDegs );

	}

	setJointConstraintCoordinateSystem( coordSystem: JointType ) {

		this.joint.setConstraintCoordinateSystem( coordSystem );

	}


	// GET

	getGlobalConstraintUV() {

		return this.globalConstraintUV;

	}

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
