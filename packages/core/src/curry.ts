import { DropFirstN, KeepFirstN } from './types'

/**
 * A recursive helper type that defines the signature of the curry function.
 * @template TParams The tuple of remaining parameters.
 * @template TData The final return type.
 */
type Curry<TData, TParams extends any[]> = <TArgs extends any[]>(
    // Ensure the provided arguments `TArgs` match the types of the expected parameters `TParams`.
    ...args: TArgs & KeepFirstN<TParams, TArgs['length']>
) => // Check if there are any parameters left to be supplied.
    DropFirstN<TParams, TArgs['length']> extends [any, ...any[]]
        // If yes, return a new curried function expecting the remaining parameters.
        ? Curry<TData, DropFirstN<TParams, TArgs['length']>>
        // If no, all parameters have been supplied, so return the final result.
        : TData

/**
 * CAUTION: EXPERIMENTAL! May not work as expected in production!
 * 
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
export const curry = <TData, TParams extends any[]>(
    fn: (...args: TParams) => TData,
    arity?: number
): Curry<TData, TParams> => {
    const n = arity ?? fn.length;
    // The runtime implementation of the curried function.
    const curriedFn = (
        ...args: Partial<TParams>
    ): any => {
        // If we have received enough arguments, call the original function.
        if (args.length >= n) return fn(...(args as TParams))
        // Otherwise, return a new function that waits for the rest of the arguments.
        return (...nextArgs: any[]) => curriedFn(...[...args, ...nextArgs] as TParams)
    }
    return curriedFn as Curry<TData, TParams>
}

// export const curryX = <
//     TReturn,
//     AllArgs extends any[],
// >(
//     fn: (...args: AllArgs) => TReturn,
// ) => {
//     const receivedArgs: Partial<AllArgs> = [] as any as Partial<AllArgs>
//     // if (receivedArgs.length >= fn.length) return fn(...(receivedArgs as TArgs))
        
//     const curryY = <TArgs2 extends any[]>(
//         ...args: DropFirstN<TArgs2, typeof receivedArgs.length>
//     ) =>(...args: ) => {
//         const nextArgs = [...receivedArgs, ...arguments]
//     }
// }


// A regular function
const func = (
    first: string,
    second: number,
    third: boolean,
    fourth: string
) => `${first}-${second}-${third}-${fourth}`
// We create a new function from the `func()` function that acts like a type-safe curry function
// while also being flexible with the number of arguments supplied.
const curriedFunc = curry(func)

const fnWith0 = curriedFunc()
// Example 1: usage like a regular curry function and provide one argument at a time.
// Returns a function expecting args: second, third, fourth
const fnWith1 = fnWith0('first', )
// Returns a function expecting args: third, fourth
const fnWith2 = fnWith1(2)
// returns a function epecting only fourth arg
const fnWith3 = fnWith2(false)
// All args are now provided, the original function is called and result is returned.
const result = fnWith3('last')