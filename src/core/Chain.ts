import { BaseboneConstraintType, ConnectionType } from '../constants';
import { Vector } from '../math/Vector';
import { Bone } from './Bone';
import { Joint } from './Joint';
export interface Chain<B extends Bone<V, J, T>, V extends Vector<T>, J extends Joint<T>, C extends BaseboneConstraintType, T> {
    clone(): Chain<B, V, J, C, T>;
    clear(): void;
    addBone( bone: B ): void;
    removeBone( id: number ): void;
    
    getBoneConnectionPoint(): ConnectionType;
    getConnectedBoneNumber(): number;
    getConnectedChainNumber(): number;
    getBaseboneConstraintType(): number;
    getBaseboneConstraintUV(): V | undefined;
    getBaseLocation(): V;
    getEffectorLocation(): V;
    getLastTargetLocation(): V;
    getLiveChainLength(): number;
    
    setConnectedBoneNumber( boneNumber: number ): void;
    setConnectedChainNumber( chainNumber: number ): void;
    setBoneConnectionPoint( point: ConnectionType ): void;
    setBaseboneConstraintUV( uv: V ): void;
    setBaseLocation( baseLocation: V ): void;
    setFixedBaseMode( value: boolean ): void;
    setMaxIterationAttempts( maxIterations: number ): void;
    setMinIterationChange( minIterationChange: number ): void;
    setSolveDistanceThreshold( solveDistance: number ): void;
    
    solveForEmbeddedTarget(): void;
    resetTarget(): void;
    solveForTarget( t: V ): number;
    
    solveIK( target: V ): number | undefined;
    updateChainLength(): void;
}