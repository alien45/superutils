import fallbackIfFails from "./fallbackIfFails"
import { asAny } from "./forceCast"
import { TimeoutId } from "./types"

export type ThrottleConfig<ThisArg = unknown> = {
    onError?: (err: any) => any | Promise<any>
    thisArg?: ThisArg
    trailing?: boolean
    tid?: TimeoutId
}

/**
 * @function throttle
 * @summary returns a function that invokes the `callback` maximum twice (once if `executeLast = false`) per interval
 * 
 * @param	callback function to be invoked after timeout
 * @param	delay	 (optional) interval duration in milliseconds. Default: 50
 * @param   config.onError  (optional)
 * @param   config.tid      (optional)
 * @param	config.thisArg  (optional) the special `thisArgs` to be used when invoking the callback.
 * @param   config.trailing (optional) whether to enable trailing edge execution. Default: `true` 
 */
export const throttled = <TArgs extends unknown[], ThisArg>(
    callback: (this: ThisArg, ...args: TArgs) => any | Promise<any>,
    delay: number = 50,
    config: ThrottleConfig<ThisArg> = {},
) => {
    const { defaults: d } = throttled
    const {
        onError = d.onError,
        trailing = d.trailing,
        thisArg,
    } = config
    let { tid } = config
    if (thisArg !== undefined) callback = callback.bind(thisArg)
    const _callback = callback
    callback = (...args: TArgs) => fallbackIfFails(
        _callback,
        args,
        onError,
    )

    // throttle without trailing-edge
    if (!trailing) return (...args: TArgs) => {
        if (tid) return
        asAny(callback)(...args)
        tid = setTimeout(() => tid = undefined, delay)
    }

    let trailArgs: TArgs | null = null
    return (...args: TArgs) => {
        if (tid) {
            trailArgs = args
            return
        }
        
        tid = setTimeout(
            () => {
                tid = undefined
                trailArgs && asAny(callback)(...trailArgs)
                trailArgs = null
            },
            delay,
        )
        asAny(callback)(...args)
    }
}
/**
 * Set the default values
 * This change is applicable application-wide and only applies to any new invocation of `throttle()`.
 */
throttled.defaults = {
    onError: undefined,
    trailing: true,
} satisfies ThrottleConfig
export default throttled