import { CurriedArgs, Curry, IsFiniteTuple, TupleMaxLength } from './types'

/**
 * Creates a curried version of a function. The curried function can be
 * called with one or more or all arguments at a time. Once all arguments have been
 * supplied, the original function is executed.
 *
 * ---
 *
 * PS:
 * ---
 * To get around Typescript's limitations, all optional parameters to will be
 * turned required and unioned with `undefined`.
 *
 * ---
 *
 * @param func The function to curry.
 * @returns A new, curried function that is fully type-safe.

 *
 * @example Convert any function into a curried function
 * ```javascript
 * import { curry } from '@superutils/core'
 * 
 * const func = (
 *     first: string,
 *     second: number,
 *     third?: boolean,
 *     fourth?: string
 * ) => `${first}-${second}-${third}-${fourth}`
 * // We create a new function from the `func()` function that acts like a type-safe curry function
 * // while also being flexible with the number of arguments supplied.
 * const curriedFunc = curry(func)
 *
 * // Example 1: usage like a regular curry function and provide one argument at a time.
 * // Returns a function expecting args: second, third, fourth
 * const fnWith1 = curriedFunc('first')
 * // Returns a function expecting args: third, fourth
 * const fnWith2 = fnWith1(2)
 * // returns a function epecting only fourth arg
 * const fnWith3 = fnWith2(false)
 * // All args are now provided, the original function is called and result is returned.
 * const result = fnWith3('last')
 * console.log({ result })
 * // Result: 'first-2-false-last'
 * ```
 * 
 * @example Flexible curried function arguments
 * ```javascript
 * import { curry } from '@superutils/core'
 * 
 * const func = (
 *     first: string,
 *     second: number,
 *     third?: boolean,
 *     fourth?: string
 * ) => `${first}-${second}-${third}-${fourth}`
 * const curriedFunc = curry(func)
 * 
 * // Provide as many arguments as you wish. Upto the limit of the original function.
 * // Returns a function expecting only the remaining argument(s)
 * const fnWith3 = curriedFunc('first', 2, false)
 * // All args provided, returns the result
 * const result = fnWith3('last')
 * console.log({ result })
 * // Result: 
 * ```
 * 
 * @example Early invocation using "arity".
 * Useful when a function has
 *  - non-finite arguments (eg: number[])
 *  - optional arguments and you do not want to avoid one or more optional arguments
 * 
 * ```javascript
 * import { curry } from '@superutils/core'
 * 
 * const func = (
 *     first: string,
 *     second: number,
 *     third?: boolean,
 *     fourth?: string
 * ) => `${first}-${second}-${third}-${fourth}` 
 * const curriedWArity3 = curry(func, 3)
 * const result = curriedWArity3('first', 2, false)
 * console.log({ result })
 * // Result: 'first-2-false-undefined'
 * ```
 */
export function curry<
	TData,
	TArgs extends unknown[],
	TArgsIsFinite extends boolean = IsFiniteTuple<TArgs>,
	TArity extends TArgs['length'] = TArgsIsFinite extends true
		? TupleMaxLength<TArgs>
		: number,
>(
	func: (...args: TArgs) => TData,
	...[arity = func.length as TArity]: TArgsIsFinite extends true
		? [arity?: TArity]
		: // force require arity when TArgs length is limitless
			// (eg: number[] as opposed to a tuple like [a: number, b: number])
			[arity: TArity]
) {
	type TCurriedArgs = CurriedArgs<TArgs, TArgsIsFinite, typeof func, TArity>

	// The runtime implementation of the curried function.
	const curriedFn = (...args: TCurriedArgs): unknown => {
		const _args = args as unknown[]
		// If we have received enough arguments, call the original function.
		if (_args.length >= arity) return func(...(args as TArgs))
		// Otherwise, return a new function that waits for the rest of the arguments.
		return (...nextArgs: unknown[]) =>
			(curriedFn as (...args: unknown[]) => unknown)(
				..._args,
				...nextArgs,
			)
	}
	return curriedFn as Curry<TData, TCurriedArgs>
}
