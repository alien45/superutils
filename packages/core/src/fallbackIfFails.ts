import { isFn, isPromise } from './is'

type IfPromiseAddValue<T> = T extends Promise<infer V>
    ? T | V
    : T
/**
 * @name	fallbackIfFails
 * @summary a flexible try-catch wrapper for invoking functions and ignore errors gracefully.
 * Yes, the goal of `fallbackIfFails` is to ignore all runtime errors
 * and ensure there's always a value returned.
 * 
 * ---
 * 
 * `fallbackValue` PS:  
 * 
 * 1. If function provided and Error is thrown it will not be caught. 
 * A fallback of the fallback is out of the scope of this function.
 * 2. If `target` a promise or async function, `fallbackValue` must either be a promise or resolve to a promise
 * 
 * ---
 * 
 * @param target        promise or function to execute
 * @param args			arguments to be supplied to `func` fuction
 * @param fallbackValue alternative value to be used when target throws error.    
 * 
 * @returns if func is a promise the return a promise 
 * 
 * @example ```javascript
 * // Working with async functions returns a promise
 * const args = ['some value', true] as const
 * const ensureValue = async (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // This makes sure there's always a value without having to manually write try-catch block.
 * const value = await fallbackIfFails(
 *     ensureValue,
 *     () => args,
 *     async () => 'fallback value'
 * )
 * ```
 * 
 * ---
 * 
 * @example ```javascript
 * // Working synchronous function just returns the value
 * const args = ['some value', true] as const
 * const ensureValue = (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // this makes sure there's always a value without having to manually write try-catch block.
 * const value = fallbackIfFails(
 *     ensureValue,
 *     () => args,
 *     () => 'fallback value'
 * ) 
 * ``` 
 */
export const fallbackIfFails = <T, TArgs extends any[] = any[]>(
    target: T | ((...args: TArgs) => T),
    args: TArgs | (() => TArgs),
    fallbackValue: IfPromiseAddValue<T> | ((reason: any) => IfPromiseAddValue<T>)
) => {
    const getAltVal = (reason: any) => isFn(fallbackValue)
        ? fallbackValue(reason)
        : fallbackValue
    let result: unknown
    try {
        result = !isFn(target)
            ? target // value or promise received
            : target(...(
                isFn(args)
                    ? args()
                    : args
            ))
        result = !isPromise(result)
                ? result
                : result.catch(getAltVal)
    } catch (error) {
        result = getAltVal(error)
    }
    return result as T
}
export default fallbackIfFails