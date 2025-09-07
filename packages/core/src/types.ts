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
> = TupleMaxLength<Dropped> extends N
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
export type KeepFirst<T extends any[]> = T extends readonly [infer First, ...DropFirst<T>]
    ? [First]
    : never

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
> = TupleMaxLength<T> extends N
    ? T
    : T extends readonly [...infer TWithoutLast, any]
        ? KeepFirstN<TWithoutLast, N>
        : never

export type KeepOptionals<
    T extends any[],
    Require extends true | false = false,
    TAlt = undefined
> = Require extends true
    ? Required<DropFirstN<T, T['length']>> extends [...infer Optionals]
        ? { -readonly [K in keyof Optionals]: Optionals[K] | TAlt }
        : never
    : DropFirstN<T, T['length']>

export type KeepRequired<T extends any[]> = Slice<T, 0, T['length']>

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
    IndexEnd extends number = IndexStart,
> = Tuple extends readonly [...infer Left, ...Slice<Tuple, IndexStart, IndexEnd>, ...infer Right]
    ? [
        ...Left,
        ...Slice<Tuple, IndexStart, IndexEnd>,
        ...Right
    ]
    : Tuple
// > = Tuple extends readonly [...KeepFirstN<Tuple, IndexStart>, ...infer Range, ...DropFirstN<Tuple, IndexEn>]
//     ? [
//         ...KeepFirstN<Tuple, IndexStart>,
//         ...Partial<Range>,
//         ...DropFirstN<Tuple, IndexEn>
//     ]
//     : Tuple

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

export type Slice<
    Tuple extends any[],
    IndexStart extends number,
    IndexEnd extends number = Tuple['length']
> = (
    IndexStart extends 0
        ? Tuple // left slice
        : DropFirstN<Tuple, IndexStart> // right slice
) extends [
        ...infer Sliced,
        ...DropFirstN<Tuple, IndexEnd>
    ]
    ? Sliced
    : never

export type TimeoutId = Parameters<typeof clearTimeout>[0]

/**
 * Get the maximum possible length of a tuple
 * 
 * This is particularly useful when a tuple (or function paramenters) contains optional members.
 * 
 * ---
 * @example ```typescript
 * type MyTuple = [string, number?, boolean?]
 * type Lengths = MyTuple['length'] // 1 | 2 | 3 // union because of optional parameters
 * type MaxLength = TupleMaxLength<MyTuple> // 3
 * ```
 */
export type TupleMaxLength<T extends readonly any[], Len = T['length']> = (
    Len extends any
        ? (x: () => Len) => void
        : never
) extends (x: infer R) => void
    ? R extends () => infer U
        ? U
        : never
    : never

/** 
 * Accept a type of value or a function that returns the same type of value
 * 
 * Examples:
 * ---
 * @example ```typescript
 * import { isFn, ValueOrFunc } from '@utils/core'
 * const print = (value: ValueOrFunc<string>) => isFn(value)
 *  ? value()
 *  : value
 * print('Print me!')
 * print(() => 'Print me too!')
 * ```
 */
export type ValueOrFunc<T, U extends unknown[] | never[] = []> = T | ((...args: U) => T)