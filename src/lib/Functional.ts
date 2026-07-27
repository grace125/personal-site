type M<A, B> = (val: A) => B;

/** Pipes the first value though a series of transformation functions, and returns the final value. */
export const pipe: {
	<A, B>(v: A, ab: M<A, B>): B,
	<A, B, C>(v: A, ab: M<A, B>, bc: M<B, C>): C,
	<A, B, C, D>(v: A, ab: M<A, B>, bc: M<B, C>, cd: M<C, D>): D,
	<A, B, C, D, E>(v: A, ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>): E,
	<A, B, C, D, E, F>(v: A, ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>): F,
	<A, B, C, D, E, F, G>(v: A, ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>, fg: M<F, G>): G,
	<A, B, C, D, E, F, G, H>(v: A, ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>, fg: M<F, G>, gh: M<G, H>): H,
	<A, B, C, D, E, F, G, H, I>(v: A, ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>, fg: M<F, G>, gh: M<G, H>, hi: M<H, I>): I
} = (val: unknown, ...fns: any[]) => fns.reduce((v, fn) => fn(v), val);

/** Converts a chain of functions into one function which sends values through all of them. */
export const flow: {
	<A, B>(ab: M<A, B>): M<A, B>,
	<A, B, C>(ab: M<A, B>, bc: M<B, C>): M<A, C>,
	<A, B, C, D>(ab: M<A, B>, bc: M<B, C>, cd: M<C, D>): M<A, D>,
	<A, B, C, D, E>(ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>): M<A, E>,
	<A, B, C, D, E, F>(ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>): M<A, F>,
	<A, B, C, D, E, F, G>(ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>, fg: M<F, G>): M<A, G>,
	<A, B, C, D, E, F, G, H>(ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>, fg: M<F, G>, gh: M<G, H>): M<A, H>,
	<A, B, C, D, E, F, G, H, I>(ab: M<A, B>, bc: M<B, C>, cd: M<C, D>, de: M<D, E>, ef: M<E, F>, fg: M<F, G>, gh: M<G, H>, hi: M<H, I>): M<A, I>
} = (...fns: any[]) => (val: any) => fns.reduce((v, fn) => fn(v), val);

type Is<A, B extends A> = (val: A) => val is B;

/** Chains type predicates. */
export const and: {
	<A, B extends A>(ab: Is<A, B>): Is<A, B>,
	<A, B extends A, C extends B>(ab: Is<A, B>, bc: Is<B, C>): Is<A, C>,
	<A, B extends A, C extends B, D extends C>(ab: Is<A, B>, bc: Is<B, C>, cd: Is<C, D>): Is<A, D>,
	<A, B extends A, C extends B, D extends C, E extends D>(ab: Is<A, B>, bc: Is<B, C>, cd: Is<C, D>, de: Is<D, E>): Is<A, E>,
	<A, B extends A, C extends B, D extends C, E extends D, F extends E>(ab: Is<A, B>, bc: Is<B, C>, cd: Is<C, D>, de: Is<D, E>, ef: Is<E, F>): Is<A, F>,
	<A, B extends A, C extends B, D extends C, E extends D, F extends E, G extends F>(ab: Is<A, B>, bc: Is<B, C>, cd: Is<C, D>, de: Is<D, E>, ef: Is<E, F>, fg: Is<F, G>): Is<A, G>,
	<A, B extends A, C extends B, D extends C, E extends D, F extends E, G extends F, H extends G>(ab: Is<A, B>, bc: Is<B, C>, cd: Is<C, D>, de: Is<D, E>, ef: Is<E, F>, fg: Is<F, G>, gh: Is<G, H>): Is<A, H>,
	<A, B extends A, C extends B, D extends C, E extends D, F extends E, G extends F, H extends G, I extends H>(ab: Is<A, B>, bc: Is<B, C>, cd: Is<C, D>, de: Is<D, E>, ef: Is<E, F>, fg: Is<F, G>, gh: Is<G, H>, hi: Is<H, I>): Is<A, I>
} = ((...fns: any[]) => ((val: any) => fns.reduce((v, fn) => v && fn(val), true))) as any;

export const invert = <T extends ((...args: any[]) => boolean)>(pred: T) => (...args: any[]) => !pred(...args);
export const not = (v: unknown) => !v;

/** 
 * Accepts a function, and returns a function which may be curried. The function may not be variadic. 
 * 
 * ```
 * // All `RES` are the same:
 * 
 * const dist3D = (x: number, y: number, z: number) => Math.sqrt(x ** 2 + y ** 2 + z ** 2);
 * const RES = dist3D(1, 2, 3);
 * 
 * const dist3DCurry = curry(dist3D);
 * const RES1 = dist3DCurry(1, 2, 3);
 * const RES2 = dist3DCurry(1)(2)(3);
 * const RES3 = dist3DCurry(1)(2, 3);
 */

export const curry = <T extends (...args: any[]) => any>(fn: T) => {
	// TODO: should probably implement this using `bind` since it seems to not butcher parameter names & type signatures like this implementation does.
	
	type partialParams<T extends any[], L extends any[] = []> =
	T extends [ infer A, ...infer Rest ] ? [ ...L, A ] | partialParams<Rest, [ ...L, A ]> : never;

	type remainingParams<A extends any[], B extends any[]> =
	B extends [ unknown, ...infer BR ]
		? A extends [ unknown, ...infer AR ] 
			? remainingParams<AR, BR> : B
		: [];

	type Currier<L extends any[]> = (accum: unknown[]) => 
		<U extends partialParams<remainingParams<L, Parameters<T>>>>(...args: U) => 
			remainingParams<[ ...L, ...U ], Parameters<T>> extends [ any, ...any[] ] 
			? ReturnType<Currier<[...L, ...U]>> 
			: ReturnType<T>;

	const currier: Currier<[]> = (accum) => (...args: any) =>
		accum.push(args) >= fn.length ? fn(...accum) : currier(accum);
	return currier([]);
}

export const bind = <A extends any[], B extends any[], R>(fn: (...args: [...A, ...B]) => R, ...args: A): 
	((...args: B) => R) => fn.bind(undefined, ...args);

type TupleMap<T extends any[], A extends any[], U> =
	T extends [ any, ...infer Rest ] ? TupleMap<Rest, [...A, U], U> : A;

export const tupleMap = <T extends any[]>(...elems: T) => <U = T>(mapper: (elem: T[number], i: number, arr: T) => U) =>
	elems.map((v, i) => mapper(v as T[number], i, elems)) as TupleMap<T, [], U>

export const id = <T>(x: T) => x

export const isSelf = <T>(x: T): x is T => true;

export const omit = <T extends Record<string, any>, O extends (keyof T)[]>(t: T, o: O) => {
	const omitted = { ...t };
	o.forEach(o => delete omitted[o]);
	return omitted as Omit<T, O[number]>;
}

export const pick = <T extends Record<string, any>, P extends (keyof T)[]>(t: T, p: P) => {
	const pick: any = {};
	p.forEach(p => void (pick[p] = t[p]));
	return pick as Pick<T, P[number]>;
}

type GetNTuple<N extends number, T extends any[], A extends any[] = []> =
	N extends A["length"] ? A : T extends [ infer I, ...infer R ] ? GetNTuple<N, R, [...A, I]> : never;
type GetNVariadic<N extends number, T extends any, A extends any[] = []> =
	N extends A["length"] ? A : GetNVariadic<N, T, [...A, _: T]>;

type Required<T extends readonly unknown[]> = { [K in keyof T]-?: Exclude<T[K], undefined>; };
type GetN<N extends number, T extends any[]> =
	T extends [ infer _Is_A_Tuple, ...infer _ ] ? GetNTuple<N, Required<T>> : GetNVariadic<N, T[number]>;

export const arity = <T extends (...args: any[]) => any, N extends number>(fn: T, arity: N) =>
	// @ts-ignore
	(...args: GetN<N, Parameters<T>>): ReturnType<T> => fn(...args.slice(0, arity));
export const nullary = <T extends () => any>(fn: T) => fn()
export const unary = <T extends (...args: any[]) => any>(fn: T) => arity(fn, 1);
export const binary = <T extends (...args: any[]) => any>(fn: T) => arity(fn, 2);

export const add = (...args: number[]) => args.reduce((a, b) => a + b, 0);
export const sub = (...args: number[]) => args.reduce((a, b) => a - b, 0);
export const div = (...args: number[]) => args.reduce((a, b) => a / b, 1);
export const mul = (...args: number[]) => args.reduce((a, b) => a * b, 1);

export const lt = (a: number, b: number) => a < b;
export const gt = (a: number, b: number) => a > b;

export const once = <T extends (...args: any[]) => any>(cb: T): T => {
	let done = false;
	return ((...args: Parameters<T>): ReturnType<T> => {
		if (done) return null as any;
		done = true;
		return cb(...args);
	}) as T;
} 