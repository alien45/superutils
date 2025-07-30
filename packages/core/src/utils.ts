
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
/**
 * Check if `x` is an Async function.
 * Caution: May not work when Babel/Webpack is used due to code compilation.
 */
export const isAsyncFn = (x: any) => x instanceof (async () => { }).constructor
	&& (x as any)[Symbol.toStringTag] === 'AsyncFunction'
export const isBool = (x: any): x is boolean => typeof x === 'boolean'
export const isDate = (x: any): x is Date => x instanceof Date
export const isError = (x: any): x is Error => x instanceof Error
export const isFn = (x: unknown): x is Function => typeof x === 'function'
export const isMap = <TKey = any, TValue = any>(x: any): x is Map<TKey, TValue> => x instanceof Map
export const isInteger = (x: any): x is number => Number.isInteger(x)
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
export const isPromise = <T = any>(x: any): x is Promise<T> => x instanceof Promise
export const isSet = <T = any>(x: any): x is Set<T> => x instanceof Set
export const isStr = (x: any): x is string => typeof x === 'string'
export const isURL = (x: any): x is URL => x instanceof URL
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
export const isValidNumber = (x: any): x is number => 
    typeof x == 'number'
    && !isNaN(x)
    && isFinite(x)

export const isValidURL = (x: any, strict = true) => {
    try {
        const isAStr = isStr(x)
        const url = isURL(x)
            ? x
            : new URL(x)
        // If strict mode is set to `true` and if a string value provided, it must match resulting value of new URL(x).
        // This can be used to ensure that a URL can be queried without altering.
        if (!isAStr || !strict) return true
        // catch any auto-correction by `new URL()`. 
        // Eg: spaces in the domain name being replaced by`%20` or missing `/` in protocol being auto added
        x = `${x}`
        if (x.endsWith(url.hostname)) x += '/'
        return url.href == x
    } catch (e) {
        return false
    }
}