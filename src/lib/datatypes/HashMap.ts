import { object, z, ZodTypeAny } from "zod";
import { ContainerFn, ContainerFnArgs } from "../traits/ContainerIterFn";
import { Hash, Hashable, HashFunction } from "../traits/Hashable";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { List } from "./List";
import { Opt } from "./Option";
import { Result } from "./Result";
import { appendFormatter, FormatterTag } from "../DevTools";

type HashMapFn<K, V, R = unknown> = ContainerFn<ContainerFnArgs<K, V, HashMap<K, V>>, R>

class HashMap<K, V> implements Iterable<[K, V]>, Pipeable<HashMap<K, V>> {
	private _hashmap = new Map<unknown, [ K, V ]>;
	#hashFunction = Opt.none<HashFunction<any>>();

	get size() { return this._hashmap.size; }

	hash(key: K) {
		return this.#hashFunction.match(fn => fn(key), () => {
			const typeHashFn = ((key as Hashable)[Hash] ?? (key as any).constructor?.[Hash]);
			return typeof typeHashFn === "function" ? typeHashFn?.call(key, key as any) : key;
		});
	}

	constructor(from: Iterable<readonly [K, V]>, hashFunction: Opt<HashFunction<K>>) {
		this._hashmap = new Map([...from].map(pair => ([ this.hash(pair[0]), [ ...pair ] ])));
		this.#hashFunction = hashFunction;
	}

	static isHashMap(val: unknown): val is HashMap<unknown, unknown> {
		return !!(val && typeof val === "object" && "_hashmap" in val);
	}

	static from<K, V>(val: Iterable<readonly [K, V]> | HashMap<K, V> | Map<K, V>) { return new HashMap<K, V>(val, Opt.none()); }
	static of<K, V>(...elems: (readonly [K, V])[]) { return new HashMap<K, V>(elems as [K, V][], Opt.none()); }
	static new<K = never, V = never>() { return new HashMap<K, V>([], Opt.none()); }
	static withHasher<K, V>(fn: HashFunction<K>) { return new HashMap<K, V>([], Opt.some(fn)); }
	static fromRecord<R extends Record<string, any>>(rec: R) {
		return HashMap.from<keyof R, R[keyof R]>(Object.entries(rec))
	}

	clear() {
		this._hashmap.clear();
		return this;
	}

	/** Returns a new HashMap with the value corresponding to `key` removed from it. */
	delete(key: K) {
		const newMap = new HashMap(this, this.#hashFunction);
		newMap._hashmap.delete(this.hash(key));
		return newMap;
	}
	/** Mutably deletes the value associated with `key` from this hashmap, and returns itself. */
	deleteMut(key: K) {
		this._hashmap.delete(this.hash(key));
		return this;
	}

	tap(cb: HashMapFn<K, V>) { this._hashmap.forEach(([ k, v ]) => cb(v, k, this)); }

	/** Runs a function for each value in the hashmap. */
	forEach(forEach: HashMapFn<K, V, void>): void { this._hashmap.forEach(([ k, v ]) => forEach(v, k, this)); }

	/** Runs a mapping function for each value in the hashmap, creates a new hashmap out of the results. */
	map<Z>(cb: HashMapFn<K, V, Z>): HashMap<K, Z> { 
		return HashMap.from(List.from(this._hashmap.values()).mapMut(([k, v]) => [ k, cb(v, k, this) ] as const)); 
	}
	mapPairs<Z, Y = K>(cb: HashMapFn<K, V, [ Y, Z ]>): HashMap<Y, Z> {
		return HashMap.from(List.from(this._hashmap.values()).mapMut(([k, v]) => cb(v, k, this)))
	}

	/** Searches the map for `key` and returns an Option containing the value corresponding to it. */
	get(key: K): Opt<V> { return Opt.undefined(this._hashmap.get(this.hash(key))?.[1]); }

	findKey(pred: HashMapFn<K, V>): Opt<K> {
		const ent = [...this._hashmap.values()];
		const ind = ent.findIndex(([ key, val ]) => pred(val, key, this))
		return ind === -1 ? Opt.none() : Opt.some(ent[ind]![0]!);
	}
	find(pred: HashMapFn<K, V>): Opt<V> { 
		return this.findKey(pred).bind(key => this.get(key));
	}
	
	filter<S extends V>(pred: (value: V, key: K, map: HashMap<K, V>) => value is S): HashMap<K, S>;
	filter(pred: HashMapFn<K, V>): HashMap<K, V>;
	filter(pred: HashMapFn<K, V>) {
		return HashMap.from([...this.entries()].filter(([ k, v ]) => pred(v, k, this)));
	}
	
	filterKeys<S extends K>(pred: (key: K, value: V, map: HashMap<K, V>) => key is S): HashMap<S, V>;
	filterKeys(pred: ContainerFn<ContainerFnArgs<V, K, HashMap<K, V>>, unknown>): HashMap<K, V>;
	filterKeys(pred: ContainerFn<ContainerFnArgs<V, K, HashMap<K, V>>, unknown>) {
		return HashMap.from([...this.entries()].filter(([ k, v ]) => pred(k, v, this)));
	}

	filterMap<S = V>(pred: HashMapFn<K, V, Opt<S>>) {
		return List.from(this.entries())
			.map(([ k, v ]) => [ k, pred(v, k, this) ] as const)
			.filter(([ , v ]) => v.isSome())
			.map(([ k, v ]) => [ k, v.orThrow() ] as const)
			.pipe(HashMap.from);
	}

	/** Returns `true` if there are any values matching `pred`. */
	any(pred: HashMapFn<K, V>) { return [...this._hashmap.values()].some(([k, v]) => pred(v, k, this)); }
	/** Returns `true` if all values match `pred` (or there are zero values) */
	every(pred: HashMapFn<K, V>) { return [...this._hashmap.values()].every(([k, v]) => pred(v, k, this)); }
	/** Returns `true` if this hashmap has a value at `key`. */
	has(key: K) { return this._hashmap.has(this.hash(key)); }
	/** Returns the number of values which match `pred`. */
	count(pred: HashMapFn<K, V>) { return this.filter(pred).size; } 

	/** Returns a new hashmap which contains a mapping from `key` to `value`. */
	set(key: K, val: V) {
		const newMap = new HashMap(this, this.#hashFunction);
		newMap._hashmap.set(this.hash(key), [ key, val ]);
		return newMap;
	}
	/** Adds a mapping from `key` to `value` to this hashmap, and returns it. */
	setMut(key: K, val: V) {
		this._hashmap.set(this.hash(key), [ key, val ]);
		return this;
	}

	/** If there is no value corresponding to `key`, inserts it mutably using the 
	 * `init` function, and then returns the value for `key` (which may have just been inserted). */
	getOrInsert(key: K, init: () => V): V {
		if (!this.has(key)) this.setMut(key, init());
		return this.get(key).orThrow();
	}

	pipe<O>(v: (self: this) => O) { return v(this); }
	$<O>(v: (self: this) => O) { return v(this); }

	keys() { return [...this._hashmap.values()].map(([k]) => k); }
	values() { return [...this._hashmap.values()].map(([,v]) => v); }
	[Symbol.iterator]() { return this._hashmap.values(); }
	entries() { return this._hashmap.values(); }
	toString() { return this._hashmap.toString() }

	widenKey<S>(): (K extends S ? HashMap<S, V> : never) { return this as any; }
	widenValue<S>(): (V extends S ? HashMap<K, S> : never) { return this as any; }

	toRecord(): Record<K extends string ? K : string, V> {
		return Object.fromEntries(this.entries());
	}

	static [TypeName] = "HashMap";
	static [Serialize] = (val: HashMap<unknown, unknown>) => [...val.entries()];
	static [Deserialize] = (v: unknown) => 
		Result.ok(z.tuple([ z.unknown(), z.unknown() ]).array().safeParse(v))
		.filter(v => v.success)
		.map(v => HashMap.from(v.data))
}

export { HashMap, HashMap as Map };

export const hashMapSchema = <K extends ZodTypeAny, V extends ZodTypeAny>(k: K, v: V) => 
	z.map(k, v).transform(HashMap.from)
	.or(z.custom<HashMap<z.infer<K>, z.infer<V>>>(val => val instanceof HashMap)
		.transform(hm => HashMap.of<z.infer<K>, z.infer<V>>(...[...hm.entries()]
			.map(([kk, vv]) => [k.parse(kk), v.parse(vv)] as const))));

appendFormatter({
	filter: v => HashMap.isHashMap(v),
	header: v => [ "span", {},
		[ "span", { style: "color: #9999ff; font-style: italic;" }, "HashMap " ],
		[ "span", { style: "font-style: italic;" }, `(${v.size})` ],
	],
	body: v => {
		return Opt.some([ "span", {}, 
			...v.entries().map(([k, v]) => [ "span", {}, `\t`, 
				[ "object", { object: k }],
				[ "span", { style: "color: #9999ff; line-height: 1.5em;" }, ": " ], 
				[ "object", { object: v }], 
				"\n" 
			] satisfies FormatterTag)
		]);
	}
});