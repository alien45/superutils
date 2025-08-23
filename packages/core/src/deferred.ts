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
export default deferred