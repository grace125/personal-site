import { z } from "zod";
import { clamp, lerp } from "../Math";
import { Pipeable } from "../traits/Pipeable";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { Result } from "./Result";

export class Vec2 implements Pipeable<Vec2> {
	private _vec2: [ number, number ] = [ 0, 0 ];

	/** Creates a new zero vector. */
	constructor();
	/** Constructs a vector with both components set to `v`. */
	constructor(v: number);
	/** Creates a 2D vector with the X and Y values specified. */
	constructor(x: number, y: number);
	/** Creates a 2D vector from a tuple. */
	constructor(arr: [ number, number ]);
	/** Creates a 2D vector from another vector's values. */
	constructor(vec: Vec2);
	constructor(a?: any, b?: any) { this.set(a, b); }

	/** Creates a new zero vector. */
	static new(): Vec2;
	/** Constructs a vector with both components set to `v`. */
	static new(v: number): Vec2;
	/** Creates a 2D vector with the X and Y values specified. */
	static new(x: number, y: number): Vec2;
	/** Creates a 2D vector from a tuple. */
	static new(arr: readonly [ number, number ]): Vec2;
	/** Creates a 2D vector from another vector's values. */
	static new(vec: Vec2): Vec2;
	static new(a?: any, b?: any) { return new Vec2(a, b); }

	static isVec2(val: unknown): val is Vec2 { 
		return !!(typeof val === "object" && val && "_vec2" in val);
	}

	static fromAngle(angleRad: number) {
		return new Vec2(Math.cos(angleRad), Math.sin(angleRad));
	}

	static zero() { return new Vec2(0, 0) }
	static up() { return new Vec2(0, -1) }
	static down() { return new Vec2(0, 1) }
	static left() { return new Vec2(-1, 0) }
	static right() { return new Vec2(1, 0) }

	get x() { return this._vec2[0]; }
	set x(val: number) { this._vec2[0] = val; }
	get 0() { return this._vec2[0] }
	set 0(val: number) { this._vec2[0] = val; }
	
	get y() { return this._vec2[1]; }
	set y(val: number) { this._vec2[1] = val; }
	get 1() { return this._vec2[1] }
	set 1(val: number) { this._vec2[1] = val; }

	equals(o: Vec2) { return o.x === this.x && o.y === this.y; }

	/** Creates a new Vector which is a copy of `this`. */
	clone() { return new Vec2(this); }
	/** Sets `into`'s values to `this`'s values. Returns `this`. */
	copy(into: Vec2) { into.set(this); return this; }

	/** No-op. */
	set(): this;
	/** Sets both components of this vector to `v`. */
	set(v: number): this;
	/** Sets the components of this vector to the X & Y specified. */
	set(x: number, y: number): this;
	/** Sets the components of this vector to the tuple specified. */
	set(arr: [ number, number ]): this;
	/** Sets the components of this vector to the vector specified. */
	set(vec: Vec2): this;
	set(
		a?: number | [ number, number ] | Vec2, 
		b = typeof a === "number" ? a : 0) {
		if (typeof a === "number") this._vec2 = [ a, b ]
		else if (Array.isArray(a)) this._vec2 = [ a[0], a[1] ]
		else if (a instanceof Vec2) this._vec2 = a._vec2; 
		return this;
	}
	
	/** Returns a new vector which is the result of adding `v` to both components of this vector. */
	add(v: number): this;
	/** Returns a new vector which is the result of adding `vec` to this vector. */
	add(vec: Vec2): this;
	/** Returns a new vector which is the result of adding `x` & `y` to this vector. */
	add(x: number, y: number): this;
	add(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		return (x instanceof Vec2) 
			? new Vec2(this._vec2[0] + x._vec2[0], this._vec2[1] + x._vec2[1])
			: new Vec2(this._vec2[0] + x, this._vec2[1] + y)
	}
	
	/** Returns a new vector which is the result of subtracting `v` from both components of this vector. */
	sub(v: number): this;
	/** Returns a new vector which is the result of subtracting `vec` from this vector. */
	sub(vec: Vec2): this;
	/** Returns a new vector which is the result of subtracting `x` & `y` from this vector. */
	sub(x: number, y: number): this;
	sub(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		return (x instanceof Vec2) 
			? new Vec2(this._vec2[0] - x._vec2[0], this._vec2[1] - x._vec2[1])
			: new Vec2(this._vec2[0] - x, this._vec2[1] - y)
	}

	/** Returns a new vector which is the result of multiplying `v` with both components of this vector. */
	mul(v: number): this;
	/** Returns a new vector which is the result of multiplying `vec` with this vector. */
	mul(vec: Vec2): this;
	/** Returns a new vector which is the result of multiplying `x` & `y` with this vector. */
	mul(x: number, y: number): this;
	mul(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		return (x instanceof Vec2) 
			? new Vec2(this._vec2[0] * x._vec2[0], this._vec2[1] * x._vec2[1])
			: new Vec2(this._vec2[0] * x, this._vec2[1] * y)
	}

	/** Returns a new vector which is the result of dividing `v` with both components of this vector. */
	div(v: number): this;
	/** Returns a new vector which is the result of dividing `vec` with this vector. */
	div(vec: Vec2): this;
	/** Returns a new vector which is the result of dividing `x` & `y` with this vector. */
	div(x: number, y: number): this;
	div(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		return (x instanceof Vec2) 
			? new Vec2(this._vec2[0] / x._vec2[0], this._vec2[1] / x._vec2[1])
			: new Vec2(this._vec2[0] / x, this._vec2[1] / y)
	}
	

	/** Mutably adds `v` to both components of this vector. */
	addMut(v: number): this;
	/** Mutably adds `vec` to this vector. */
	addMut(vec: Vec2): this;
	/** Mutably adds `vec` to this vector. */
	addMut(vec: readonly [ x: number, y: number ]): this;
	/** Mutably adds `x` & `y` to this vector. */
	addMut(x: number, y: number): this;
	addMut(x: number | Vec2 | readonly [ x: number, y: number ], y = typeof x === "number" ? x : 0) {
		if (x instanceof Vec2) this._vec2 = [ this._vec2[0] + x._vec2[0], this._vec2[1] + x._vec2[1] ];
		else if (Array.isArray(x)) this._vec2 = [ this._vec2[0] + x[0], this._vec2[1] + x[1] ];
		else this._vec2 = [ this._vec2[0] + (x as number), this._vec2[1] + (y as number) ];
		return this;
	}
	
	/** Mutably subtracts `v` from both components of this vector. */
	subMut(v: number): this;
	/** Mutably subtracts `vec` from this vector. */
	subMut(vec: Vec2): this;
	/** Mutably subtracts `x` & `y` from this vector. */
	subMut(x: number, y: number): this;
	subMut(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		if (x instanceof Vec2) this._vec2 = [ this._vec2[0] - x._vec2[0], this._vec2[1] - x._vec2[1] ]
		else this._vec2 = [ this._vec2[0] - x, this._vec2[1] - y ]
		return this;
	}
	
	/** Mutably multiplies `v` with both components of this vector. */
	mulMut(v: number): this;
	/** Mutably multiplies `vec` with this vector. */
	mulMut(vec: Vec2): this;
	/** Mutably multiplies `x` & `y` with this vector. */
	mulMut(x: number, y: number): this;
	mulMut(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		if (x instanceof Vec2) this._vec2 = [ this._vec2[0] * x._vec2[0], this._vec2[1] * x._vec2[1] ]
		else this._vec2 = [ this._vec2[0] * x, this._vec2[1] * y ]
		return this;
	}
	
	/** Mutably divides `v` with both components of this vector. */
	divMut(v: number): this;
	/** Mutably divides `vec` with this vector. */
	divMut(vec: Vec2): this;
	/** Mutably divides `x` & `y` with this vector. */
	divMut(x: number, y: number): this;
	divMut(x: number | Vec2, y = typeof x === "number" ? x : 0) {
		if (x instanceof Vec2) this._vec2 = [ this._vec2[0] / x._vec2[0], this._vec2[1] / x._vec2[1] ]
		else this._vec2 = [ this._vec2[0] / x, this._vec2[1] / y ]
		return this;
	}
	
	/** Returns the dot product of this vector with `o`. */
	dot(o: Vec2) { return this._vec2[0] * o._vec2[0] + this._vec2[1] * o._vec2[1]; }
	
	/** Returns the cross product of this vector with `o`. */
	cross(o: Vec2) { return this._vec2[0] * o._vec2[1] - this._vec2[1] * o._vec2[0]; }
	
	/** Returns a new vector with all components ceiled. */
	ceil() { return new Vec2(Math.ceil(this._vec2[0]), Math.ceil(this._vec2[1])); }
	/** Returns a new vector with all components floored. */
	floor() { return new Vec2(Math.floor(this._vec2[0]), Math.floor(this._vec2[1])); };
	/** Returns a new vector with all components rounded. */
	round() { return new Vec2(Math.round(this._vec2[0]), Math.round(this._vec2[1])); }
	/** Returns a new vector with all components' decimal values truncated. */
	trunc() { return new Vec2(Math.trunc(this._vec2[0]), Math.trunc(this._vec2[1])); };

	/** Mutably ceils this vector's components. */
	ceilMut() { this._vec2 = [ Math.ceil(this._vec2[0]), Math.ceil(this._vec2[1]) ]; return this; }
	/** Mutably floors this vector's components. */
	floorMut() { this._vec2 = [ Math.floor(this._vec2[0]), Math.floor(this._vec2[1]) ]; return this; }
	/** Mutably rounds this vector's components. */
	roundMut() { this._vec2 = [ Math.round(this._vec2[0]), Math.round(this._vec2[1]) ]; return this; }
	/** Mutably truncates both component's decimal values. */
	truncMut() { this._vec2 = [ Math.trunc(this._vec2[0]), Math.trunc(this._vec2[1]) ]; return this; }

	/** Clamps the minimum values of each component to `other`'s. */
	min(other: Vec2) {
		return new Vec2(
			Math.min(this._vec2[0], other._vec2[0]),
			Math.min(this._vec2[1], other._vec2[1]),
		);
	}
	/** Clamps the maximum values of each component to `other`'s. */
	max(other: Vec2) {
		return new Vec2(
			Math.max(this._vec2[0], other._vec2[0]),
			Math.max(this._vec2[1], other._vec2[1]),
		);
	}
	/** Returns a clamped vector between the range of `min` & `max`. */
	clamp(min: Vec2, max: Vec2) {
		return new Vec2( 
			clamp(this._vec2[0], min._vec2[0], max._vec2[0]), 
			clamp(this._vec2[1], min._vec2[1], max._vec2[1]), 
		);
	}
	/** Returns a vector which is linearly interpolated between `this` and `o` by `factor`. */
	lerp(o: Vec2, factor: number) {
		return new Vec2( 
			lerp(this._vec2[0], o._vec2[0], factor),
			lerp(this._vec2[1], o._vec2[1], factor),
		)
	}

	/** Mutably sets this vector's components to be the min between them and `other`'s. */
	minMut(other: Vec2) {
		this._vec2 = [
			Math.min(this._vec2[0], other._vec2[0]),
			Math.min(this._vec2[1], other._vec2[1]),
		]
		return this;
	}
	/** Mutably sets this vector's components to be the max between them and `other`'s. */
	maxMut(other: Vec2) {
		this._vec2 = [
			Math.max(this._vec2[0], other._vec2[0]),
			Math.max(this._vec2[1], other._vec2[1]),
		]
		return this;
	}
	/** Mutably clamps this vector to within the range between `min` and `max`. */
	clampMut(min: Vec2, max: Vec2) {
		this._vec2 = [ 
			clamp(this._vec2[0], min._vec2[0], max._vec2[0]), 
			clamp(this._vec2[1], min._vec2[1], max._vec2[1]), 
		];
		return this;
	}
	/** Mutates this vector to be linearly interpolated between its values & `o`'s by `factor`. */
	lerpMut(o: Vec2, factor: number) {
		this._vec2 = [ 
			lerp(this._vec2[0], o._vec2[0], factor),
			lerp(this._vec2[1], o._vec2[1], factor),
		]
		return this;
	}

	/** Returns the squared length of this vector. */
	lengthSq() { return this._vec2[0] ** 2 + this._vec2[1] ** 2; }
	/** Returns the length of this vector. */
	length() { return Math.sqrt(this.lengthSq()); }
	/** Returns the length of this vector. */
	len() { return this.length(); }

	taxicab(o: Vec2) { return Math.abs(this.x - o.x) + Math.abs(this.y - o.y); }

	/** Returns a new negated vector. */
	neg() { return new Vec2(-this._vec2[0], -this._vec2[1]); }
	/** Mutably negates this vector. */
	negMut() {
		this._vec2 = [ -this._vec2[0], -this._vec2[1] ];
		return this;
	}

	/** Returns a normalized version eof this vector. */
	normalize() {
		const len = this.len();
		return new Vec2(this._vec2[0] / len, this._vec2[1] / len);
	}
	/** Mutably normalizes this vector and returns it. */
	normalizeMut() {
		const len = this.len();
		this._vec2 = [ this._vec2[0] / len, this._vec2[1] / len ];
		return this;
	}

	/** Returns the angle from X+ to this vector in radians. */
	angle() {
		return Math.atan2(-this.y, -this.x) + Math.PI;
	}
	rotate(angleRad: number) { 
		const cos = Math.cos(angleRad);
		const sin = Math.sin(angleRad);
		return new Vec2(
			this.x * cos - this.y * sin,
			this.x * sin + this.y * cos
		);
	}

	/** Returns the angle from this vector to `vec`. */
	angleTo(vec: Vec2) {
		const denominator = Math.sqrt(this.lengthSq() * vec.lengthSq());
		if (denominator === 0) return Math.PI / 2;
		const theta = this.dot(vec) / denominator;
		return Math.acos(clamp(theta, -1, 1));
	}

	map(mapper: (v: number, k: 0 | 1, vec: Vec2) => number) {
		return Vec2.new(...this._vec2.map((v, k) => mapper(v, k as any, this)) as [ number, number ]);
	}

	/** Returns a mutable reference to the underlying data of this vector. */
	data() { return this._vec2; }
	/** Returns a new array representing this vector's data. */
	toArray() { return [ ...this._vec2 ] as [ number, number ]; }
	
	pipe<O>(v: (self: this) => O) { return v(this); }
	$<O>(v: (self: this) => O) { return v(this); }

	static [TypeName] = "Vec2";
	static [Serialize] = (v: Vec2) => v._vec2;
	static [Deserialize] = (v: unknown) => 
		Result.ok(v)
		.filter(v => Array.isArray(v))
		.filter(v => v.length === 2 && typeof v[0] === "number" && typeof v[1] === "number")
		.map(v => Vec2.new(v[0]!, v[1]!))
}

export const vec2Schema = 
	z.object({ "_vec2": z.tuple([ z.number(), z.number() ]) }).or(z.instanceof(Vec2))
	.transform((res): Vec2 => new Vec2((res as any)._vec2));