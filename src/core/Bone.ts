import { Vector } from '../math/Vector';
import { Joint } from './Joint';
import { ConnectionType } from '../constants';

export interface Bone<V extends Vector<T>, J extends Joint<T>, T> {

    clone(): Bone<V, J, T>;

    setBoneConnectionPoint( bcp: ConnectionType ): void;
    setStartLocation( location: V ): void;
    setEndLocation( location: V ): void;
    setLength( lng: number ): void;
    setJoint( joint: Joint<T> ): void;

    getBoneConnectionPoint(): ConnectionType;
    getDirectionUV(): V;
    getLength(): number;
}
