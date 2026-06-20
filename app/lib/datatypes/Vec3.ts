import { z } from "zod";
import { clamp, lerp } from "../Math";
import { Deserialize, Serialize, TypeName } from "../traits/SerializableSymbols";
import { Result } from "./Result";
import { Vec2 } from "./Vec2";

export class Vec3 {
	private _vec3: [ number, number, number ] = [ 0, 0, 0 ];

	/** Creates a new zero vector. */
	constructor();
	/** Constructs a vector with all components set to `v`. */
	constructor(v: number);
	/** Creates a 3D vector with the X, and Y values specified. Z is initialized to 0. */
	constructor(x: number, y: number);
	/** Creates a 3D vector with the X, Y, and Z values specified. */
	constructor(x: number, y: number, z: number);
	/** Creates a 3D vector from a tuple. */
	constructor(arr: [ number, number ] | [ number, number, number ]);
	/** Creates a 3D vector from another vector's values. */
	constructor(vec: Vec3);
	constructor(a?: any, b?: any, c?: any) { 
		this.set(a, b, c); 
	}

	/** Creates a new zero vector. */
	static new(): Vec3;
	/** Constructs a vector with all components set to `v`. */
	static new(v: number): Vec3;
	/** Creates a 3D vector with the X and Y values specified. Z is initialized to 0. */
	static new(x: number, y: number): Vec3;
	/** Creates a 3D vector with the X, Y, and Z values specified. */
	static new(x: number, y: number, z: number): Vec3;
	/** Creates a 3D vector from a tuple. */
	static new(arr: [ number, number ] | [ number, number, number ]): Vec3;
	/** Creates a 3D vector from another vector's values. */
	static new(vec: Vec3): Vec3;
	static new(a?: any, b?: any, c?: any) { return new Vec3(a, b, c); }

	static isVec3(val: unknown): val is Vec3 { 
		return !!(typeof val === "object" && val && "_vec3" in val);
	}

	static zero() { return new Vec3() }

	get x() { return this._vec3[0]; }
	set x(val: number) { this._vec3[0] = val; }

	get y() { return this._vec3[1]; }
	set y(val: number) { this._vec3[1] = val; }

	get z() { return this._vec3[2]; }
	set z(val: number) { this._vec3[2] = val; }

	get xy() { return Vec2.new(this.x, this.y) }

	/** Creates a new Vector which is a copy of `this`. */
	clone() { return new Vec3(this); }
	/** Sets `into`'s values to `this`'s values. Returns `this`. */
	copy(o: Vec3) { o.set(this); return this; }

	/** No-op. */
	set(): this;
	/** Sets all components of this vector to `v`. */
	set(v: number): this;
	/** Sets the components of this vector to the X and Y values specified. Z is set to 0. */
	set(x: number, y: number): this;
	/** Sets the components of this vector to the X, Y, and Z values specified. */
	set(x: number, y: number, z: number): this;
	/** Sets the components of this vector to the tuple specified. */
	set(arr: [ number, number ] | [ number, number, number ]): this;
	/** Sets the components of this vector to the vector specified. */
	set(vec: Vec3): this;
	set(
		a?: number | [ number, number ] | [ number, number, number ] | Vec3, 
		b = typeof a === "number" ? a : 0, 
		c = b) {		
		if (typeof a === "number") this._vec3 = [ a, b, c ]
		else if (Array.isArray(a)) this._vec3 = [ a[0], a[1], a[2] ?? 0 ]
		else if (a instanceof Vec3) this._vec3 = a._vec3; 
		return this;
	}

	/** Returns a new vector which is the result of adding `v` to all components of this vector. */
	add(v: number): this;
	/** Returns a new vector which is the result of adding `vec` to this vector. */
	add(vec: Vec3): this;
	/** Returns a new vector which is the result of adding `x`, `y`, and `z` to this vector. */
	add(x: number, y: number, z: number): this;
	add(x: number | Vec3, y = typeof x === "number" ? x : 0, z = typeof x === "number" ? x : 0) {
		return (x instanceof Vec3) 
			? new Vec3(this._vec3[0] + x._vec3[0], this._vec3[1] + x._vec3[1], this._vec3[2] + x._vec3[2])
			: new Vec3(this._vec3[0] + x, this._vec3[1] + y, this._vec3[2] + z)
	}
	
	/** Returns a new vector which is the result of subtracting `v` from all components of this vector. */
	sub(v: number): this;
	/** Returns a new vector which is the result of subtracting `vec` from this vector. */
	sub(vec: Vec3): this;
	/** Returns a new vector which is the result of subtracting `x`, `y`, and `z` from this vector. */
	sub(x: number, y: number, z: number): this;
	sub(x: number | Vec3, y = typeof x === "number" ? x : 0, z = typeof x === "number" ? x : 0) {
		return (x instanceof Vec3) 
			? new Vec3(this._vec3[0] - x._vec3[0], this._vec3[1] - x._vec3[1], this._vec3[2] - x._vec3[2])
			: new Vec3(this._vec3[0] - x, this._vec3[1] - y, this._vec3[2] - z)
	}

	/** Returns a new vector which is the result of multiplying `v` with both components of this vector. */
	mul(v: number): this;
	/** Returns a new vector which is the result of multiplying `vec` with this vector. */
	mul(vec: Vec3): this;
	/** Returns a new vector which is the result of multiplying `x` & `y` with this vector. */
	mul(x: number, y: number, z: number): this;
	mul(x: number | Vec3, y = typeof x === "number" ? x : 0, z = typeof x === "number" ? x : 0) {
		return (x instanceof Vec3) 
			? new Vec3(this._vec3[0] * x._vec3[0], this._vec3[1] * x._vec3[1], this._vec3[2] * x._vec3[2])
			: new Vec3(this._vec3[0] * x, this._vec3[1] * y, this._vec3[2] * z)
	}

	/** Returns a new vector which is the result of dividing `v` with all components of this vector. */
	div(v: number): this;
	/** Returns a new vector which is the result of dividing `vec` with this vector. */
	div(vec: Vec3): this;
	/** Returns a new vector which is the result of dividing `x`, `y`, and `z` with this vector. */
	div(x: number, y: number): this;
	div(x: number | Vec3, y = typeof x === "number" ? x : 0, z = typeof x === "number" ? x : 0) {
		return (x instanceof Vec3) 
			? new Vec3(this._vec3[0] / x._vec3[0], this._vec3[1] / x._vec3[1], this._vec3[2] / x._vec3[2])
			: new Vec3(this._vec3[0] / x, this._vec3[1] / y, this._vec3[2] / z)
	}

	/** Mutably adds `v` to all components of this vector. */
	addMut(v: number): this;
	/** Mutably adds `vec` to this vector. */
	addMut(vec: Vec3): this;
	/** Mutably adds `x`, `y`, and `z` to this vector. */
	addMut(x: number, y: number, z: number): this;
	addMut(x: number | Vec3, y = typeof x === "number" ? x : 0, z = y) {
		if (x instanceof Vec3)
			this._vec3 = [ this._vec3[0] + x._vec3[0], this._vec3[1] + x._vec3[1], this._vec3[2] + x._vec3[2] ]
		else this._vec3 = [ this._vec3[0] + x, this._vec3[1] + y, this._vec3[2] + z ]
		return this;
	}
	
	/** Mutably subtracts `v` from all components of this vector. */
	subMut(v: number): this;
	/** Mutably subtracts `vec` from this vector. */
	subMut(vec: Vec3): this;
	/** Mutably subtracts `x`, `y`, and `z` from this vector. */
	subMut(x: number, y: number, z: number): this;
	subMut(x: number | Vec3, y = typeof x === "number" ? x : 0, z = y) {
		if (x instanceof Vec3)
			this._vec3 = [ this._vec3[0] - x._vec3[0], this._vec3[1] - x._vec3[1], this._vec3[2] - x._vec3[2] ]
		else this._vec3 = [ this._vec3[0] - x, this._vec3[1] - y, this._vec3[2] - z ]
		return this;
	}
	
	/** Mutably multiplies `v` with all components of this vector. */
	mulMut(v: number): this;
	/** Mutably multiplies `vec` with this vector. */
	mulMut(vec: Vec3): this;
	/** Mutably multiplies `x`, `y`, and `z` with this vector. */
	mulMut(x: number, y: number, z: number): this;
	mulMut(x: number | Vec3, y = typeof x === "number" ? x : 0, z = y) {
		if (x instanceof Vec3)
			this._vec3 = [ this._vec3[0] * x._vec3[0], this._vec3[1] * x._vec3[1], this._vec3[2] * x._vec3[2] ]
		else this._vec3 = [ this._vec3[0] * x, this._vec3[1] * y, this._vec3[2] * z ]
		return this;
	}
	
	/** Mutably divides `v` with all components of this vector. */
	divMut(v: number): this;
	/** Mutably divides `vec` with this vector. */
	divMut(vec: Vec3): this;
	/** Mutably divides `x`, `y`, and `z` with this vector. */
	divMut(x: number, y: number, z: number): this;
	divMut(x: number | Vec3, y = typeof x === "number" ? x : 0, z = y) {
		if (x instanceof Vec3)
			this._vec3 = [ this._vec3[0] / x._vec3[0], this._vec3[1] / x._vec3[1], this._vec3[2] / x._vec3[2] ]
		else this._vec3 = [ this._vec3[0] / x, this._vec3[1] / y, this._vec3[2] / z ]
		return this;
	}
	
	/** Returns the dot product of this vector with `o`. */
	dot(o: Vec3) { return this._vec3[0] * o._vec3[0] + this._vec3[1] * o._vec3[1] + this._vec3[2] * o._vec3[2]; }

	/** Returns the cross product of this vector with `o`. */
	cross(o: Vec3) {
		return new Vec3(
			this._vec3[1] * o._vec3[2] - this._vec3[2] * o._vec3[1],
			this._vec3[2] * o._vec3[0] - this._vec3[0] * o._vec3[2],
			this._vec3[0] * o._vec3[1] - this._vec3[1] * o._vec3[0],
		)
	}
	
	/** Returns a new vector with all components ceiled. */
	ceil() { return new Vec3(Math.ceil(this._vec3[0]), Math.ceil(this._vec3[1]), Math.ceil(this._vec3[2])); }
	/** Returns a new vector with all components floored. */
	floor() { return new Vec3(Math.floor(this._vec3[0]), Math.floor(this._vec3[1]), Math.floor(this._vec3[2])); };
	/** Returns a new vector with all components rounded. */
	round() { return new Vec3(Math.round(this._vec3[0]), Math.round(this._vec3[1]), Math.round(this._vec3[2])); }
	/** Returns a new vector with all components' decimal values truncated. */
	trunc() { return new Vec3(Math.trunc(this._vec3[0]), Math.trunc(this._vec3[1]), Math.trunc(this._vec3[2])); };

	/** Mutably ceils this vector's components. */
	ceilMut() {
		this._vec3 = [ Math.ceil(this._vec3[0]), Math.ceil(this._vec3[1]), Math.ceil(this._vec3[2]) ];
		return this;
	}
	/** Mutably floors this vector's components. */
	floorMut() {
		this._vec3 = [ Math.floor(this._vec3[0]), Math.floor(this._vec3[1]), Math.floor(this._vec3[2]) ];
		return this;
	}
	/** Mutably rounds this vector's components. */
	roundMut() {
		this._vec3 = [ Math.round(this._vec3[0]), Math.round(this._vec3[1]), Math.round(this._vec3[2]) ];
		return this;
	}
	/** Mutably truncates all component's decimal values. */
	truncMut() {
		this._vec3 = [ Math.trunc(this._vec3[0]), Math.trunc(this._vec3[1]), Math.trunc(this._vec3[2]) ];
		return this;
	}

	/** Clamps the minimum values of each component to `other`'s. */
	min(other: Vec3) {
		return new Vec3(
			Math.min(this._vec3[0], other._vec3[0]),
			Math.min(this._vec3[1], other._vec3[1]),
			Math.min(this._vec3[2], other._vec3[2]),
		);
	}
	/** Clamps the maximum values of each component to `other`'s. */
	max(other: Vec3) {
		return new Vec3(
			Math.max(this._vec3[0], other._vec3[0]),
			Math.max(this._vec3[1], other._vec3[1]),
			Math.max(this._vec3[2], other._vec3[2]),
		);
	}
	/** Returns a clamped vector between the range of `min` & `max`. */
	clamp(min: Vec3, max: Vec3) {
		return new Vec3( 
			clamp(this._vec3[0], min._vec3[0], max._vec3[0]), 
			clamp(this._vec3[1], min._vec3[1], max._vec3[1]), 
			clamp(this._vec3[2], min._vec3[2], max._vec3[2]), 
		);
	}
	/** Returns a vector which is linearly interpolated between `this` and `o` by `factor`. */
	lerp(o: Vec3, factor: number) {
		return new Vec3( 
			lerp(this._vec3[0], o._vec3[0], factor),
			lerp(this._vec3[1], o._vec3[1], factor),
			lerp(this._vec3[2], o._vec3[2], factor),
		)
	}


	/** Mutably sets this vector's components to be the min between them and `other`'s. */
	minMut(v: Vec3) {
		this._vec3 = [
			Math.min(this._vec3[0], v._vec3[0]),
			Math.min(this._vec3[1], v._vec3[1]),
			Math.min(this._vec3[2], v._vec3[2]),
		]
		return this;
	}
	/** Mutably sets this vector's components to be the max between them and `other`'s. */
	maxMut(v: Vec3) {
		this._vec3 = [
			Math.max(this._vec3[0], v._vec3[0]),
			Math.max(this._vec3[1], v._vec3[1]),
			Math.max(this._vec3[2], v._vec3[2]),
		]
		return this;
	}
	/** Mutably clamps this vector to within the range between `min` and `max`. */
	clampMut(min: Vec3, max: Vec3) {
		this._vec3 = [ 
			clamp(this._vec3[0], min._vec3[0], max._vec3[0]), 
			clamp(this._vec3[1], min._vec3[1], max._vec3[1]), 
			clamp(this._vec3[2], min._vec3[2], max._vec3[2])
		];
		return this;
	}
	/** Mutates this vector to be linearly interpolated between its values & `o`'s by `factor`. */
	lerpMut(o: Vec3, percent: number) {
		this._vec3 = [ 
			lerp(this._vec3[0], o._vec3[0], percent),
			lerp(this._vec3[1], o._vec3[1], percent),
			lerp(this._vec3[2], o._vec3[2], percent),
		]
		return this;
	}


	/** Returns the squared length of this vector. */
	lengthSq() { return this._vec3[0] ** 2 + this._vec3[1] ** 2 + this._vec3[2] ** 2; }
	/** Returns the length of this vector. */
	length() { return Math.sqrt(this.lengthSq()); }
	/** Returns the length of this vector. */
	len() { return this.length(); }

	/** Returns a new negated vector. */
	neg() { return new Vec3(-this._vec3[0], -this._vec3[1], -this._vec3[2]); }
	/** Mutably negates this vector. */
	negMut() {
		this._vec3 = [ -this._vec3[0], -this._vec3[1], -this._vec3[2] ];
		return this;
	}

	/** Returns a normalized version of this vector. */
	normalize() {
		const len = this.len();
		return new Vec3(this._vec3[0] / len, this._vec3[1] / len, this._vec3[2] / len);
	}
	/** Mutably normalizes this vector and returns it. */
	normalizeMut() {
		const len = this.len();
		this._vec3 = [ this._vec3[0] / len, this._vec3[1] / len, this._vec3[2] / len ];
		return this;
	}

	/** Returns the angle from this vector to `vec`. */
	angleTo(vec: Vec3) {
		const denominator = Math.sqrt(this.lengthSq() * vec.lengthSq());
		if (denominator === 0) return Math.PI / 2;
		const theta = this.dot(vec) / denominator;
		return Math.acos(clamp(theta, -1, 1));
	}

	/** Returns a mutable reference to the underlying data of this vector. */
	data() { return this._vec3; }
	/** Returns a new array representing this vector's data. */
	toArray() { return [ ...this._vec3 ] as [ number, number, number ]; }

	pipe<O>(v: (self: this) => O) { return v(this); }
	$<O>(v: (self: this) => O) { return v(this); }

	static [TypeName] = "Vec3";
	static [Serialize] = (v: Vec3) => v._vec3;
	static [Deserialize] = (v: unknown) => 
		Result.ok(v)
		.filter(v => Array.isArray(v))
		.filter(v => v.length === 3 && typeof v[0] === "number" && typeof v[1] === "number" && typeof v[2] === "number")
		.map(v => Vec3.new(v[0]!, v[1]!, v[2]!))
}

export const vec3Schema = 
	z.object({ "_vec3": z.tuple([ z.number(), z.number(), z.number() ]) }).or(z.instanceof(Vec3))
	.transform((res): Vec3 => new Vec3((res as any)._vec3));