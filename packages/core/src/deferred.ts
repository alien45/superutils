/**
 * @name	deferred
 * @summary returns a function that invokes the callback function after certain delay/timeout
 * 
 * @param	{Function}	callback 	function to be invoked after timeout
 * @param	{Number}	delay		(optional) timeout duration in milliseconds.
 * 									Default: 50
 * @param   {boolean}   silent      (optional) if true, errors on callback will be gracefully ignored.
 *                                  Default: `deferred.defaultSilent`
 * @param	{*}			thisArg		(optional) the special `thisArgs` to be used when invoking the callback.
 * @param	{*}			tid		    (optional) Timeout Id. If provided, will clear the timeout on first invocation.
 * 
 */
export const deferred = <TArgs extends unknown[]>(
    callback: (...args: TArgs) => void,
    delay: number = 50,
    silent?: boolean,
    thisArg?: unknown,
    tid?: NodeJS.Timeout
) => {
    if (thisArg !== undefined) callback = callback.bind(thisArg)
    if (silent ?? deferred.defaultSilent) {
        const _callback = callback
        callback = (...args: TArgs) => Promise
            .try(_callback, ...args)
            .catch(() => {})
    }

    return (...args: TArgs) => {
        clearTimeout(tid)
        tid = setTimeout(
            callback,
            delay,
            ...args // arguments for callback
        )
    }
}
/**
 * Set the default value of argument `silent` for the `deferred` function.
 * This change is applicable application-wide and only applies to any new invocation of `deferred()`.
 */
deferred.defaultSilent = false
export default deferred