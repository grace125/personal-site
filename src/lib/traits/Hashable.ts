export type HashFunction<K> = (key: K) => unknown;
export const Hash = Symbol.for("Hashable::Hash");

export interface Hashable { [Hash](self: this): unknown; }