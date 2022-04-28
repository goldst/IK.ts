import { Vector } from './Vector';

export class V2 implements Vector<2> {

    static isVector2 = true;
    x: number;
    y: number;

    constructor( x?: number, y?: number ) {

        this.x = x || 0;
        this.y = y || 0;

    }

    abs() {
        return new V2(
            this.x < 0 ? - this.x : this.x,
            this.y < 0 ? - this.y : this.y
        );
    }


    set( x: number, y: number ) {

        this.x = x || 0;
        this.y = y || 0;
        return this;

    }

    distanceTo( v: V2 ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    }

    distanceToSquared( v: V2 ) {

        const dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;

    }


    multiply( s: number ) {

        return new V2( this.x * s, this.y * s);

    }

    multiplyScalar( scalar: number ) {

        this.x *= scalar;
        this.y *= scalar;
        return this;

    }

    divideScalar( scalar: number ) {

        return this.multiplyScalar( 1 / scalar );

    }

    length() {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    }

    normalize() {

        return this.divideScalar( this.length() || 1 );

    }

    normalised() {

        return new V2( this.x, this.y ).normalize();

    }

    lengthSq() {

        return this.x * this.x + this.y * this.y;

    }

    add( v: V2 ) {

        this.x += v.x;
        this.y += v.y;
        return this;

    }

    plus( v: V2 ) {

        return new V2( this.x + v.x, this.y + v.y );

    }

    min( v: V2 ) {

        this.x -= v.x;
        this.y -= v.y;

        return this;

    }

    minus( v: V2 ) {

        return new V2( this.x - v.x, this.y - v.y );

    }

    divideBy( value: number ) {

        return new V2( this.x, this.y ).divideScalar( value );

    }

    dot( a: V2 ) {

        return this.x * a.x + this.y * a.y;

    }

    negate() {

        this.x = - this.x;
        this.y = - this.y;
        return this;

    }

    negated() {

        return new V2( - this.x, - this.y );

    }

    clone() {

        return new V2( this.x, this.y );

    }

    copy( v: V2 ) {

        this.x = v.x;
        this.y = v.y;
        return this;

    }

    cross( v: V2 ) {

        return this.x * v.y - this.y * v.x;

    }

    sign( v: V2 ) {

        const s = this.cross( v );
        return s >= 0 ? 1 : - 1;

    }

    approximatelyEquals( v: V2, t: number ) {

        if ( t < 0 ) return false;
        const xDiff = Math.abs( this.x - v.x );
        const yDiff = Math.abs( this.y - v.y );
        return ( xDiff < t && yDiff < t );

    }

    zero() {

        this.x = 0;
        this.y = 0;
        return this;

    }

    rotate( angle: number ) {

        const cos = Math.cos( angle );
        const sin = Math.sin( angle );
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;

    }


    projectOnVector( vector: V2 ) {

        const scalar = vector.dot( this ) / vector.lengthSq();
        return this.copy( vector ).multiplyScalar( scalar );

    }

    projectOnPlane(planeNormal: V2) {

        const v1 = new V2();

        v1.copy( this ).projectOnVector( planeNormal.normalised() );

        return this.min( v1 ).normalize();

    }

    angleTo( v: V2 ) {

        const a = this.dot( v ) / ( Math.sqrt( this.lengthSq() * v.lengthSq() ) );
        if ( a <= - 1 ) return Math.PI;
        if ( a >= 1 ) return 0;
        return Math.acos( a );

    }

    getSignedAngle( v: V2 ) {

        const a = this.angleTo( v );
        const s = this.sign( v );
        return s === 1 ? a : - a;

    }

    constrainedUV( baselineUV: V2, min: number, max: number ) {

        const angle = baselineUV.getSignedAngle( this );
        if ( angle > max ) this.copy( baselineUV ).rotate( max );
        if ( angle < min ) this.copy( baselineUV ).rotate( min );
        return this;

    }

}
