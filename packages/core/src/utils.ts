export const arrUnique = <T = unknown>(arr: T[]) => Array.from(new Set<T>(arr))

/**
 * @name	deferred
 * @summary returns a function that invokes the callback function after certain delay/timeout
 * 
 * @param	{Function}	callback 	function to be invoked after timeout
 * @param	{Number}	delay		(optional) timeout duration in milliseconds.
 * 									Default: 50
 * @param	{*}			thisArg		(optional) the special `thisArgs` to be used when invoking the callback.
 * 
 * @returns {Function}
 */
export const deferred = (
    callback: any,
    delay: number = 50,
    thisArg?: any,
    tid?: any
): ((...args: any[]) => void) => (...args: any[]) => {
    clearTimeout(tid)
    tid = setTimeout(
        callback?.bind?.(thisArg),
        delay,
        ...args //arguments for callback
    )
}

export const delay = (delayMs: number, result: unknown = delayMs) => new Promise(resolve =>
    setTimeout(() => resolve(result), delayMs)
)
export const isArr = <T = any> (x: any): x is Array<T> => Array.isArray(x)
export const isBool = (x: any): x is boolean => typeof x === 'boolean'
export const isDate = (x: any): x is Date => x instanceof Date
export const isFn = (x: unknown): x is Function => typeof x === 'function'
export const isMap = <TKey = any, TValue = any>(x: any): x is Map<TKey, TValue> => x instanceof Map
export const isObj = (x: any, strict = true): x is Object => !!x // excludes null, NaN, Infinity....
    && typeof x === 'object'
    && (
        !strict
        // excludes Array, Map, Set
        || !isArr(x)
        && !isMap(x)
        && !isSet(x)
    )
export const isPositiveNumber = (x: any): x is number => isValidNumber(x) && x > 0
export const isSet = <T = any>(x: any): x is Set<T> => x instanceof Set
export const isStr = (x: any): x is string => typeof x === 'string'
export const isValidDate = (dateOrStr: Date | string) => {
    const date = new Date(dateOrStr)
    // avoids "Invalid Date"
    if (Number.isNaN(date.getTime())) return false
    // provided dateOrStr is a Date object and has a valid timestamp
    if (!isStr(dateOrStr)) return true

    // hack to detect & prevent `new Date(dateOrStr)` converting '2021-02-31' to '2021-03-03'
    const [original, converted] = [dateOrStr, date.toISOString()].map(y => y
        .replace(/[TZ]/g, '')
        .substring(0, 10)
    )
    return original === converted
}
export const isValidNumber = (x: any): x is number => typeof x == 'number' && !isNaN(x) && isFinite(x)