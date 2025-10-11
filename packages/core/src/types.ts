/**
 * Defines an async function
 */
export type AsyncFn<TOut = unknown, TArgs extends any[] = []> = (
	...args: TArgs
) => Promise<Awaited<TOut>>

/**
 * Create a tuple of specific type with given length
 * ---
 * @example Create a new tuple
 * ```typescript
 * type CreatedTuple =  CreateTuple<number, 3>
 * // Result: [number, number, number]
 * ```
 *
 * @example Create a new tuple by extending an existing tuple
 * ```typescript
 * type ExtendedTuple = CreateTuple<string, 6, CreatedTuple>
 * // Result: [number, number, number, string, string, string]
 * ```
 */
export type CreateTuple<
	T extends any,
	Length extends number,
	Output extends readonly any[] = [],
> = Output['length'] extends Length
	? Output
	: CreateTuple<T, Length, [...Output, T]>

/**
 * A recursive helper type that defines the signature of the curry function.
 * @template TParams The tuple of remaining parameters.
 * @template TData The final return type.
 */
export type Curry<TData, TParams extends any[]> = <TArgs extends any[]>(
	// Ensure the provided arguments `TArgs` match the types of the expected parameters `TParams`.
	...args: TArgs & KeepFirstN<TParams, TArgs['length']>
) => // Check if there are any parameters left to be supplied.
DropFirstN<TParams, TArgs['length']> extends [any, ...any[]]
	? // If yes, return a new curried function expecting the remaining parameters.
		Curry<TData, DropFirstN<TParams, TArgs['length']>>
	: // If no, all parameters have been supplied, so return the final result.
		TData

/**
 * Deferred function config
 */
export interface DeferredConfig<ThisArg = unknown> {
	leading?: boolean | 'global'
	onError?: (err: unknown) => ValueOrPromise<unknown>
	thisArg?: ThisArg
	tid?: TimeoutId
}

/**
 * Drop the first item from an array/tuple and keep the rest
 * ---
 * @example usage
 * ```typescript
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
 * @example usage
 * ```typescript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWO2 = DropFirstN<MyTuple, 2> // result: [third: boolean]
 * ```
 */
export type DropFirstN<
	T extends any[],
	N extends number,
	Dropped extends any[] = [],
> =
	TupleMaxLength<Dropped> extends N
		? T
		: T extends [infer First, ...infer Rest]
			? DropFirstN<Rest, N, [...Dropped, First]> // add to the dropped list
			: never
/**
 * Drop the last item from an array/tuple and keep the rest
 * ---
 * @example usage
 * ```typescript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWOLast = DropLast<MyTuple> // result: [first: string, second: number]
 * ```
 */
export type DropLast<T extends any[]> = T extends [...infer Rest, any]
	? Rest
	: []

export type IsFiniteTuple<T extends any[]> = number extends T['length']
	? false
	: true

export type IsOptional<T, K extends keyof T> =
	{} extends Pick<T, K> ? true : false

/**
 * Keep the first item from an array/tuple and drop the rest
 * ---
 * @example usage
 * ```typescript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWFirst = KeepFirst<MyTuple> // result: [first: string]
 * ```
 */
export type KeepFirst<T extends any[]> = T extends readonly [
	infer First,
	...DropFirst<T>,
]
	? [First]
	: never

/**
 * Keep first N items from an array/tuple and drop the rest
 * ---
 * @example usage
 * ```typescript
 * type MyTuple = [first: string, second: number, third: boolean]
 * type MyTupleWith1st2 = KeepFirstN<MyTuple, 2> // result: [first: string, second: number]
 * ```
 */
export type KeepFirstN<T extends readonly any[], N extends number = 1> =
	TupleMaxLength<T> extends N
		? T
		: T extends readonly [...infer TWithoutLast, any]
			? KeepFirstN<TWithoutLast, N>
			: never

/**
 * Extract optional members of a tuple.
 *
 * @template Tuple  tuple
 * @template Require (optional) if true, all returned member of the returned tuple will be required field and TAlt will be added as union.
 * Defaults to `false`
 * @template TAlt   (optional) Defaults to `undefined`
 *
 * @example usage
 * ```typescript
 * import { KeepOptionals } from '@superutils/core
 * type MyTuple = [first: string, second?: number, third?: boolean]
 * type Optionals = KeepOptionals<MyTuple>
 * // Result: [second?: number, third?: boolean]
 * type AsRequired = KeepOptionals<MyTuple, true>
 * // Result: [second: number | undefined, third: boolean | undefined]
 * type AsRequiredWNull = KeepOptionals<MyTuple, true, null>
 * // Result: [second: number | null, third: boolean | null]
 * ```
 */
export type KeepOptionals<
	Tuple extends any[],
	Require extends true | false = false,
	TAlt = undefined,
> = Require extends true
	? Required<DropFirstN<Tuple, Tuple['length']>> extends [...infer Optionals]
		? TupleWithAlt<Optionals, TAlt>
		: never
	: DropFirstN<Tuple, Tuple['length']>

/**
 * Extract all required members of a tuple
 */
export type KeepRequired<T extends unknown[]> = KeepFirstN<
	Required<T>, // force all members to be required to avoid getting `never` because of optional members
	MinLength<T>
>

export type MinLength<T extends any[], Count extends any[] = []> = T extends [
	infer F,
	...infer R,
]
	? undefined extends F // optional param?
		? MinLength<R, Count> // skip
		: MinLength<R, [...Count, any]> // increment
	: Count['length']

/** Make T1 optional if T2 is undefined */
export type OptionalIf<
	T1,
	T2,
	T2IF = undefined,
	T1Alt = undefined,
> = T2 extends T2IF ? T1 : T1 | T1Alt

export type MakeOptional<
	Tuple extends any[],
	IndexStart extends number,
	IndexEnd extends number = TupleMaxLength<Tuple>,
> = Tuple extends readonly [
	...infer Left,
	...Slice<Tuple, IndexStart, IndexEnd>,
	...infer Right,
]
	? [...Left, ...Partial<Slice<Tuple, IndexStart>>, ...Right]
	: never

/**
 * Create a new slices tuple from an existing tuple
 * ---
 * @example usage
 * ```typescript
 * type MyTuple = [a: string, b: boolean, c: number, d: Record<string, unknown>]
 * type FirstHalf = Slice<MyTuple, 0, 2>
 * type LastHalf = Slice<MyTuple, 2>
 * ```
 */
export type Slice<
	Tuple extends any[],
	IndexStart extends number,
	IndexEnd extends number = TupleMaxLength<Tuple>,
> = [...KeepRequired<Tuple>, ...KeepOptionals<Tuple, true>] extends [
	...infer All,
]
	? DropFirstN<KeepFirstN<All, IndexEnd>, IndexStart> extends [
			...infer Sliced,
		]
		? Sliced
		: never
	: never

export type TimeoutId = Parameters<typeof clearTimeout>[0]

/**
 * Get the maximum possible length of a tuple
 *
 * This is particularly useful when a tuple (or function paramenters) contains optional members.
 *
 * ---
 * @example usage
 * ```typescript
 * type MyTuple = [string, number?, boolean?]
 * type Lengths = MyTuple['length'] // 1 | 2 | 3 // union because of optional parameters
 * type MaxLength = TupleMaxLength<MyTuple> // 3
 * ```
 */
export type TupleMaxLength<T extends readonly any[]> = Required<T>['length']

/**
 * Add alt type to all members of a tuple.
 *
 * ---
 * @example usage
 * ```typescript
 * type MyTuple = [first: boolean, second: string]
 * type MyTupleWithUndefined = TupleWithAlt<MyTuple>
 * // Result: [first: boolean | undefined, second: string | undefined]
 * type MyTupleWithNull = TupleWithAlt<MyTuple, null>
 * // Result: [first: boolean | null, second: string | null]
 * ```
 */
export type TupleWithAlt<Tuple extends any[], TAlt = undefined> = {
	-readonly [K in keyof Tuple]: Tuple[K] | TAlt
}

/**
 * Accept value or a function that returns the value
 *
 * Examples:
 * ---
 * @example usage
 * ```typescript
 * import { isFn, ValueOrFunc } from '@superutils/core'
 * const print = (value: ValueOrFunc<string>) => isFn(value)
 *  ? value()
 *  : value
 * print('Print me!')
 * print(() => 'Print me too!')
 * ```
 */
export type ValueOrFunc<Value, Args extends unknown[]> =
	| Value
	| ((...args: Args) => Value)

/** Accept value a promise resolving to value */
export type ValueOrPromise<T> = T | Promise<T>
