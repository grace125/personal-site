import { z, ZodTypeAny } from "zod";
import { ContainerFn, ContainerFnArgs } from "../traits/ContainerIterFn";
import { Hash, Hashable, HashFunction } from "../traits/Hashable";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { List } from "./List";
import { Opt } from "./Option";
import { Result } from "./Result";
import { appendFormatter, FormatterTag } from "../DevTools";

type HashSetFn<V, R = unknown> = ContainerFn<ContainerFnArgs<V, V, HashSet<V>>, R>

class HashSet<V> implements Iterable<V>, Pipeable<HashSet<V>> {
	private _hashset = new Map<unknown, V>;
	#hashFunction = Opt.none<HashFunction<any>>();

	get size() { return this._hashset.size; }

	hash(val: V) {
		return this.#hashFunction.match(fn => fn(val), () => {
			const typeHashFn = ((val as Hashable)[Hash] ?? (val as any).constructor?.[Hash]);
			return typeof typeHashFn === "function" ? typeHashFn?.call(val, val as any) : val;
		});
	}

	constructor(from: Iterable<V>, hashFunction: Opt<HashFunction<V>>) {
		this._hashset = new Map([...from].map(val => ([ this.hash(val), val ])));
		this.#hashFunction = hashFunction;
	}

	static isHashSet(val: unknown): val is HashSet<unknown> {
		return !!(val && typeof val === "object" && "_hashset" in val);
	}

	static from<V>(val: Iterable<V> | HashSet<V>) { return new HashSet<V>(val, Opt.none()); }
	static of<V>(...elems: V[]) { return new HashSet<V>(elems, Opt.none()); }
	static new<V = never>() { return new HashSet<V>([], Opt.none()); }
	static withHasher<V>(fn: HashFunction<V>) { return new HashSet<V>([], Opt.some(fn)); }

	clear() {
		this._hashset.clear();
		return this;
	}

	delete(value: V) {
		const newSet = new HashSet(this, this.#hashFunction);
		newSet._hashset.delete(this.hash(value));
		return newSet;
	}
	deleteMut(value: V) {
		this._hashset.delete(this.hash(value));
		return this;
	}

	tap(cb: HashSetFn<V>) { this._hashset.forEach(v => cb(v, v, this)); }

	forEach(forEach: HashSetFn<V>): void { this._hashset.forEach(v => forEach(v, v, this)); }

	map<Z>(cb: HashSetFn<V, Z>): List<Z> { return List.from(this._hashset.values()).mapMut((v) => cb(v, v, this)); }

	any(pred: HashSetFn<V>) { return [...this.values()].some((v) => pred(v, v, this)); }
	every(pred: HashSetFn<V>) { return [...this.values()].every((v) => pred(v, v, this)); }
	has(val: V) { return this._hashset.has(this.hash(val)); }

	filter<S extends V>(pred: (value: V, key: V, map: HashSet<V>) => value is S): HashSet<S>;
	filter(pred: HashSetFn<V>): HashSet<V>;
	filter(pred: HashSetFn<V>) {
		return HashSet.from([...this.values()].filter(v => pred(v, v, this)));
	}

	add(...vals: V[]) {
		const newMap = new HashSet(this, this.#hashFunction);
		for (const val of vals) newMap._hashset.set(this.hash(val), val);
		return newMap;
	}
	addMut(...vals: V[]) {
		for (const val of vals) this._hashset.set(this.hash(val), val);
		return this;
	}

	toggle(val: V) {
		return this.has(val) ? this.delete(val) : this.add(val);
	}

	/** Everything in `this` except what is in `o`. */
	difference(o: HashSet<V>) {
		return HashSet.from<V>([...this._hashset.entries()].filter(([k]) => !o._hashset.has(k)).map(([,v]) => v));
	}
	/** Everything in both `this` and `o`. */
	intersection(o: HashSet<V>) {
		return HashSet.from<V>([...this._hashset.entries()].filter(([k]) => o._hashset.has(k)).map(([,v]) => v));
	}

	pipe<P>(pipe: (v: this) => P) { return pipe(this); }

	keys() { return this._hashset.values(); }
	values() { return this._hashset.values(); }
	[Symbol.iterator]() { return this._hashset.values(); }
	entries() { return [...this._hashset.values()].map(v => [ v, v ] as [ V, V ]); }
	toString() { return this._hashset.toString(); }

	static [TypeName] = "HashSet";
	static [Serialize] = (val: HashSet<unknown>) => [...val.values()];
	static [Deserialize] = (v: unknown) => 
		Result.ok(z.unknown().array().safeParse(v))
		.filter(v => v.success)
		.map(v => HashSet.from(v.data))

	// Specialty members.

	odd(pred: HashSetFn<V>) { return this.count(pred) % 2 === 1; }
	even(pred: HashSetFn<V>) { return this.count(pred) % 2 === 0; }
	count(pred: HashSetFn<V>) { return [...this._hashset.values()].filter(v => pred(v, v, this)).length; } 
}

export { HashSet, HashSet as Set };

export const hashSetSchema = <V extends ZodTypeAny>(s: V) => 
	z.set(s).transform(HashSet.from)
	.or(z.custom<HashSet<z.infer<V>>>(val => val instanceof HashSet)
		.transform(hs => HashSet.of<z.infer<V>>(...[...hs.values()].map(v => s.parse(v)))));

appendFormatter({
	filter: v => HashSet.isHashSet(v),
	header: v => [ "span", {},
		[ "span", { style: "color: #9999ff; font-style: italic;" }, "HashSet " ],
		[ "span", { style: "font-style: italic;" }, `(${v.size})` ],
	],
	body: v => {
		return Opt.some([ "span", {}, 
			...v.map<FormatterTag>((v, i) => [ "span", {}, `\t`, 
				[ "span", { style: "color: #9999ff; line-height: 1.5em;" }, `• `],
				[ "object", { object: v }], "\n" ])
		]);
	}
});