/**
 * Drop the first item from an array/tuple and keep the rest
 */
export type DropFirst<T extends any[]> = T extends [any, ...infer Rest]
    ? Rest
    : []

/**
 * Drop first N items from an array/tuple and keep the rest
 */
export type DropFirstN<
    T extends any[],
    N extends number,
    TDropped extends any[] = [],
> = TDropped['length'] extends N
    ? T
    : T extends [infer First, ...infer TWithoutFirst]
        ? DropFirstN<TWithoutFirst, N, [...TDropped, First]>
        : T
/**
 * Drop the last item from an array/tuple and keep the rest
 */
export type DropLast<T extends any[]> = T extends [...infer Rest, any]
    ? Rest
    : []

/**
 * Keep the first item from an array/tuple and drop the rest
 */
export type KeepFirst<T extends any[]> = KeepFirstN<T, 1>

/**
 * Keep first N items from an array/tuple and drop the rest
 */
export type KeepFirstN<
    T extends any[],
    N extends number = 1,
> = T['length'] extends N
    ? T
    : T extends [...infer TWithoutLast, any]
        ? KeepFirstN<TWithoutLast, N>
        : []

// type Tuple = [name: string, age: number, userId: string, sex: 'm' | 'f']
// type X = DropFirst<Tuple>
// type Y = DropFirstN<Tuple, 3>
// type Z = DropLast<Tuple>
// type A = TakeFirst<Tuple>
// type B = TakeFirstN<Tuple, 2>