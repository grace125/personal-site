export interface Pipeable<T = void> {
	pipe<R>(cb: (() => R) | ((val: T) => R)): R;
}

export const pipeThunk: Pipeable = {
	pipe: <R>(v: () => R) => v()
}