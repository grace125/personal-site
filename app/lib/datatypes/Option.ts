import { z, ZodType } from "zod";
import { ret } from "../traits/Returnable";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { List } from "./List";
import { Result, ResultLike } from "./Result";
import { AsyncResult, AsyncResultLike } from "./AsyncResult";
import { appendFormatter, FormatterElemTag } from "../DevTools";

type Some<T> = { some: true, v: T; }
type None = { some: false }

export interface OptLike<T> { toOption(): Opt<T>; }

class DoError extends Error {
	constructor() {
		super("do() error");
	}
}

type DoHelpers = {
	bind: <U>(val: OptLike<U>) => U;
}

type ExtendedT<T extends Record<string, any>> = 
	{ [K in keyof T]: T[K] extends OptLike<infer V> ? V : T[K] }

let NONE: Opt;

/** Represents an optional value -- either a Some of type T, or a None. */
class Opt<T = void> implements Pipeable<Opt<T>>, OptLike<T>, ResultLike<T, unknown>, AsyncResultLike<T, unknown> {
	private _option: Some<T> | None;
	private get() { return (this._option as Some<T>).v }

	constructor(val: Some<T> | None) { this._option = val; }

	/** Creates a Some option with the value specified. */
	static some<T>(val: T) { return new Opt({ some: true, v: val }); }
	/** Creates a None option. */
	static none<T = never>() { return NONE as Opt<T>; }

	static into<T>(val: OptLike<T>) { return val.toOption(); }

	static isOption(v: unknown): v is Opt<unknown> { return v instanceof Opt; }
	static isOptionLike(v: unknown): v is OptLike<unknown> { 
		return !!(v && typeof v === "object" && "toOption" in v && typeof v.toOption === "function");
	}

	static lift<T>(v: T | OptLike<T>) { return this.isOptionLike(v) ? this.into(v) : this.some(v); }

	/** 
	 * Takes a variadic number of options, and returns a Some with an array of all of the values 
	 * if they were all Some. Otherwise returns a None.
	 */
	static all<const I extends Array<Opt<any>>>(...options: I): 
		Opt<{ -readonly [K in keyof I]: [I[K]] extends [Opt<infer A>] ? A : never }> {
		const res: unknown[] = [];
		for (const option of options) {
			if (option._option.some) res.push(option._option.v);
			else return Opt.none()
		}
		return Opt.some<any>(res);
	}

	static list<T extends Opt<any>>(results: List<T>): 
		Opt<List<ReturnType<T["orThrow"]>>> {
		return Opt.all(...results.data()).map(v => List.from(v)) as any;
	}
	
	static record<T extends Record<string, any>>(results: T): Opt<ExtendedT<T>> {
		return List.from(Object.entries(results))
			.map(([k, v]) => Opt.lift(v).map(v => [ k, v ] as const))
			.pipe(Opt.list)
			.map(Object.fromEntries) as any;
	}

	/** Creates an Option from a nullish value (null or undefined). */
	static nullish<T>(val: T | null | undefined): Opt<T> { 
		return val === null || val === undefined ? Opt.none() : Opt.some(val);
	}
	/** Creates an option from a value. If null, returns none. */
	static nullable<T>(val: T | null): Opt<T> {
		return val === null ? Opt.none() : Opt.some(val);
	}
	/** Creates an option from a value. If undefined, returns none. */
	static undefined<T>(val: T | undefined): Opt<T> {
		return val === undefined ? Opt.none() : Opt.some(val);
	}

	/** Creates an Option from a boolean. */
	static bool(val: boolean) { 
		return val ? Opt.some(undefined) : Opt.none();
	}
	/** Creates an Option from a boolean. */
	static boolean(val: boolean) { return Opt.bool(val); }

	/** Converts an option to an Option<void>, removing the held value but keeping the status.  */
	toVoid() { return this.isSome() ? Opt.some(undefined) : this as Opt<void> }

	/** Converts a Some into an Ok result holding the value, and a None into an error. */
	toResult(): Result<T, unknown>;
	/** Converts a Some into an Ok result holding the value, and a None into the error specified. */
	toResult<E = string>(e: E): Result<T, E>;
	toResult(e?: any): any { return this.isSome() ? Result.ok(this.get()) : Result.err(e ?? "Option is none.") }

	toAsyncResult(): AsyncResult<T, unknown>;
	toAsyncResult<E = string>(e: E): AsyncResult<T, E>;
	toAsyncResult(e?: any): any { return this.isSome() ? AsyncResult.ok(this.get()) : AsyncResult.err(e ?? "Option is none."); }

	toOption(): Opt<T> { return this; }

	isSome() { return this._option.some; }
	isNone() { return !this.isSome(); }

	/** 
	 * Convenience method to test equality against the Some value of an option. If the option is None, 
	 * always returns false. Otherwise, if the argument is a function, calls the function with the value of the 
	 * option and returns the boolean. If the argument is a value, a simple equality check is performed.
	 */
	// NO IDEA WHY THIS WEIRD TYPE JANK IS NECESSARY. If it's not here it self-destructs the entire project.
	is<U extends T = T>(pred: NoInfer<U> | ((v: NoInfer<U>) => boolean)) { 
		return this.isSome() 
			? typeof pred === "function" 
				? (pred as any)(this.get()) as boolean
				: this.get() === pred
			: false; 
	}

	/** Returns this option if it's Some, or the passed in option otherwise, regardless of its status. */
	else<U>(u: Opt<U> | (() => Opt<U>)): Opt<T | U> { 
		return this.isSome() ? this : typeof u === "function" ? u() : u;
	}
	
	/** Returns the Some value, or throws an error with the error specified. */
	orThrow<E extends Error = Error>(error?: () => E): T {
		if (!this.isSome()) {
			if (error) throw error();
			else throw new Error("orThrow called on None.");
		}
		return this.get()
	}

	/** Returns the value or propagates a ReturnSignal. */
	orReturn(scope: number = 0): T {
		if (!this.isSome()) return ret(scope);
		return this.get();
	}

	/** Returns the Some value, or the default value specified. */
	or<U = T>(def: NoInfer<U> | (() => NoInfer<U>)): T | U { 
		return this.isSome() ? this.get() : (typeof def === "function" ? (def as any)() : def); 
	}
	orNull(): T | null { 
		return this.isSome() ? this.get() : null; 
	}

	/** 
	 * Maps the some value of this Option, returning a new Option containing the return value of 
	 * `mapper` called on the current value. Returns the current option if it's a None. 
	 */
	map<U>(mapper: (val: T) => U): Opt<U> {
		return this.isSome() ? Opt.some(mapper(this.get())) : this as unknown as Opt<U>
	}

	/** 
	 * Calls `binder` with the Some value of this Option, which must return a new Option, which is returned.
	 * Effectively a flatMap. Returns the current option without calling `binder` if it's a None.
	 */
	bind<U>(binder: (val: T) => Opt<U>): Opt<U> {
		return this.isSome() ? binder(this.get()) : this as unknown as Opt<U>
	}

	extend<U extends Record<string, any>>(extender: (val: T) => U):
		T extends Record<string, any> ? Opt<T & ExtendedT<U>> : never {
		return this.isSome()
			? List.from(Object.entries(extender(this.get())))
				.map(([k, v]) => Opt.lift(v).map(v => [ k, v ] as const))
				.pipe(Opt.list)
				.map(Object.fromEntries)
				.map(u => ({ ...this.get(), ...u })) as any
			: this as unknown as any
	}

	/** Filters the value by a type predicate. Narrows the type of the Some value if true. If false, returns a None.*/
	filter<U extends T = T>(filter: (val: T) => val is U): Opt<U>;
	/** Filters the value by `filter`. Returns the same Option if true, or a None option if false. */
	filter(filter: (val: T) => boolean): Opt<T>;
	filter(filter: (val: T) => boolean): any {
		if (!this.isSome()) return this;
		const res = filter(this.get()) 
		if (typeof res === "boolean") return res ? this : Opt.none();
	}

	/**
	 * Calls `onSome` if the Option is Some, or `onNone` if the option is None.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(onSome: (val: T) => U, onNone: () => U): U;
	/**
	 * Calls `some` if the Option is Some, or `none` if the option is None.
	 * Returns whatever is returned by whichever function was called.
	 */
	match<U>(match: { some: (val: T) => U, none: () => U }): U
	match(a: any, b?: any): any {
		if (typeof a === "function") return this.isSome() ? a(this.get()) : b();
		else return this.isSome() ? a.some(this.get()) : a.none();
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
	 * Calls `tapper` with the Some value, no-op if None. The return value of `tapper` is ignored.
	 * e.g. `.tapSome(console.log)` can be used anywhere in the pipeline to log the value, without altering the pipeline.
	 */
	tapSome(tapper: (val: T) => unknown) {
		if (this.isSome()) tapper(this.get());
		return this;
	}

	tapNone(tapper: () => unknown) {
		if (this.isNone()) tapper();
		return this;
	}

	/**
	 * Calls `effect` with the Some value of the Option, no-op if it's None. The return value of `effect` is ignored.
	 * Used to perform side-effects like network operations, or state mutation. 
	 * Equivalent to `.tapSome`, but preferred if not debugging.
	 */
	effect(effect: (val: T) => unknown) { return this.tapSome(effect); }

	/** Flattens a option, converting an Option<Option<T>> into an Option<T>. */
	flat() {
		return (this.isSome() ? this.get() : this as unknown) as T extends Opt<infer U> ? Opt<U> : never;
	}	
	
	static do<T>(cb: (helpers: DoHelpers) => T | Opt<T>): Opt<T> {
		const bind: DoHelpers["bind"] = (v) => {
			const res = v.toOption();
			if (res.isSome()) return res.orThrow();
			throw new DoError();
		};
		try {
			const ret = cb({ bind });
			return ret instanceof Opt ? ret : Opt.some(ret); 
		}
		catch (e) {
			if (e instanceof DoError) return Opt.none();
			throw e;
		}
	}
	
	/** Calls `cb` with `this`, and returns what `cb` returns. Escape hatch to call arbitrary functions on an Option. */
	pipe<T>(cb: (opt: this) => T) { return cb(this); }
	/** Shorthand for `pipe`. */
	$<T>(cb: (opt: this) => T) { return cb(this); }

	static [TypeName] = "Option";
	static [Serialize] = (v: Opt<unknown>) => ({ ...v });
	static [Deserialize] = (v: unknown) =>
		Result.ok(v)
		.filter(v => !!(v && typeof v === "object" && "_option" in v && v._option && typeof v._option === "object" && "some" in v._option && typeof v._option.some === "boolean"))
		.map(v => new Opt((v as Opt)._option));
}

NONE = Object.freeze(new Opt<any>({ some: false })) as Opt<any>;

export { Opt, Opt as Option };

export const optionSchema = <S extends ZodType>(t: S) => 
	z.object({ "_option": z.union([ z.object({ some: z.literal(true), v: t }), z.object({ some: z.literal(false), v: z.never().optional() }) ]) })
	.or(z.custom<Opt<z.input<S> | never>>(v => v instanceof Opt))
	.transform((res) => new Opt<z.infer<S>>((res as any)._option));

appendFormatter({
	filter: v => Opt.isOption(v),
	header: (v) => v.match<FormatterElemTag>(
		val => [ "span", {}, 
			[ "span", { style: "color: #9999ff; font-style: italic;" }, "Some" ],
			[ "span", {}, "(" ],
			["object", { object: val } ],
			[ "span", {}, ")" ] ],
		() => [ "span", { style: "color: #9999ff; font-style: italic;" }, "None" ],
	)
});