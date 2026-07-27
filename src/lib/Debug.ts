
/** @deprecated */
export const dbg = <T>(t: T, ...rest: any[]) => {
    console.log(t, ...rest)
    return t
}