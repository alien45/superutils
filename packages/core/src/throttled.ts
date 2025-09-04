import fallbackIfFails from "./fallbackIfFails"

/**
 * @name	throttle
 * @summary returns a function that invokes the callback function maximum once per interval
 * 
 * @param	{Function}	callback 	function to be invoked after timeout
 * @param	{Number}	delay		(optional) interval duration in milliseconds.
 * 									Default: 50
 * @param   {Boolean}   silent      (optional) if true, will make sure `callback` invocation errors are ignored gracefully
 * @param	{*}			thisArg		(optional) the special `thisArgs` to be used when invoking the callback.
 */
export const throttled = <TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    delay: number = 50,
    silent?: boolean,
    thisArg?: unknown,
) => {
    let tid: NodeJS.Timeout | null = null
    if (thisArg !== undefined) callback = callback.bind(thisArg)
    if (silent ?? throttled.defaultSilent) {
        const _callback = callback
        callback = (...args: TArgs) => Promise
            .try(_callback, ...args)
            .catch(() => {})
    }

    return (...args: TArgs) => {
        tid ??= setTimeout(
            () => {
                tid = null
                callback(...args)
            },
            delay,
        )
    }
}
/**
 * Set the default value of argument `silent` for the `throttle` function.
 * This change is applicable application-wide and only applies to any new invocation of `throttle()`.
 */
throttled.defaultSilent = false
export default throttled