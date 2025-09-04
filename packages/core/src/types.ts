/**
 * Drop the first item from an array/tuple and keep the rest
 */
export type AsyncFn<
    TOut = unknown,
    TArgs extends any[] = []
> = (...args: TArgs) => Promise<Awaited<TOut>>

/**
 * Drop the first item from an array/tuple and keep the rest
 * ---
 * @example ```javascript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWOFirst = DropFirst<MyTuple> // result: [second: number, third: boolean]
 * ```
 */
export type DropFirst<T extends any[]> = T extends [any, ...infer Rest]
    ? Rest
    : []

/**
 * Drop first N items from an array/tuple and keep the rest
 * ---
 * @example ```javascript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWO2 = DropFirstN<MyTuple, 2> // result: [third: boolean]
 * ```
 */
export type DropFirstN<
    T extends any[],
    N extends number,
    Dropped extends any[] = [],
> = Dropped['length'] extends N
    ? T
    : T extends [infer First, ...infer Rest]
        ? DropFirstN<
            Rest,
            N,
            [...Dropped, First] // add to the dropped list
        >
        : T
/**
 * Drop the last item from an array/tuple and keep the rest
 * ---
 * @example ```javascript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWOLast = DropLast<MyTuple> // result: [first: string, second: number]
 * ```
 */
export type DropLast<T extends Array<any>> = T extends [...infer Rest, any]
    ? Rest
    : []

/**
 * Extract inner data type of any supported type
 * ---
 * @example ```javascript
 * type MyArray = Array<string>
 * type MyArraData = ExtractDataType<MyArray> // string
 * ```
 */
export type ExtractDataType<T = unknown> = T extends Readonly<infer DataType>
    ? DataType
    : T

/**
 * Keep the first item from an array/tuple and drop the rest
 * ---
 * @example ```javascript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWFirst = KeepFirst<MyTuple> // result: [first: string]
 * ```
 */
export type KeepFirst<T extends any[]> = KeepFirstN<T, 1>

/**
 * Keep first N items from an array/tuple and drop the rest
 * ---
 * @example ```javascript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWith1st2 = KeepFirstN<MyTuple, 2> // result: [first: string, second: number]
 * ```
 */
export type KeepFirstN<
    T extends readonly any[],
    N extends number = 1,
> = T['length'] extends N
    ? T
    : T extends readonly [...infer TWithoutLast, any]
        ? KeepFirstN<TWithoutLast, N>
        : never

/** Make T1 optional if T2 is undefined */
export type OptionalIf<
    T1,
    T2,
    T2IF = undefined,
    T1Alt = undefined
> = T2 extends T2IF
    ? T1
    : T1 | T1Alt

export type MakeOptional<
    Tuple extends any[],
    IndexStart extends number,
    IndexEn extends number = IndexStart,
> = Tuple extends [...KeepFirstN<Tuple, IndexStart>, ...infer Range, ...DropFirstN<Tuple, IndexEn>]
    ? [
        ...KeepFirstN<Tuple, IndexStart>,
        ...Partial<Range>,
        ...DropFirstN<Tuple, IndexEn>
    ]
    : Tuple

export type MakeOptionalLeft<
    Tuple extends any[],
    IndexEnd extends number,
> = Tuple extends [...infer Range, ...DropFirstN<Tuple, IndexEnd>]
    ? [...Partial<Range>, ...DropFirstN<Tuple, IndexEnd>]
    : never

export type MakeOptionalRight<
    Tuple extends any[],
    Start extends number,
> = Tuple extends [...KeepFirstN<Tuple, Start>, ...infer Range]
    ? [...KeepFirstN<Tuple, Start>, ...Partial<Range>]
    : Tuple

export type TimeoutId = Parameters<typeof clearTimeout>[0]

export type ValueOrFunc<T, U extends unknown[] | never[] = []> = T | ((...args: U) => T)


// type Tuple = [name: string, age: number, userId: string, sex: 'm' | 'f']
type Tuple = 
// Partial<
    Parameters<(
        name: string,
        age: number,
        userId?: string,
        sex?: 'm' | 'f',
    ) => {}>
// >
type X = DropFirst<Tuple>
type Y = DropFirstN<Tuple, 3>
type Z = DropLast<Tuple>
type A = KeepFirst<Tuple>
type B = KeepFirstN<Tuple, 2>