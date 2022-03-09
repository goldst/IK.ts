import { J_BALL, J_LOCAL, J_GLOBAL, PI, TORAD, JointType } from '../constants';

export class Joint2D {
	isJoint2D: boolean;
	coordinateSystem: JointType;
	min: number;
	max: number;

	constructor( clockwise?: number, antiClockwise?: number, coordSystem?: JointType) {

		this.isJoint2D = true;

		this.coordinateSystem = coordSystem || J_LOCAL;

		if ( clockwise < 0 ) clockwise *= - 1;

		this.min = clockwise !== undefined ? - clockwise * TORAD : - PI;
		this.max = antiClockwise !== undefined ? antiClockwise * TORAD : PI;

	}

	clone() {

		var j = new Joint2D();

		j.coordinateSystem = this.coordinateSystem;
		j.max = this.max;
		j.min = this.min;

		return j;

	}

	validateAngle( a: number ) {

		a = a < 0 ? 0 : a;
		a = a > 180 ? 180 : a;
		return a;

	}

	// SET

	set( joint: Joint2D ) {

		this.max = joint.max;
		this.min = joint.min;
		this.coordinateSystem = joint.coordinateSystem;

	}

	setClockwiseConstraintDegs( angle: number ) {

		// 0 to -180 degrees represents clockwise rotation
		if ( angle < 0 ) angle *= - 1;
		this.min = - ( this.validateAngle( angle ) * TORAD );

	}

	setAnticlockwiseConstraintDegs( angle: number ) {

		// 0 to 180 degrees represents anti-clockwise rotation
		this.max = this.validateAngle( angle ) * TORAD;

	}

	setConstraintCoordinateSystem( coordSystem: JointType ) {

		this.coordinateSystem = coordSystem;

	}


	// GET

	getConstraintCoordinateSystem() {

		return this.coordinateSystem;

	}

}
