export type ContainerFnArgs<K, V, C> = [value: V, key: K, container: C];
export type ContainerFn<A extends ContainerFnArgs<any, any, any>, R = unknown> = (...a: A) => R;