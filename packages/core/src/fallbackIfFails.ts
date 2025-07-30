import { isError, isFn, isPromise } from "./utils"

/**
 * @name	fallbackIfFails
 * @summary a flexible try-catch wrapper for invoking functions to catch errors gracefully.
 * Ensures a value is always returned by avoiding any unexpected errors.
 * 
 * `fallbackValue` PS:  
 * 
 * 1. If function provided and Error is thrown it will not be caught. 
 * A fallback of the fallback is out of the scope of this function.
 * 2. If `target` a promise or async function, `fallbackValue` must either be a promise or resolve to a promise
 * 
 * @param target        promise or function to execute
 * @param args			arguments to be supplied to `func` fuction
 * @param fallbackValue alternative value to be used when target throws error.    
 * 
 * @returns if func is a promise the return a promise 
 * 
 * @example ```javascript
 * 
 * const args: [string, boolean] = ['some value', true]
 * const ensureValue = async (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // this makes sure there's always a value without having to manually write try-catch block.
 * const value = await fallbackIfFails(
 *     ensureValue,
 *     () => args,
 *     async () => 'fallback value'
 * )
 * ```
 */
export const fallbackIfFails = <
    TValue = unknown,
    TArgs extends any[] = unknown[],
>(
    target: TValue | ((...args: TArgs) => TValue),
    args: TArgs | (() => TArgs),
    fallbackValue?: TValue | ((err?: Error) => TValue)
): TValue => {
    let result: any = undefined
    let err: Error | undefined = undefined
    try {
        result = !isFn(target)
            ? target // value or promise received
            : target(...isFn(args) ? args() : args)
        if (!isPromise(result)) return result
    } catch (error) {
        err = !isError(error)
            ? new Error(error as any)
            : error
    }
    const getAltVal = (err?: Error) => isFn(fallbackValue)
        ? fallbackValue(err)
        : fallbackValue
    result = isPromise(result)
        ? result.catch(getAltVal)
        : isError(err)
            ? getAltVal(err)
            : result

    return result
}
export default fallbackIfFails