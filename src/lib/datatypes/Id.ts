import { z, ZodTypeAny } from "zod";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { Opt, OptLike } from "./Option";
import { Result, ResultLike } from "./Result";
import { appendFormatter } from "../DevTools";

type LetHelpers = {
	bind: <U>(val: Identity<U>) => U;
}

/** Represents a value as a Monad. Mostly useful for `pipe`, `map`, etc. */
class Identity<T = void> implements Pipeable<Identity<T>>, ResultLike<T, never>, OptLike<T> {
	private _identity: T;
	
	constructor(val: T) { this._identity = val; }
	static new<T>(val: T) { return new Identity(val); }
	
	unwrap() { return this._identity; }
	orThrow(_unused_error?: unknown): T { return this.unwrap(); }
	map<U>(mapper: (val: T) => U): Identity<U> { return Identity.new(mapper(this.unwrap())) as Identity<U>; }
	bind<U>(binder: (val: T) => Identity<U>): Identity<U> { return binder(this.unwrap()) as Identity<U>; }
	tap(tapper: (val: this) => unknown) { tapper(this); return this; }
	tapId(tapper: (val: T) => unknown) { tapper(this.unwrap()); return this; }
	effect(effect: (val: T) => unknown) { return this.tapId(effect); }
	flat() { return this.unwrap() instanceof Identity ? this.unwrap() : this; }
	static isIdentity(v: unknown): v is Identity<unknown> { return v instanceof Identity; }

	toOption() { return Opt.some(this.unwrap()); }
	toResult<E = never>() { return Result.ok<T, E>(this.unwrap()); }
	
	static let<T>(cb: (helpers: LetHelpers) => T | Identity<T>): Identity<T> {
		const bind: LetHelpers["bind"] = (v) => v.unwrap();
		const ret = cb({ bind });
		return ret instanceof Identity ? ret : Identity.new(ret); 
	}
	
	pipe<T>(cb: (id: this) => T) { return cb(this); }
	$<T>(cb: (id: this) => T) { return cb(this); }

	static [TypeName] = "Identity";
	static [Serialize] = (v: Identity<unknown>) => ({ ...v });
	static [Deserialize] = (v: unknown) =>
		Result.ok(v)
		.filter(v => !!(v && typeof v === "object" && "_identity" in v && v._identity))
		.map(v => Identity.new((v as any)._identity));
}

const Id = <T>(val: T) => Identity.new(val); 

export { Id, Identity };

export const idSchema = <TS extends ZodTypeAny>(t: TS) => 
	z.object({ "_identity": t })
	.or(z.custom<Identity<z.input<TS>>>(v => v instanceof Identity))
	.transform((res: any): Identity<z.infer<typeof t>> => Identity.new(res._identity));

appendFormatter({
	filter: v => Identity.isIdentity(v),
	header: (v) => [ "span", {},
		[ "span", { style: "color: #9999ff; font-style: italic;" }, "Id" ],
		[ "span", {}, "(" ],
		 ["object", { object: v.unwrap() } ],
		[ "span", {}, ")" ] ]
});