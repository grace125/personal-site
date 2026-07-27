import { z, ZodType } from "zod";
import { gt, lt } from "../Functional";
import { clamp, mod } from "../Math";
import { ContainerFn, ContainerFnArgs } from "../traits/ContainerIterFn";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { HashMap } from "./HashMap";
import { Opt } from "./Option";
import { Result } from "./Result";
import { appendFormatter, FormatterTag } from "../DevTools";

type ListFn<T, R = unknown> = ContainerFn<ContainerFnArgs<number, T, List<T>>, R>;

type Dec<D extends number> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D];
type FlatList<L, D extends number> =
	D extends 0 
	? L 
	: L extends ReadonlyArray<infer InnerArr> 
		? FlatList<InnerArr, Dec<D>>
		: L extends List<infer InnerList>
			? FlatList<InnerList, Dec<D>>
			: L;

export class List<T = never> implements Iterable<T>, Pipeable<List<T>> {
	private _list: T[];
	
	get size() { return this._list.length; }
	get length() { return this._list.length; }

	// Index signature implemented by proxy.
	[ind: number]: T | undefined;

	constructor(from: Array<T> | Iterable<T>) {
		this._list = Array.isArray(from) ? from : Array.from(from);

		return new Proxy(this, {
			get(target, key) {
				const ind = typeof key === "symbol" ? Number.NaN : Number(key);
				return Number.isNaN(ind) 
					? Reflect.get(target, key) 
					: target._list[ind < 0 ? target._list.length + ind : ind] as T;
			},
			set(target, key, val, recv) {
				const ind = typeof key === "symbol" ? Number.NaN : Number(key);
				if (Number.isNaN(ind)) return Reflect.set(target, key, val, recv);
				target._list[ind < 0 ? target._list.length + ind : ind] = val as T;
				return true;
			}
		}) as List<T>;
	}

	static isList<T = unknown>(val: unknown): val is List<T> {
		return !!(typeof val === "object" && val && "_list" in val);
	}

	static from<T>(val: Array<T> | List<T> | Iterable<T>) { return new List<T>(List.isList(val) ? [...val._list as T[]] : val); }
	static of<T>(...elems: T[]) { return new List<T>(elems); }
	static new<T = never>() { return new List<T>([]); }

	static gen<T>(len: number, f: (i: number) => T) {
		const arr = []
		arr.length = Math.max(len, 0)
		for (var i = 0; i < len; i++) arr[i] = f(i)
		return List.from(arr)
	}
	static gen2flat<T>(rows: number, cols: number, f: (r: number) => (c: number) => T): List<T> {
		const arr = []
		for (var r = 0; r < rows; r++) {
			const g = f(r)
			for (var c = 0; c < cols; c++) arr.push(g(c))
		}
		return List.from(arr)
	}
	static repeat<T>(len: number, item: T) {
		const arr = []
		arr.length = Math.max(len, 0)
		for (var i = 0; i < len; i++) arr[i] = item
		return List.from(arr)
	}
	
	static range(max: number): List<number>;
	static range(min: number, max: number, step?: number): List<number>;
	static range(a: number, b?: number, c?: number) {
		const min = Math.min(a, b ?? 0);
		const max = Math.max(a, b ?? 0);
		const step = c ?? 1;
		const num = Math.floor((max - min) / step)
		return new List([...new Array(num).keys()].map(k => k * step + min));
	}
	
	pipe<O>(v: (self: this) => O) { return v(this); }
	$<O>(v: (self: this) => O) { return v(this); }

	get(ind: number) { return Opt.undefined(this._list[ind]); }
	getClamped(ind: number) { return Opt.undefined(this._list.at(clamp(ind, 0, this._list.length - 1))); }
	getMod(ind: number) { return this._list.at(mod(ind, this._list.length)) }
	get2<U>(this: List<List<U>>, ind1: number, ind2: number) {
		return Opt.undefined(this._list[ind1]?._list[ind2])
	}

	set(ind: number, value: T) {
		return new List(this._list.with(ind < 0 ? this._list.length + ind : ind, value));
	}
	setFrom(ind: number, fn: (old: T) => T) {
		return new List(this._list.with(ind < 0 ? this._list.length + ind : ind, fn(this._list.at(ind)!)));
	}
	
	setMut(ind: number, value: T) { 
		this._list[ind < 0 ? this._list.length + ind : ind] = value; 
		return this;
	}

	push(...values: T[]) { return this.concat(values); }
	pushMut(...values: T[]) {
		this._list.push(...values);
		return this;
	}

	/** Given an **already sorted list**, inserts `value` into the correct sorted position. */
	insertSortedMut(value: T, sortFn: (a: T, b: T) => number) {
		for (let i = 0; i < this._list.length; i++) {
			if (sortFn(this._list[i]!, value) >= 0) {
				this._list.splice(i, 0, value);
				return this;
			}
		}
		this._list.push(value);
		return this;
	}
	insertSorted(value: T, sortFn: (a: T, b: T) => number) {
		return this.clone().insertSortedMut(value, sortFn);
	}

	head() { return this._list.length > 0 ? Opt.some(this._list[0]) : Opt.none(); }
	pop(): T | undefined { return this._list.pop(); }	
	
	/** Inserts values at the beginning of the list. */
	unshift(...values: T[]) { return new List(values).concat(this._list); }
	unshiftMut(...values: T[]) { 
		this._list.unshift(...values);
		return this;
	}
	
	tail() { return this._list.length > 0 ? Opt.some(this._list[this._list.length - 1]) : Opt.none(); }
	/** Removes the first element from the list and returns it. */
	shift(): T | undefined { return this._list.shift(); }

	concat(...rest: (Array<T> | List<T>)[]): List<T> {
		return new List(this._list.concat(...rest.map(r => List.isList<T>(r) ? r._list : r)));
	}
	concatMut(...rest: (Array<T> | List<T>)[]): List<T> {
		this._list = this._list.concat(...rest.map(r => List.isList<T>(r) ? r._list : r));
		return this;
	}

	clear(): List<T> {
		this._list = [];
		return this;
	}

	tap(tapper: (val: this) => void) {
		tapper(this);
		return this;
	}

	effect(effect: ListFn<T, void>) {
		this._list.forEach((v, i) => effect(v, i, this));
		return this;
	}

	forEach(forEach: ListFn<T, void>): void {
		this._list.forEach((v, i) => forEach(v, i, this));
	}
	map<U = T>(mapper: ListFn<T, U>): List<U> {
		return new List(this._list.map((v, i) => mapper(v, i, this)));
	}
	mapMut<U = T>(mapper: ListFn<T, U>): List<U> {
		for (let i = 0; i < this._list.length; i++) this._list[i] = mapper(this._list[i]!, i, this) as any as T;
		return this as any as List<U>;
	}

	mapState<S, U = T>(
		mapper: (state: S, value: T, index: number, list: List<T>) => [ newState: S, newValue: U ],
		initialState: S) {
		let state = initialState;
		return [ new List<U>(this._list.map((v, i) => {
			const [ newState, newVal ] = mapper(state, v, i, this);
			state = newState;
			return newVal;
		})), state ];
	}

	mapStateMut<S, U = T>(
		mapper: (state: S, value: T, index: number, list: List<T>) => [ newState: S, newValue: U ],
		initialState: S) {
		let state = initialState;
		for (let i = 0; i < this._list.length; i++) {
			const [ newState, newVal ] = mapper(state, this._list[i]!, i, this);
			state = newState;
			this._list[i] = newVal as any as T;
		}
		return [ this as any as List<U>, state ];
	}

	scanMut<U = T>(mapper: (state: U, value: T, index: number, list: List<T>) => U, initialState: U) {
		let state = initialState;
		this.mapMut((value, ind) => {
			const val = mapper(state, value, ind, this);
			state = val;
			return val;
		});
		this.unshiftMut(initialState as any as T);
		return this as any as List<U>;
	}

	scan<U = T>(mapper: (state: U, value: T, index: number, list: List<T>) => U, initialState: U) {
		return new List<U>(this._list as any).scanMut((state, _, index) => 
			mapper(state, this[index]!, index, this), initialState);
	}

	zip2<S>(list: List<S>): Result<List<[T, S]>, string> {
		return this
			.map<[ T, S ]>((v, i) => [ v, list.get(i).orNull()! ])
			.pipe(l => Result.ok(l))
			.filter(() => list.length === this.length, "Lists must be the same length.") 
	}
	zipWithPrevious(): List<[Opt<T>, T]> {
		return this.map((v, i) => [ i === 0 ? Opt.none() : this.get(i - 1), v ]);
	}

	flatMap<U>(mapper: ListFn<T, List<U> | U[]>): List<U> {
		return new List(this._list.map((v, i) => mapper(v, i, this))).flatMut(1);
	}
	flat<D extends number = 1>(depth?: D): List<FlatList<T, D>> { return new List(this._list).flatMut(depth); };
	flatMut<D extends number = 1>(depth?: D): List<FlatList<T, D>> {
		for (let d = 0; d < (depth ?? 1); d++) {
			for (let i = 0; i < this._list.length; i++) {
				const v = this._list[i];
				if (List.isList(v) || Array.isArray(v)) {
					this.spliceMut(i, 1, ...v);
					i += v.length - 1;
				}
			}
		}
		return this as List<FlatList<T, D>>;
	}

	filter<S extends T>(pred: (value: T, ind: number, list: List<T>) => value is S): List<S>;
	filter(pred: ListFn<T>): List<T>;
	filter(pred: ListFn<T>) {
		return new List(this._list.filter((v, i) => pred(v, i, this)));
	}

	filterMut<S extends T>(pred: (value: T, ind: number, list: List<T>) => value is S): List<S>;
	filterMut(pred: ListFn<T>): List<T>;
	filterMut(pred: ListFn<T>) {
		let o = 0;
		for (let i = 0; i < this._list.length; i++) {
			if (!pred(this._list[i]!, o++, this)) this._list.splice(i--, 1);
		}
		return this;
	}

	filterMap<S = T>(pred: ListFn<T, Opt<S>>) {
		return new List(this._list.map((v, i) => pred(v, i, this)).filter(o => o.isSome()).map(o => o.orThrow()))
	}

	reduce(reducer: (acc: T, val: T, ind: number, list: List<T>) => T): NonNullable<T>;
	reduce<S = T>(reducer: (acc: S, val: T, ind: number, list: List<T>) => S, initial?: S): NonNullable<S>;
	reduce<S = T>(reducer: (acc: S, val: T, ind: number, list: List<T>) => S, initial?: S) {
		return arguments.length > 1 
			? this._list.reduce<S>((acc, val, ind) => reducer(acc, val, ind, this)!, initial!)
			: this._list.reduce((acc, val, ind) => reducer(acc as NonNullable<S>, val, ind, this) as NonNullable<T>)
	}

	reduceRight(reducer: (acc: T, val: T, ind: number, list: List<T>) => T): NonNullable<T>;
	reduceRight<S = T>(reducer: (acc: S, val: T, ind: number, list: List<T>) => S, initial?: S): NonNullable<S>;
	reduceRight<S = T>(reducer: (acc: S, val: T, ind: number, list: List<T>) => S, initial?: S) {
		return arguments.length > 1 
			? this._list.reduceRight<S>((acc, val, ind) => reducer(acc, val, ind, this)!, initial!)
			: this._list.reduceRight((acc, val, ind) => reducer(acc as NonNullable<S>, val, ind, this) as NonNullable<T>)
	}

	any(pred: ListFn<T>) { return this._list.some((v, i) => pred(v, i, this)); }
	every(pred: ListFn<T>) { return this._list.every((v, i) => pred(v, i, this)); }
	includes(v: T) { return this._list.includes(v); }

	indexOf(v: T, from?: number) { return Opt.some(this._list.indexOf(v, from)).filter(i => i !== -1); }
	lastIndexOf(v: T, from?: number) { return Opt.some(this._list.lastIndexOf(v, from)).filter(i => i !== -1); }

	findIndex(pred: ListFn<T>) { 
		return Opt.some(this._list.findIndex((v, i) => pred(v, i, this))).filter(i => i !== -1); 
	}
	findLastIndex(pred: ListFn<T>) { 
		return Opt.some(this._list.findLastIndex((v, i) => pred(v, i, this))).filter(i => i !== -1); 
	}

	private findPredCmpIndex(pred: ListFn<T, number>, cmp: (a: number, b: number) => boolean) {
		let minInd = -1;
		let minVal: number | null = null;
		this._list.forEach((v, i) => {
			const val = pred(v, i, this);
			if (minVal === null || cmp(val, minVal)) {
				minInd = i;
				minVal = val;
			}
		});
		return Opt.some(minInd).filter(m => m !== -1);
	}
	findMin(pred: ListFn<T, number>) { return this.findMinIndex(pred).bind(i => this.get(i)); }
	findMinIndex(pred: ListFn<T, number>) { return this.findPredCmpIndex(pred, lt); }
	findMax(pred: ListFn<T, number>) { return this.findMaxIndex(pred).bind(i => this.get(i)); }
	findMaxIndex(pred: ListFn<T, number>) { return this.findPredCmpIndex(pred, gt); }

	find<S extends T>(pred: (value: T, ind: number, list: List<T>) => value is S): Opt<S>;
	find(pred: ListFn<T>): Opt<T>;
	find(pred: ListFn<T>) { return Opt.undefined(this._list.find((v, i) => pred(v, i, this))); }
	findLast(pred: ListFn<T>) { return Opt.undefined(this._list.findLast((v, i) => pred(v, i, this))); }

	reverse() { return new List(this._list.toReversed()); }
	reverseMut() { 
		this._list.reverse();
		return this; 
	}

	sort(sorter: (a: T, b: T) => number) { return new List(this._list.toSorted(sorter)); }
	sortMut(sorter: (a: T, b: T) => number) { 
		this._list.sort(sorter); 
		return this;
	}

	slice(start: number, endExclusive?: number) { return new List(this._list.slice(start, endExclusive)); }

	toSize(size: number, def: (ind: number, list: this) => NoInfer<T>): List<T> {
		if (this._list.length > size) 
			return this.slice(0, size);
		else if (this._list.length < size) 
			return this.concat(List.range(size - this.length).map(i => def(i + this.size, this)));
		return this;
	}

	splice(start: number, deleteCount: number, ...items: T[]) {
		return List.from(this._list.toSpliced(start, deleteCount, ...items));
	}
	spliceMut(start: number, deleteCount: number, ...items: T[]) {
		this._list.splice(start, deleteCount, ...items);
		return this;
	}

	clone() { return List.from(this); }
	toArray() { return [...this._list]; }
	data() { return this._list; }

	// Native array methods passed through.

	keys() { return this._list.keys(); }
	values() { return this._list.values(); }
	[Symbol.iterator]() { return this._list.values(); }
	entries() { return this._list.entries(); }
	join(sep?: string) { return this._list.join(sep); }
	toString() { return this._list.toString() }

	// Serialization

	static [TypeName] = "List"
	static [Serialize] = (v: List<unknown>) => v.data();
	static [Deserialize] = (v: unknown) => Result.ok(v).filter(Array.isArray).map(List.from)

	// Specialty members.

	odd(pred: ListFn<T>) { return this.count(pred) % 2 === 1; }
	even(pred: ListFn<T>) { return this.count(pred) % 2 === 0; }
	count(pred: ListFn<T>) { return this._list.filter((v, i) => pred(v, i, this)).length; } 
	
	unique(): List<T>
	unique(keyFn: ListFn<T, any>): List<T>;
	unique(keyFn?: ListFn<T, any>) {
		if (!keyFn) return List.from(new Set(this._list).values());
		const foundKeys = new Set<any>();
		return this.filter((val, ind, list) => {
			const key = keyFn(val, ind, list);
			if (foundKeys.has(key)) return false;
			foundKeys.add(key);
			return true;
		});
	}

	/** Returns a Map of each distinct value of the List to the number of occurrences. */
	countUnique(): HashMap<T, number> {
		const count = HashMap.new<T, number>();
		this._list.forEach(v => count.setMut(v, count.get(v).match(v => v + 1, () => 1)));
		return count;
	}
}

export const listSchema = <S extends ZodType>(s: S) => 
	z.array(s).transform(List.from<z.infer<S>>)
	.or(z.custom<List<z.input<S>>>(val => List.isList(val))
		.transform((vals, ctx) => {
			try { return List.of<z.infer<S>>(...vals.map(v => s.parse(v))); }
			catch (e) {
				if (e instanceof z.ZodError)
					ctx.addIssue({
						code: "invalid_element",
						issues: e.issues,
						key: "invalid list element",
						origin: "map",
						continue: false,
					})
				else throw e;
				return null as any as List<z.infer<S>>
			}
		}));

appendFormatter({
	filter: v => List.isList(v),
	header: v => [ "span", {},
		[ "span", { style: "color: #9999ff; font-style: italic;" }, "List " ],
		[ "span", { style: "font-style: italic;" }, `(${v.length})` ],
	],
	body: v => {
		return Opt.some([ "span", {}, 
			...v.map<FormatterTag>((v, i) => [ "span", {}, `\t`, 
				[ "span", { style: "color: #9999ff; line-height: 1.5em;" }, `${i}`],
				[ "span", {}, ": " ], 
				[ "object", { object: v }], "\n" ])
		]);
	}
});