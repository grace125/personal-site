import { Pipeable } from "../traits/Pipeable";
import { List } from "./List";
import { Option } from "./Option";
import { Result } from "./Result";

export interface AsyncResultLike<V, E> { toAsyncResult(): AsyncResult<V, E>; }

class DoError extends Error {
  val: unknown;
	constructor(val: Result<unknown, unknown>) {
    super("do() error");
		this.val = (val as any).getErr();
  }
}

type DoHelpers<E> = {
	bind: <U>(val: AsyncResultLike<U, E>) => Promise<U>;
	// bound: <F extends (...args: any[]) => AsyncResultLike<any, any>>(fn: F) => 
	// 	((...args: Parameters<F>) => ReturnType<ReturnType<ReturnType<F>["toAsyncResult"]>["orThrow"]>);
	bindErr: (err: E) => (<U>(val: AsyncResultLike<U, any>) => Promise<U>);
}

type ExtendedV<T extends Record<string, any>> = 
	{ [K in keyof T]: T[K] extends AsyncResultLike<infer V, any> ? V : T[K] }
type ExtendedE<T extends Record<string, any>> = 
	{ [K in keyof T]: T[K] extends AsyncResultLike<any, infer E> ? E : never 
	} extends Record<any, infer V> ? V : never;

/** Represents either a success state of type V, or an error state of type E. */
class AsyncResult<V, E> implements Pipeable<AsyncResult<V, E>>, AsyncResultLike<V, E> {
	private _promise: Promise<Result<V, E>>;
	private async getVal() { return (await this._promise).orThrow() }
	private async getErr() { return (await this._promise).orThrowError() }

	constructor(val: Result<V, E> | Promise<Result<V, E>>) { this._promise = Promise.resolve(val); }
	
	/** Creates a Ok result with an `undefined` value. */
	static ok<V extends void = never, E = never>(): AsyncResult<void, E>;
	/** Creates an Ok result with the value specified. */
	static ok<V = void, E = never>(val: V | Promise<V>): AsyncResult<V, E>;
	static ok(v: any = undefined) { return new AsyncResult(Promise.resolve(v).then(Result.ok)); }
	
	static result<V, E>(val: Result<V, E> | Promise<Result<V, E>>) { return new AsyncResult<V, E>(val); }

	static wrap<V, E = unknown>(val: Promise<V>) {
		return new AsyncResult<V, E>(new Promise(res => val.then(r => res(Result.ok(r))).catch(e => res(Result.err(e)))));
	}

	/** Creates an Error result with the error specified. */
	static err<V, E>(error: E | Promise<E>) { 
		return new AsyncResult<V, E>(Promise.resolve(error).then(err => Result.err<V, E>(err))); 
	}
	/** Creates an Error result with the error specified. */
	static error<V, E>(error: E | Promise<E>) { return AsyncResult.err<V, E>(error); }

	static into<V = void, E = unknown>(v: AsyncResultLike<V, E>) { return v.toAsyncResult(); }

	static isAsyncResult(v: unknown): v is AsyncResult<unknown, unknown> { return v instanceof AsyncResult; }
	static isAsyncResultLike(v: unknown): v is AsyncResultLike<unknown, unknown> { 
		return !!(v && typeof v === "object" && "toAsyncResult" in v && typeof v.toAsyncResult === "function");
	}

	static lift = <V, E>(v: V | Promise<V> | AsyncResultLike<V, E>): AsyncResult<V, E> => 
		AsyncResult.isAsyncResultLike(v) ? this.into(v) : this.ok(v);

	/** 
	 * Takes a variadic number of results, and returns an Ok result with an array of all of the values 
	 * if they were all Ok. Otherwise returns an Error result of all of the errored values if any were errors.
	 */
	static all<const I extends Array<AsyncResult<any, any>>>(...results: I): AsyncResult<
		{ -readonly [K in keyof I]: [I[K]] extends [AsyncResult<infer V, unknown>] ? V : never },
		{ -readonly [K in keyof I]: [I[K]] extends [AsyncResult<unknown, infer E>] ? E : never }> {
		return new AsyncResult(Promise.all(results.map(v => v.toResultAsync())).then(v => Result.all(...v))) as any;
	}

	static list<T extends AsyncResult<any, any>>(results: List<T>): 
		AsyncResult<List<Parameters<Parameters<T["tapOk"]>[0]>[0]>, List<Parameters<Parameters<T["tapErr"]>[0]>[0]>> {
		return AsyncResult.all(...results.data()).map(v => List.from(v)).mapErr(e => List.from(e)) as any;
	}

	// static hashMap<K extends any, V extends Result<any, any>>(results: HashMap<K, V>): 
	// 	Result<HashMap<K, ReturnType<V["orThrow"]>>, List<Parameters<Parameters<V["tapErr"]>[0]>[0]>> {
	// 	const newMap = HashMap.new<K, ReturnType<V["orThrow"]>>();
	// 	const errors = List.new<any>();
	// 	for (const [ key, val ] of results.entries()) {
	// 		if (val._result.ok) newMap.setMut(key, val._result.v);
	// 		else errors.pushMut(val._result.v);
	// 	}
	// 	if (errors.length) return Result.err(errors);
	// 	return Result.ok(newMap);
	// }

	// static record<T extends Record<string, any>>(results: T): Result<ExtendedV<T>, List<ExtendedE<T>>> {
	// 	return List.from(Object.entries(results))
	// 		.map(([k, v]) => Result.lift(v).map(v => [ k, v ] as const))
	// 		.pipe(Result.list)
	// 		.map(Object.fromEntries) as any;
	// }

	/** Creates a Result from a nullable value. `error` is used if the value is nullish. */
	static nullish<V, E = string>(val: V | null | undefined | Promise<V | null | undefined>, error: E): AsyncResult<V, E> { 
		return new AsyncResult(Promise.resolve(val).then(
			val => val === null || val === undefined ? Result.err(error) : Result.ok(val)));
	}

	/** Creates a result from a boolean. True creates an Ok, false creates an Error with the error specified. */
	static bool<E = string>(bool: boolean, error: E): AsyncResult<void, E> {
		return bool ? AsyncResult.ok<void, E>() : AsyncResult.err<void, E>(error);
	}
	/** Creates a result from a boolean. True creates an Ok, false creates an Error with the error specified. */
	static boolean<E = string>(bool: boolean, error: E) { return Result.bool(bool, error); }

	/** Converts a result into a Result<void, void>, removing all success and error values but keeping the status. */
	// toVoid() { return this.isOk() ? Result.ok<void, void>() : Result.err<void, void>(undefined) }
	/** Voids the Ok value of the Result, preserving errors. */
	voidOk() { return new AsyncResult<void, E>(this._promise.then(r => r.voidOk())); }
	/** Voids the Err value of the Result, preserving the Ok value. */
	voidErr() { return new AsyncResult<V, void>(this._promise.then(r => r.voidErr())); }
	/** Converts an Ok result into a Some, and an Error result into a None. */
	toAsyncResult(): AsyncResult<V, E> { return this; }
	async toOptionAsync(): Promise<Option<V>> { return (await this._promise).toOption(); }
	async toResultAsync(): Promise<Result<V, E>> { return (await this._promise).toResult(); }
	async await(): Promise<Result<V, E>> { return this.toResultAsync(); } 

	/** 
	 * Convenience method to test equality against the Ok value of an result. If the result is Err, 
	 * always returns false. Otherwise, if the argument is a function, calls the function with the value of the 
	 * option and returns the boolean. If the argument is a value, a simple equality check is performed.
	 */
	// NO IDEA WHY THIS WEIRD TYPE JANK IS NECESSARY. If it's not here it self-destructs the entire project.
	async is<U extends V = V>(pred: NoInfer<U> | ((v: NoInfer<U>) => boolean)) { 
		const res = await this._promise;
		return res.isOk()
			? typeof pred === "function" 
				? (pred as any)(res.orThrow()) as boolean
				: res.orThrow() === pred
			: false;
	}

	async isOk() { return this._promise.then(p => p.isOk()); }
	async isErr() { return !this.isOk(); }
	async isError() { return this.isErr(); }

	/** Returns this result if it's Ok, or the passed in result otherwise, regardless of status. */
	else<U extends AsyncResult<unknown, unknown> = AsyncResult<V, E>>(u: U): U extends AsyncResult<infer U, infer W> ? AsyncResult<V | U, W> : never { 
		return new AsyncResult(this._promise.then(res => res.isOk() ? this._promise : u._promise)) as any;
	}
	
	/** Returns the Ok value, or throws an error with the Error state as the message. */
	orThrow(): Promise<V>;
	/** Returns the Ok value, or throws the error specified. */
	orThrow<E extends Error = Error>(error: E): Promise<V>;
	async orThrow(error?: any): Promise<V> {
		const res = await this._promise;
		if (!res.isOk()) throw error ? error 
			: new Error((res.orThrowError() as any)?.toString?.() ?? "`.orThrow()` called on an Error.");
		return res.orThrow()
	}

	async orThrowError(): Promise<E> {
		const res = await this._promise;
		if (res.isOk()) throw new Error("`.orThrowError()` called on an Ok.");
		return res.orThrowError();
	}

	/** Returns the Success value, or the default value specified. */
	async orDef<D = V>(def: D | (() => D) | Promise<D> | (() => Promise<D>)): Promise<V | D> {
		const res = await this._promise;
		if (res.isOk()) return res.orThrow();
		return Promise.resolve(typeof def === "function" ? (def as any)() : def);
	}

	/** 
	 * Maps the success value of this Result, returning a new Result containing the return value of 
	 * `mapper` called on the current value. Returns the current result if it's an Error. 
	 */
	map<U>(mapper: (val: V) => U | Promise<U>): AsyncResult<U, E> {
		return new AsyncResult<U, E>(this._promise.then(res => res.isOk()
			? Promise.resolve(mapper(res.orThrow())).then(r => Result.ok<U, E>(r))
			: Promise.resolve(res as unknown as Result<U, E>)));
	}

	/** 
	 * Maps the error value of this Result, returning a new Error containing the return value of 
	 * `mapper` called on the current error value. Returns the current result if it's an Ok. 
	 */
	mapErr<W>(mapper: (val: E) => W): AsyncResult<V, W> {
		return new AsyncResult<V, W>(this._promise.then(res => res.isErr()
			? Promise.resolve(mapper(res.orThrowError())).then(r => Result.err<V, W>(r))
			: Promise.resolve(res as unknown as Result<V, W>)));
	}
	/** 
	 * Maps the error value of this Result, returning a new Error containing the return value of 
	 * `mapper` called on the current error value. Returns the current result if it's an Ok. 
	 */
	mapError<W>(mapper: (val: E) => W): AsyncResult<V, W> { return this.mapErr<W>(mapper); }

	// /** Runs `then` on the success value of the Result. No-op if Error. Returns void. */
	// then(then: (val: V) => unknown): void { if (this.isOk()) then(this.getVal()); }

	/** 
	 * Calls `binder` with the success value of this Result, which must return a new result, which is returned.
	 * Effectively a flatMap. Returns the current result without calling `binder` if it's an Error.
	 */
	bind<U, W = E>(binder: (val: V) => AsyncResultLike<U, W> | Promise<AsyncResultLike<U, W>>): AsyncResult<U, W | E> {
		return new AsyncResult<U, W | E>(this._promise.then(res => {
			if (res.isErr()) return res as unknown as Result<U, W>;
			return Promise.resolve(binder(res.orThrow())).then(v => AsyncResult.lift(v)).then(v => v._promise);
		}));
	}

	extend<U extends Record<string, any>>(extender: (val: V) => U):
		V extends Record<string, any> ? AsyncResult<(V & ExtendedV<U>), E | List<ExtendedE<U>>> : never {
		return new AsyncResult(this._promise.then(res => {
			if (!res.isOk()) return res as any;
			return List.from(Object.entries(extender(res.orThrow())))
				.map(([ k, v ]) => AsyncResult.lift(v).map(v => [ k, v ] as const))
				.pipe(AsyncResult.list)
				.map(Object.fromEntries)
				.map(async u => ({ ...res.orThrow(), ...u }))
				._promise
		})) as any;
	}

	// Type narrowing - Default error string.
	filter<U extends V>(filter: (val: V) => val is U): AsyncResult<U, E | string>;
	// Boolean check - Default error string.
	filter(filter: (val: V) => boolean | Promise<boolean>): AsyncResult<V, E | string>;
	// Type narrowing - Custom error value.
	filter<U extends V, W>(filter: (val: V) => val is U, err: W): AsyncResult<U, E | W>;
	// Boolean check - Custom error value.
	filter<W>(filter: (val: V) => boolean | Promise<boolean>, err: W): AsyncResult<V, E | W>;
	// Pred returns result, merges error types.
	filter<R extends AsyncResultLike<unknown, unknown>>(filter: (val: V) => R): 
		AsyncResult<V, ReturnType<R["toAsyncResult"]> extends AsyncResult<unknown, infer W> ? (E | W) : E>;

	filter(filter: (val: V) => boolean | Promise<boolean> | AsyncResultLike<unknown, unknown>, err?: any): any {
		return new AsyncResult(this._promise.then(async res => {
			if (!res.isOk()) return this._promise;
			const filtered = await Promise.resolve(filter(res.orThrow()));
			if (typeof filtered === "boolean") return filtered ? res : Result.err(err ?? ".filter() returned false.");
			const filteredAsyncRes = AsyncResult.lift(filtered);
			return (await filteredAsyncRes.isOk()) ? res : filteredAsyncRes._promise;
		}));
	}

	/**
	 * Calls `onOk` if the Result is Ok, or `onErr` if the result is an error.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(onOk: (val: V) => Promise<U>, onErr: (err: E) => Promise<U>): Promise<U>;
	/**
	 * Calls `ok` if the Result is Ok, or `err` if the result is an error.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(match: { ok: (val: V) => Promise<U>, err: (err: E) => Promise<U> }): Promise<U>
	/**
	 * Calls `ok` if the Result is Ok, or `error` if the result is an error.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(match: { ok: (val: V) => Promise<U>, error: (err: E) => Promise<U> }): Promise<U>
	match(...args: any[]): any { return this._promise.then(res => (res.match as any)(...args)); }

	/**
	 * Calls `tapper` with `this`. The return value of `tapper` is ignored. Mainly used for debugging,
	 * e.g. `.tap(console.log)` can be inserted anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapAsyncRes(tapper: (val: this) => unknown) {
		tapper(this);
		return this;
	}

	tap(tapper: (val: Result<V, E>) => unknown) {
		this._promise.then(val => tapper(val));
		return this;
	}

	/**
	 * Calls `tapper` with the Ok value, no-op if Error. The return value of `tapper` is ignored.
	 * e.g. `.tapOk(console.log)` can be used anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapOk(tapper: (val: V) => unknown) {
		this._promise.then(v => v.isOk() && tapper(v.orThrow()));
		return this;
	}
	/**
	 * Calls `tapper` with the Error value, no-op if Ok. The return value of `tapper` is ignored.
	 * e.g. `.tapErr(console.log)` can be used anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapErr(tapper: (error: E) => unknown) {
		this._promise.then(v => v.isErr() && tapper(v.orThrowError()));
		return this;
	}
	/**
	 * Calls `tapper` with the Error value, no-op if Ok. The return value of `tapper` is ignored.
	 * e.g. `.tapError(console.log)` can be used anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapError(tapper: (error: E) => unknown) { return this.tapErr(tapper); }

	/**
	 * Calls `effect` with the Ok value of the Result, no-op if it's an Error. The return value of `effect` is ignored.
	 * Used to perform side-effects like network operations, or state mutation. 
	 * Equivalent to `.tapOk`, but preferred if not debugging.
	 */
	effect(effect: (val: V) => unknown) { return this.tapOk(effect); }

	/** Flattens a result, converting a Result<Result<V, E>, W> into a Result<V, E|W>. */
	// flat(): V extends Result<infer U, infer W> ? Result<U, W | E> : never {
	// 	return (this.isOk() ? this.getVal() : Result.err(this.getErr())) as any;
	// }

	static do<T, E = unknown>(cb: (helpers: DoHelpers<E>) => Promise<T | Result<T, E>>): AsyncResult<T, E> {
		const bind: DoHelpers<E>["bind"] = async (v) => {
			const res = await v.toAsyncResult().toResultAsync();
			if (res.isOk()) return res.orThrow();
			throw new DoError(res);
		};
		// const bound: DoHelpers<E>["bound"] = (fn) => (...args: any[]) => bind(fn(...args));
		const bindErr: DoHelpers<E>["bindErr"] = (e: E) => async (v) => await bind(v.toAsyncResult().mapErr(() => e));

		return new AsyncResult(new Promise(async (res) => {
			try {
				const ret = await cb({ bind, bindErr });
				res(Result.isResult(ret) ? ret : Result.ok(ret));
			}
			catch (e) {
				if (e instanceof DoError) res(Result.err(e.val as E));
				else throw e;
			}
		}));
	}

	firstErr(): AsyncResult<V, E extends [infer T, ...any[]] ? T : E extends List<infer T> ? T : E> {
		return this.mapErr(e => Array.isArray(e) || List.isList(e) ? e[0] : e) as any;
	}
	
	/** Calls `cb` with `this`, and returns what `cb` returns. Escape hatch to call arbitrary functions on a Result. */
	pipe<T>(cb: (res: this) => T) { return cb(this); }
	/** Shorthand for `pipe`. */
	$<T>(cb: (res: this) => T) { return cb(this); }
}

export { AsyncResult as AsyncRes, AsyncResult };