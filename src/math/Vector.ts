import { M3 } from './M3';

export interface Vector<T> {
    set( ...axes: number[] ): Vector<T>;

    distanceTo( v: Vector<T> ): number;

    distanceToSquared( v: Vector<T> ): number;

    abs(): Vector<T>

    dot( v: Vector<T> ): number;

    length(): number;

    lengthSq(): number;

    normalize(): Vector<T>;

    normalised(): Vector<T>

    add( v: Vector<T> ): Vector<T>

    min( v: Vector<T> ): Vector<T>

    plus( v: Vector<T> ): Vector<T>

    minus( v: Vector<T> ): Vector<T>

    divideBy( s: number ): Vector<T>

    multiply( s: number ): Vector<T>


    multiplyScalar( scalar: number ): Vector<T>;

    divideScalar( scalar: number ): Vector<T>;

    negate(): Vector<T>;

    negated(): Vector<T>;

    clone(): Vector<T>;

    copy( v: Vector<T> ): Vector<T>;

    approximatelyEquals( v: Vector<T>, t: number ): boolean;

    zero(): Vector<T>;

    rotate( angle: number, axe: 'X' | 'Y' | 'Z' ): Vector<T>;

    // added

    projectOnVector( vector: Vector<T> ): Vector<T>;

    projectOnPlane(planeNormal: Vector<T> ): Vector<T>;

    /////

    sign( v: Vector<T>, normal: Vector<T> ): number;

    angleTo( v: Vector<T> ): number;

    getSignedAngle( v: Vector<T>, normal: Vector<T> ): number;
}