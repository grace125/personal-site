import { Opt } from "../datatypes/Option";

/** Caught by `returnable` function calls to return from outer scope. */
class ReturnSignal extends Error {
	scope: number;
	constructor(scope: number) {
		super("ReturnException had too large of a scope.");
		this.scope = scope;
	}
}

/**
 * Stops execution and "returns" out of the nth-nearest `returnable` call determined by `scope`.
 * If no scope is specified, breaks out of the nearest `returnable`.
 * Best practice is to return this function. e.g. `return ret()`.
 */
export const ret = (scope: number = 0): never => { throw new ReturnSignal(scope); }

/**
 * Runs `cb` with a returnable boundary around it. i.e., runs the function, 
 * but allows calls to `ret` to cancel its execution.
 */
export const returnable: {
	<T>(cb: () => T): T | undefined;
	<T, D = T>(cb: () => T, def: D): T | D;
} = <T>(cb: () => T, def?: any): T => {
	try { return cb() }
	catch (e) {
		if (!(e instanceof ReturnSignal)) throw e;
		if (e.scope === 0) return def;
		e.scope--;
		throw e;
	}
}

export const nullishRet = <T extends any>(val: T | null | undefined): NonNullable<T> => {
	if (val == null) return ret();
	return val!;
}

export const optRet = <T extends any>(val: Opt<T>): T => {
	if (val.isNone()) return ret();
	return val.orThrow();
}