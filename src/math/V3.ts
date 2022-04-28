import { M3 } from './M3';
import { Vector } from './Vector';

export class V3 implements Vector<3> {
    static isVector3 = true;
    x: number;
    y: number;
    z: number;

    constructor( x?: number, y?: number, z?: number ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    }


    set( x: number, y: number, z: number ) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        return this;

    }

    distanceTo( v: V3 ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    }

    distanceToSquared( v: V3 ) {

        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;

    }

    abs() {

        return new V3(
            this.x < 0 ? - this.x : this.x,
            this.y < 0 ? - this.y : this.y,
            this.z < 0 ? - this.z : this.z
        );

    }

    dot( v: V3 ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    }

    lengthSq() {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    }

    normalize() {

        return this.divideScalar( this.length() || 1 );

    }

    normalised() {

        return new V3( this.x, this.y, this.z ).normalize();

    }

    add( v: V3 ) {

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;

    }

    min( v: V3 ) {

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;

    }

    plus( v: V3 ) {

        return new V3( this.x + v.x, this.y + v.y, this.z + v.z );

    }

    minus( v: V3 ) {

        return new V3( this.x - v.x, this.y - v.y, this.z - v.z );

    }

    divideBy( s: number ) {

        return new V3( this.x / s, this.y / s, this.z / s );

    }

    multiply( s: number ) {

        return new V3( this.x * s, this.y * s, this.z * s );

    }


    multiplyScalar( scalar: number ) {

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;

    }

    divideScalar( scalar: number ) {

        return this.multiplyScalar( 1 / scalar );

    }

    cross( v: V3 ) {

        return new V3( this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x );

    }

    crossVectors( a: V3, b: V3 ) {

        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    }

    negate() {

        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;
        return this;

    }

    negated() {

        return new V3( - this.x, - this.y, - this.z );

    }

    clone() {

        return new V3( this.x, this.y, this.z );

    }

    copy( v: V3 ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;

    }

    approximatelyEquals( v: V3, t: number ) {

        if ( t < 0 ) return false;
        const xDiff = Math.abs( this.x - v.x );
        const yDiff = Math.abs( this.y - v.y );
        const zDiff = Math.abs( this.z - v.z );
        return ( xDiff < t && yDiff < t && zDiff < t );

    }

    zero() {

        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;

    }

    rotate( angle: number, axe: 'X' | 'Y' | 'Z' ) {

        const cos = Math.cos( angle );
        const sin = Math.sin( angle );
        let x, y, z;

        switch ( axe ) {

        case 'X':
            x = this.x;
            y = this.y * cos - this.z * sin;
            z = this.y * sin + this.z * cos;
            break;
        case 'Y':
            x = this.z * sin + this.x * cos;
            y = this.y;
            z = this.z * cos - this.x * sin;
            break;
        case 'Z':
            x = this.x * cos - this.y * sin;
            y = this.x * sin + this.y * cos;
            z = this.z;
            break;

        }

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    }

    // added

    projectOnVector( vector: V3 ) {

        const scalar = vector.dot( this ) / vector.lengthSq();
        return this.copy( vector ).multiplyScalar( scalar );

    }

    projectOnPlane(planeNormal: V3) {

        const v1 = new V3();

        v1.copy( this ).projectOnVector( planeNormal.normalised() );

        return this.min( v1 ).normalize();

    }

    applyM3( m: M3 ) {

        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;

        this.x = e[ 0 ] * x + e[ 1 ] * y + e[ 2 ] * z;
        this.y = e[ 3 ] * x + e[ 4 ] * y + e[ 5 ] * z;
        this.z = e[ 6 ] * x + e[ 7 ] * y + e[ 8 ] * z;

        return this.normalize();

    }

    applyMatrix3( m: M3 ) {

        const x = this.x, y = this.y, z = this.z;
        const e = m.elements;

        this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
        this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
        this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

        return this;

    }

    applyQuaternion( q: V3 & { w: number } ) {

        const x = this.x, y = this.y, z = this.z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

        // calculate quat * vector

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;

    }

    /////

    sign( v: V3, normal: V3 ) {

        const s = this.cross( v ).dot( normal );
        return s >= 0 ? 1 : - 1;

    }

    angleTo( v: V3 ) {

        const a = this.dot( v ) / Math.sqrt( this.lengthSq() * v.lengthSq() );
        if ( a <= - 1 ) return Math.PI;
        if ( a >= 1 ) return 0;
        return Math.acos( a );

    }

    getSignedAngle( v: V3, normal: V3 ) {

        const a = this.angleTo( v );
        const s = this.sign( v, normal );
        return s === 1 ? a : - a;

    }

    constrainedUV( referenceAxis: V3, rotationAxis: V3, mtx: M3, min: number, max: number ) {

        const angle = referenceAxis.getSignedAngle( this, rotationAxis );
        if ( angle > max ) this.copy( mtx.rotateAboutAxis( referenceAxis, max, rotationAxis ) );
        if ( angle < min ) this.copy( mtx.rotateAboutAxis( referenceAxis, min, rotationAxis ) );
        return this;

    }

    limitAngle( base: V3, mtx: M3, max: number ) {

        const angle = base.angleTo( this );
        if ( angle > max ) {

            const correctionAxis = base.normalised().cross( this ).normalize();
            this.copy( mtx.rotateAboutAxis( base, max, correctionAxis ) );

        }

        return this;

    }


}
