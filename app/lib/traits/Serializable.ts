import { Result } from "../datatypes/Result";
import { Deserialize, Serialize, TypeName } from "./SerializableSymbols";

/**
 * Interface for a serializable / deserializable class. These methods should be static. 
 * We can't actually enforce this on a class level because typescript static interfaces suck ass. 
 * 
 * [TypeName] must be a unique name (across all serializable types) to identify the type when deserializing.
 * The [Serialize] function must convert the value into something JSON serializable.
 * The [Deserialize] function must convert the value into the original type. This should be as fast as possible, 
 *   and not make any unnecessary assertions. It *must* assume the data is unknown/potentially malicious, and not
 *   do any unchecked type casts. Almost all types here are then parsed using Zod, so any type-level assertions
 *   should be handled there.
 */

export interface Serializable<T> {
	readonly [TypeName]: string;
	[Serialize](val: T): unknown; 
	[Deserialize](this: undefined, val: unknown): Result<T, string>;
}

const isSerializable = <T>(v: unknown): v is Serializable<T> =>
	!!(v && (typeof v === "object" || typeof v === "function") && 
	TypeName in v && typeof v[TypeName] === "string" &&
	Serialize in v && typeof v[Serialize] === "function" &&
	Deserialize in v && typeof v[Deserialize] === "function")

/** Gets the serializable interface for a class or class instance. */
export const getSerializable = <T>(v: T): Result<Serializable<T>, string> =>
	Result.ok(v as Record<any, any>).filter(isSerializable<T>)
		.else(Result.ok((v as Record<any, any>).constructor as Record<any, any>).filter(isSerializable<T>))