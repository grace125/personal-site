import { RefinementCtx, z, ZodError, ZodType } from "zod";
import { HashMap, hashMapSchema as hashMap } from "./datatypes/HashMap";
import { hashSetSchema as hashSet } from "./datatypes/HashSet";
import { idSchema as id } from "./datatypes/Id";
import { List, listSchema as list } from "./datatypes/List";
import { Opt, optionSchema as option } from "./datatypes/Option";
import { Result, resultSchema as result } from "./datatypes/Result";
import { Vec2, vec2Schema as vec2 } from "./datatypes/Vec2";
import { vec3Schema as vec3 } from "./datatypes/Vec3";

const parse = <S extends ZodType>(s: S, data: unknown): Result<z.infer<typeof s>, ZodError> => {
	const res = s.safeParse(data);
	return res.success ? Result.ok(res.data) : Result.err(res.error as any as ZodError<unknown>);
}

const parseAsync = async <S extends ZodType>(s: S, data: unknown): Promise<Result<z.infer<typeof s>, ZodError>> => {
	const res = await s.safeParseAsync(data);
	return res.success ? Result.ok(res.data) : Result.err(res.error as any as ZodError<unknown>);
}

const transform = <S extends ZodType>(s: S, data: z.input<typeof s>) => parse(s, data);
const transformAsync = async <S extends ZodType>(s: S, data: z.input<typeof s>) => parseAsync(s, data);

const narrow = <X, Y extends X>(refiner: ((x: X) => x is Y)) => (x: X, ctx: z.core.$RefinementCtx<X>): Y => {
  if (refiner(x)) return x;
  ctx.issues.push({ code: 'custom', message: `Could not type narrow.`, input: x });
  return z.NEVER;
};

const schema = <S extends ZodType>(schema: S) => (s: unknown, ctx: RefinementCtx<unknown>): z.output<S> => {
	try {
		return schema.parse(s);
	}
	catch (e) {
		if (e instanceof ZodError) {
			ctx.addIssue({
				code: "custom",
				continue: false,
				message: e.message
			});
		}
		else {
			ctx.addIssue({
				code: "custom",
				continue: false,
				message: "Unknown error in schemaTransform: " + e
			});
		}
		return z.NEVER;
	}
}

// Creates a type-safe Zod Enum out of the key types of a discriminated union.
const discriminatedUnionKeyType = <V extends z.ZodDiscriminatedUnion>(v: V): 
	(V extends z.ZodDiscriminatedUnion<any, infer D> ? z.ZodEnum<{ [K in (z.infer<typeof v>[D])]: K }> : never) =>
	z.enum(v._zod.def.options.flatMap(o => [...(o as any).shape[v._zod.def.discriminator].values])) as any;

const listLike = <S extends ZodType>(s: S) =>
	list(s).or(z.array(s)).transform(List.from);
const vec2Like = () =>
	z.tuple([ z.number(), z.number() ]).or(vec2).transform(Vec2.new)
const optLike = <S extends ZodType>(s: S) =>
	Z.option(s).or(s.optional()).transform<Opt<z.infer<S>>>(
		s => (Opt.isOption(s) ? s : Opt.undefined(s)) as any)
const hashMapLike = <K extends ZodType<string, string>, V extends ZodType>(k: K, v: V) =>
	Z.hashMap(k, v).or(z.partialRecord(k, v).transform<HashMap<z.infer<K>, z.infer<V>>>(
		val => HashMap.fromRecord(val as Record<z.infer<K>, z.infer<V>>)));

export const Z = {
	option,
	result,
	list,
	id,
	hashMap,
	hashSet,
	/** Transforms a serialized Vec3 into a Vec2 instance. */
	vec2: (): typeof vec2 => vec2,
	/** Transforms a serialized Vec3 into a Vec3 instance. */
	vec3: (): typeof vec3 => vec3,
	/** Parses a Zod Schema and a value and returns a Result type containing the value. */
	
	listLike,
	vec2Like,
	optLike,
	hashMapLike,
	
	discriminatedUnionKeyType,

	parse,
	/** Parses an async Zod Schema and a value and returns a Result type containing the value. */
	parseAsync,
	/** Same as `Z.parse`, but statically ensures that the type passed in is the input type of the schema. */
	transform,
	/** Same as `Z.parseAsync`, but statically ensures that the type passed in is the input type of the schema. */
	transformAsync,

	/** Type narrows in a `.transform`. Provide a type predicate. */
	narrow,
	/** Transforms into another schema in a `.transform`. */
	schema,
} as const

export { z } from "zod";