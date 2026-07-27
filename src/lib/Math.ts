import { pipe } from "./Functional";

export const EPS = 0.0001;

export const roundTo = (num: number, decimals: number) => Math.round(num * (10 ** decimals)) / (10 ** decimals);

export const floorTo = (num: number, decimals: number) => Math.floor(num * (10 ** decimals)) / (10 ** decimals);

export const ceilTo = (num: number, decimals: number) => Math.ceil(num * (10 ** decimals)) / (10 ** decimals);

/** Rounds to the value furthest from zero. Opposite of `trunc`. */
export const expand = (num: number) => num < 0 ? Math.floor(num) : Math.ceil(num);

/** Returns `num` clamped to `min` and `max`. Does properly handle if `min` and `max` are passed in the wrong order. */
export const clamp = (num: number, a: number, b: number) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

export const lerp = (a: number, b: number, frac: number) => a * (1 - frac) + b * frac; 

export const cantor = (x: number, y: number) => ((x + y) * (x + y + 1)) / 2 + y;
 
export const cantorInverse = (z: number) => 
	pipe(Math.floor((-1 + Math.sqrt(1 + 8 * z)) / 2), t => [ t * (t + 3) / 2 - z, z - t * (t + 1) / 2 ])

export const map = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

export const mapClamp = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  clamp((val - inMin) / (inMax - inMin), 0, 1) * (outMax - outMin) + outMin;

export const mod = (n: number, d: number) => {
    return ((n % d) + d) % d
}