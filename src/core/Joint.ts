export interface Joint<T> {
    set(sourceJoint: Joint<T>): void;
    clone(): Joint<T>
    validateAngle( a: number ): number;
}