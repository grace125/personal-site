import { z, ZodTypeAny } from "zod";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { AsyncResult, AsyncResultLike } from "./AsyncResult";
import { HashMap } from "./HashMap";
import { List } from "./List";
import { Option, OptLike } from "./Option";

type Ok<V> = { ok: true, v: V; }
type Err<E> = { ok: false, v: E }

export interface ResultLike<V, E> { toResult(): Result<V, E>; }

class DoError extends Error {
  val: unknown;
	constructor(val: Result<unknown, unknown>) {
    super("do() error");
		this.val = (val as any).getErr();
  }
}

type DoHelpers<E> = {
	bind: <U>(val: ResultLike<U, E>) => U;
	bound: <F extends (...args: any[]) => ResultLike<any, any>>(fn: F) => 
		((...args: Parameters<F>) => ReturnType<ReturnType<ReturnType<F>["toResult"]>["orThrow"]>);
	bindErr: (err: E) => (<U>(val: ResultLike<U, any>) => U);
}

type ExtendedV<T extends Record<string, any>> = 
	{ [K in keyof T]: T[K] extends ResultLike<infer V, any> ? V : T[K] }
type ExtendedE<T extends Record<string, any>> = 
	{ [K in keyof T]: T[K] extends ResultLike<any, infer E> ? E : never 
	} extends Record<any, infer V> ? V : never;

/** Represents either a success state of type V, or an error state of type E. */
class Result<V, E> implements Pipeable<Result<V, E>>, ResultLike<V, E>, OptLike<V>, AsyncResultLike<V, E> {
	private _result: Ok<V> | Err<E>;
	private getVal() { return (this._result as Ok<V>).v }
	private getErr() { return (this._result as Err<E>).v }

	constructor(val: Ok<V> | Err<E>) { this._result = val; }
	
	/** Creates a Ok result with an `undefined` value. */
	static ok<V extends void = never, E = never>(): Result<void, E>;
	/** Creates an Ok result with the value specified. */
	static ok<V = void, E = never>(val: V): Result<V, E>;
	static ok(v: any = undefined) { return new Result({ ok: true, v }); }
	
	/** Creates an Error result with the error specified. */
	static err<V, E>(error: E) { return new Result<V, E>({ ok: false, v: error }); }
	/** Creates an Error result with the error specified. */
	static error<V, E>(error: E) { return new Result<V, E>({ ok: false, v: error }); }

	static into<V = void, E = unknown>(v: ResultLike<V, E>) { return v.toResult(); }

	static isResult(v: unknown): v is Result<unknown, unknown> { return v instanceof Result; }
	static isResultLike(v: unknown): v is ResultLike<unknown, unknown> { 
		return !!(v && typeof v === "object" && "toResult" in v && typeof v.toResult === "function");
	}

	static lift<V, E>(v: V | ResultLike<V, E>): Result<V, E> { 
		return this.isResultLike(v) ? this.into(v) : this.ok(v); 
	}

	/** 
	 * Takes a variadic number of results, and returns an Ok result with an array of all of the values 
	 * if they were all Ok. Otherwise returns an Error result of all of the errored values if any were errors.
	 */
	static all<const I extends Array<Result<any, any>>>(...results: I): Result<
		{ -readonly [K in keyof I]: [I[K]] extends [Result<infer V, unknown>] ? V : never },
		{ -readonly [K in keyof I]: [I[K]] extends [Result<unknown, infer E>] ? E : never }> {

		const vals: unknown[] = [];
		const errors: unknown[] = [];
		for (const result of results) {
			if (result._result.ok) vals.push(result._result.v);
			else errors.push(result._result.v);
		}
		return (errors.length === 0 ? Result.ok(vals) : Result.err(errors)) as any;
	}

	static list<T extends Result<any, any>>(results: List<T>): 
		Result<List<ReturnType<T["orThrow"]>>, List<Parameters<Parameters<T["tapErr"]>[0]>[0]>> {
		return Result.all(...results.data()).map(v => List.from(v)).mapErr(e => List.from(e)) as any;
	}

	static hashMap<K extends any, V extends Result<any, any>>(results: HashMap<K, V>): 
		Result<HashMap<K, ReturnType<V["orThrow"]>>, List<Parameters<Parameters<V["tapErr"]>[0]>[0]>> {
		const newMap = HashMap.new<K, ReturnType<V["orThrow"]>>();
		const errors = List.new<any>();
		for (const [ key, val ] of results.entries()) {
			if (val._result.ok) newMap.setMut(key, val._result.v);
			else errors.pushMut(val._result.v);
		}
		if (errors.length) return Result.err(errors);
		return Result.ok(newMap);
	}

	static record<T extends Record<string, any>>(results: T): Result<ExtendedV<T>, List<ExtendedE<T>>> {
		return List.from(Object.entries(results))
			.map(([k, v]) => Result.lift(v).map(v => [ k, v ] as const))
			.pipe(Result.list)
			.map(Object.fromEntries) as any;
	}

	/** Creates a Result from a nullable value. `error` is used if the value is nullish. */
	static nullish<V, E = string>(val: V | null | undefined, error: E): Result<V, E> { 
		return val === null || val === undefined ? Result.err(error) : Result.ok(val);
	}

	/** Creates a result from a boolean. True creates an Ok, false creates an Error with the error specified. */
	static bool<E = string>(bool: boolean, error: E): Result<void, E> {
		return bool ? Result.ok<void, E>() : Result.err<void, E>(error);
	}
	/** Creates a result from a boolean. True creates an Ok, false creates an Error with the error specified. */
	static boolean<E = string>(bool: boolean, error: E) { return Result.bool(bool, error); }

	/** Converts a result into a Result<void, void>, removing all success and error values but keeping the status. */
	// toVoid() { return this.isOk() ? Result.ok<void, void>() : Result.err<void, void>(undefined) }
	/** Voids the Ok value of the Result, preserving errors. */
	voidOk() { return this.isOk() ? Result.ok<void, E>() : this as Result<void, E> }
	/** Voids the Err value of the Result, preserving the Ok value. */
	voidErr() { return this.isOk() ? this as Result<V, void> : Result.err<V, void>(undefined) }
	/** Converts an Ok result into a Some, and an Error result into a None. */
	toOption(): Option<V> { return this.isOk() ? Option.some<V>(this.getVal()) : Option.none<V>(); }
	toResult(): Result<V, E> { return this; }
	toAsyncResult(): AsyncResult<V, E> { return this.isOk() ? AsyncResult.ok(this.orThrow()) : AsyncResult.err(this.orThrowError()); }

	/** 
	 * Convenience method to test equality against the Ok value of an result. If the result is Err, 
	 * always returns false. Otherwise, if the argument is a function, calls the function with the value of the 
	 * option and returns the boolean. If the argument is a value, a simple equality check is performed.
	 */
	// NO IDEA WHY THIS WEIRD TYPE JANK IS NECESSARY. If it's not here it self-destructs the entire project.
	is<U extends V = V>(pred: NoInfer<U> | ((v: NoInfer<U>) => boolean)) { 
		return this.isOk() 
			? typeof pred === "function" 
				? (pred as any)(this.getVal()) as boolean
				: this.getVal() === pred
			: false; 
	}

	isOk() { return this._result.ok; }
	isErr() { return !this.isOk(); }
	isError() { return this.isErr(); }

	/** Returns this result if it's Ok, or the passed in result otherwise, regardless of status. */
	else<U extends Result<unknown, unknown> = Result<V, E>>(u: U): U extends Result<infer U, infer W> ? Result<V | U, W> : never { 
		return (this.isOk() ? this : u) as any;  
	}
	
	/** Returns the Ok value, or throws an error with the Error state as the message. */
	orThrow(): V;
	/** Returns the Ok value, or throws the error specified. */
	orThrow<E extends Error = Error>(error: E): V;
	orThrow(error?: any): V {
		if (!this.isOk()) throw error ? error 
			: new Error((this.getErr() as any)?.toString?.() ?? "`.orThrow()` called on an Error.");
		return this.getVal()
	}

	orThrowError(): E {
		if (this.isOk()) throw new Error("`.orThrowError()` called on an Ok.");
		return this.getErr();
	}

	/** Returns the Success value, or the default value specified. */
	orDef(def: V | (() => V)): V {
		return this.isOk() ? this.getVal() : typeof def === "function" ? (def as any)() : def;
	}

	/** 
	 * Maps the success value of this Result, returning a new Result containing the return value of 
	 * `mapper` called on the current value. Returns the current result if it's an Error. 
	 */
	map<U>(mapper: (val: V) => U): Result<U, E> {
		return this.isOk() ? Result.ok(mapper(this.getVal())) : this as unknown as Result<U, E>
	}

	/** 
	 * Maps the error value of this Result, returning a new Error containing the return value of 
	 * `mapper` called on the current error value. Returns the current result if it's an Ok. 
	 */
	mapErr<W>(mapper: (val: E) => W): Result<V, W> {
		return this.isErr() ? Result.err(mapper(this.getErr())) : this as unknown as Result<V, W>
	}
	/** 
	 * Maps the error value of this Result, returning a new Error containing the return value of 
	 * `mapper` called on the current error value. Returns the current result if it's an Ok. 
	 */
	mapError<W>(mapper: (val: E) => W): Result<V, W> { return this.mapErr<W>(mapper); }

	// /** Runs `then` on the success value of the Result. No-op if Error. Returns void. */
	// then(then: (val: V) => unknown): void { if (this.isOk()) then(this.getVal()); }

	/** 
	 * Calls `binder` with the success value of this Result, which must return a new result, which is returned.
	 * Effectively a flatMap. Returns the current result without calling `binder` if it's an Error.
	 */
	bind<U, W = E>(binder: (val: V) => ResultLike<U, W>): Result<U, W | E> {
		return this.isOk() ? Result.lift(binder(this.getVal())) : this as unknown as Result<U, W>
	}

	extend<U extends Record<string, any>>(extender: (val: V) => U):
		V extends Record<string, any> ? Result<(V & ExtendedV<U>), E | List<ExtendedE<U>>> : never {
		return this.isOk()
			? List.from(Object.entries(extender(this.getVal())))
				.map(([k, v]) => Result.lift(v).map(v => [ k, v ] as const))
				.pipe(Result.list)
				.map(Object.fromEntries)
				.map(u => ({ ...this.getVal(), ...u })) as any
			: this as unknown as any
	}

	// Type narrowing - Default error string.
	filter<U extends V>(filter: (val: V) => val is U): Result<U, E | string>;
	// Boolean check - Default error string.
	filter(filter: (val: V) => boolean): Result<V, E | string>;
	// Type narrowing - Custom error value.
	filter<U extends V, W>(filter: (val: V) => val is U, err: W): Result<U, E | W>;
	// Boolean check - Custom error value.
	filter<W>(filter: (val: V) => boolean, err: W): Result<V, E | W>;
	// Pred returns result, merges error types.
	filter<R extends Result<unknown, unknown>>(filter: (val: V) => R): 
		Result<V, R extends Result<unknown, infer W> ? (E | W) : E>;

	filter(filter: (val: V) => boolean | Result<unknown, unknown>, err?: any): any {
		if (!this.isOk()) return this;
		const res = filter(this.getVal()) 
		if (typeof res === "boolean") return res ? this : Result.err(err ?? ".filter() returned false.");
		else return res.isOk() ? this : res;
	}

	/**
	 * Calls `onOk` if the Result is Ok, or `onErr` if the result is an error.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(onOk: (val: V) => U, onErr: (err: E) => U): U;
	/**
	 * Calls `ok` if the Result is Ok, or `err` if the result is an error.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(match: { ok: (val: V) => U, err: (err: E) => U }): U
	/**
	 * Calls `ok` if the Result is Ok, or `error` if the result is an error.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(match: { ok: (val: V) => U, error: (err: E) => U }): U
	match(a: any, b?: any): any {
		if (typeof a === "function") return this.isOk() ? a(this.getVal()) : b(this.getErr());
		else return this.isOk() ? a.ok(this.getVal()) : "err" in a ? a.err(this.getErr()) : a.error(this.getErr());
	}

	/**
	 * Calls `tapper` with `this`. The return value of `tapper` is ignored. Mainly used for debugging,
	 * e.g. `.tap(console.log)` can be inserted anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tap(tapper: (val: this) => unknown) {
		tapper(this);
		return this;
	}
	/**
	 * Calls `tapper` with the Ok value, no-op if Error. The return value of `tapper` is ignored.
	 * e.g. `.tapOk(console.log)` can be used anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapOk(tapper: (val: V) => unknown) {
		if (this.isOk()) tapper(this.getVal());
		return this;
	}
	/**
	 * Calls `tapper` with the Error value, no-op if Ok. The return value of `tapper` is ignored.
	 * e.g. `.tapErr(console.log)` can be used anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapErr(tapper: (error: E) => unknown) {
		if (this.isErr()) tapper(this.getErr());
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
	flat(): V extends Result<infer U, infer W> ? Result<U, W | E> : never {
		return (this.isOk() ? this.getVal() : Result.err(this.getErr())) as any;
	}

	static do<T, E = unknown>(cb: (helpers: DoHelpers<E>) => T | Result<T, E>): Result<T, E> {
		const bind: DoHelpers<E>["bind"] = (v) => {
			const res = v.toResult();
			if (res.isOk()) return res.orThrow();
			throw new DoError(res);
		};
		const bound: DoHelpers<E>["bound"] = (fn) => (...args: any[]) => bind(fn(...args));
		const bindErr: DoHelpers<E>["bindErr"] = (e: E) => (v) => bind(v.toResult().mapErr(() => e));
		try {
			const ret = cb({ bind, bound, bindErr });
			return Result.isResult(ret) ? ret : Result.ok(ret); 
		}
		catch (e) {
			if (e instanceof DoError) return Result.err(e.val as E);
			throw e;
		}
	}

	firstErr(): Result<V, E extends [infer T, ...any[]] ? T : E extends List<infer T> ? T : E> {
		return this.mapErr(e => Array.isArray(e) || List.isList(e) ? e[0] : e) as any;
	}
	
	/** Calls `cb` with `this`, and returns what `cb` returns. Escape hatch to call arbitrary functions on a Result. */
	pipe<T>(cb: (res: this) => T) { return cb(this); }
	/** Shorthand for `pipe`. */
	$<T>(cb: (res: this) => T) { return cb(this); }

	static [TypeName] = "Result";
	static [Serialize] = (v: Result<unknown, unknown>) => ({ ...v });
	static [Deserialize] = (v: unknown) => 
		Result.ok(v)
		.filter(v => !!(v && typeof v === "object" && "_result" in v && v._result && 
			typeof v._result === "object" && "ok" in v._result && typeof v._result.ok === "boolean"))
		.map(v => new Result((v as Result<any, any>)._result))
}

export { Result as Res, Result };

export const resultSchema = <VS extends ZodTypeAny, ES extends ZodTypeAny>(v: VS, e: ES) => z.object({
	"_result": z.union([ z.object({ ok: z.literal(true), v: v }), z.object({ ok: z.literal(false), v: e }) ])
}).transform((res: any): Result<z.infer<typeof v>, z.infer<typeof e>> =>
	new Result((res as any)._result));