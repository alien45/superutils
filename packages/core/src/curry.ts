import { DropFirstN, KeepFirstN } from './types'

/**
 * A recursive helper type that defines the signature of the curry function.
 * @template TParams The tuple of remaining parameters.
 * @template TReturn The final return type.
 */
type Curry<TParams extends any[], TReturn> = <TArgs extends any[]>(
    // Ensure the provided arguments `TArgs` match the types of the expected parameters `TParams`.
    ...args: TArgs & KeepFirstN<TParams, TArgs['length']>
) => // Check if there are any parameters left to be supplied.
DropFirstN<TParams, TArgs['length']> extends [any, ...any[]]
    ? // If yes, return a new curried function expecting the remaining parameters.
      Curry<DropFirstN<TParams, TArgs['length']>, TReturn>
    : // If no, all parameters have been supplied, so return the final result.
      TReturn

/**
 * Creates a curried version of a function. The curried function can be
 * called with one or more arguments at a time. Once all arguments have been
 * supplied, the original function is executed.
 *
 * @param fn The function to curry.
 * @returns A new, curried function that is fully type-safe.
 * 
 * @example ```javascript
 * 
 * // Example usages of the `curry()` function.
 * 
 * // A regular function
 * const func = (
 *     first: string,
 *     second: number,
 *     third: boolean,
 *     fourth: string
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
 * 
 * // Example 2: flexible curry.
 * // Provide as many arguments as you wish. Upto the limit of the original function.
 * // Returns a function expecting only the last remaining argument
 * const fnWith3 = curriedFunc('first', 2, false)
 * // All args provided, returns the result
 * const result = fnWith3('last')
 */
export const curry = <TParams extends any[], TReturn>(
    fn: (...args: TParams) => TReturn
): Curry<TParams, TReturn> => {
    // The runtime implementation of the curried function.
    const curriedFn = (
        ...args: Partial<TParams>
    ): any => {
        // If we have received enough arguments (or more), call the original function.
        if (args.length >= fn.length) {
            return fn(...(args as TParams))
        }
        // Otherwise, return a new function that waits for the rest of the arguments.
        return (...nextArgs: any[]) => curriedFn(...[...args, ...nextArgs] as TParams)
    }
    return curriedFn as Curry<TParams, TReturn>
}