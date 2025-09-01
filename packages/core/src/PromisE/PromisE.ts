import { isFn, isPromise } from '../is'
import { PromisE_deferred } from './deferred'
import PromisE_deferredCallback from './deferredCallback'
import PromisE_deferredFetch from './deferredFetch'
import PromisE_deferredPost from './deferredPost'
import PromisE_delay from './delay'
import PromisE_delayReject from './delayReject'
import PromisE_fetch from './fetch'
import PromisE_fetchResponse from './fetchResponse'
import PromisE_post from './post'
import PromisE_timeout from './timeout'
import {
    ExecutorFunc,
    OnEarlyFinalize,
    PromisE_withResolvers,
    PromiseParams,
 } from './types'

/** 
 * @name PromisE
 * @summary attempts to solve a simple problem of Promise status (resolved/rejected) not being accessible externally.
 * Also compatible with async functions
 *
 * @param {Promise|Function|*}  promise AsyncFunction is not supported in NodeJS with Webpack!
 *
 * @example Examples:
 * <BR>
 * 
 * ```javascript
 * // 1. Use exacly the same as Promise to create a new Promise
 *    const dummyPromise = new PromisE((resolve, reject) => resolve())
 * // 2. Use an uninvoked async function
 *    PromisE(async () => await anotherPromise())
 *    new PromisE(async function() { return [...arguments].reverse() }, 1, 2, 3, 4, 5, 6).then(console.log)
 * // 3. Extend an existing Proimse instance
 *    PromisE(promiseInstance)
 * ```
 *
 * @returns {{
 *  catch: Function,
 *  finally: Function,
 *  pending: Boolean,
 *  rejected: Boolean,
 *  resolved: Boolean,
 *  then: Function,
 * }} result promise
 */
export class PromisE<T = unknown> extends Promise<T> {
    /** callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve/reject methods */
    public onEarlyFinalize: OnEarlyFinalize<T>[] = []
    private _pending = true
    private _resolve?: ((value: T) => void)
    private _resolved = false
    private _reject?: (reason: any) => void
    private _rejected = false

    constructor(...args: PromiseParams<T>)
    constructor(promise: Promise<T>)
    constructor(value: T)
    constructor(input: T | Promise<T> | ExecutorFunc<T>) {
        if (input instanceof PromisE) return input

        const promise = isPromise(input)
            ? input
            : !isFn(input)
                ? Promise.resolve<T>(input)
                : new Promise<T>(input)

        super((resolve, reject) => setTimeout(async () => {
            this._resolve = resolve
            this._reject = reject
            try {
                const value = await promise
                this._resolved = true
                resolve(value)
            } catch (err) {
                this._rejected = true
                reject(err)
            }
            this._pending = false
        }))
    }
    
    //
    //
    //-------------------- Status related read-only attributes --------------------
    //
    //

    /** Indicates if the promise is still pending/unfinalized */
    public get pending () { return this._pending }
    /** Indicates if the promise has been rejected */
    public get rejected () { return this._rejected }
    /** Indicates if the promise has been resolved */
    public get resolved () { return this._resolved }


    //
    //
    //
    //-------------------------- Static helper functions --------------------------
    //
    //
    //

    static deferred = PromisE_deferred
    static deferredCallback = PromisE_deferredCallback
    static deferredFetch = PromisE_deferredFetch
    static deferredPost = PromisE_deferredPost
    static delay = PromisE_delay
    static delayReject = PromisE_delayReject
    static fetch = PromisE_fetch
    static fetchDeferred = PromisE_deferredFetch
    static fetchResponse = PromisE_fetchResponse
    static post = PromisE_post
    static postDeferred = PromisE_deferredPost
    static timeout = PromisE_timeout

    /** Resovle pending promise early. */
    public resolve = (value: T): PromisE<T> => {
        this._pending && setTimeout(() => {
            this._resolve?.(value)
            this.onEarlyFinalize.forEach(fn => Promise.try(fn, true, value))
        })
        return this
    }

    /** Reject pending promise early. */
    public reject = (reason: any) => {
        this._pending && setTimeout(() => {
            this._reject?.(reason)
            this.onEarlyFinalize.forEach(fn => Promise.try(fn, false, reason))
        })
        return this
    }


    //
    //
    //
    //------------------------------- Sugary bits ---------------------------------
    // Extend all static `Promise` methods
    //
    //

    /** Sugar for `new PromisE(Promise.all(...))` */
    static all = <T extends readonly unknown[]>(values: T) => new PromisE(Promise.all<T>(values))

    /** Sugar for `new PromisE(Promise.allSettled(...))` */
    static allSettled = <T extends unknown[]>(values: T) => new PromisE(Promise.allSettled<T>(values))

    /** Sugar for `new PromisE(Promise.any(...))` */
    static any = <T extends unknown[]>(values: T) => new PromisE(Promise.any<T>(values))

    /** Sugar for `new PromisE(Promise.race(..))` */
    static race = <T>(values: T[]) => new PromisE(Promise.race(values))

    /** Sugar for `new PromisE(Promise.reject(...))` */
    static reject = <T>(reason: any) => new PromisE<T>(Promise.reject(reason))

    /** Sugar for `new PromisE(Promise.resolve(...))` */
    static resolve = <T = unknown>(value?: T) => new PromisE(Promise.resolve<T>(value as T))

    /** Sugar for `new PromisE(Promise.try(...))` */
    static try = <T = unknown, U extends unknown[] | [] = []>(
        ...args: Parameters<typeof Promise.try<T, U>>
    ) => new PromisE(Promise.try<T, U>(...args))

    /** Creates a new {@link PromisE} and returns it in an object, along with its `resolve` and `reject` functions. */
    static withResolvers = <T = unknown>() => {
        const pwr = Promise.withResolvers<T>()
        return {
            ...pwr,
            promise: new PromisE<T>(pwr.promise),
        } satisfies PromisE_withResolvers<T>
    }
}
export default PromisE

/**
 * 
 * 
 * 
 * 
 * 
 *  TODO: future
 * 
 * 
 * 
 * 
 * 
 */

// /**
//  * @name    PromisE.getSocketEmitter
//  * @summary a wrapper function for socket.io emitter to eliminate the need to use callbacks. 
//  * 
//  * @param   {Object} socket         'socket.io-client' client instance.
//  * @param   {Number} timeoutGlobal  (optional) default timeout for all events emitted using the returned callback
//  * @param   {Number} errorArgIndex  (optional) index of the callback argument that contains server error message.
//  *                                  Use non-integer value to indicate that error message will not be provided
//  *                                  as a direct argument by server. Eg: error message is a property of an object. 
//  *                                  In that case, error should be thrown manually inside the `resultModifier` function.
//  *                                  Default: `0` (this assumes that emitted message will resolve)
//  *  
//  * @param   {Number} callbackIndexLocal  (optional) index of the emitter parameter that is expected to be a callback
//  *                                  Default: `null` (callback will be place at the end of `args` array)
//  * 
//  * @returns {Function}  callback function when invoked returns a promise
//  *                      Callback Arguments:
//  *                      - evenName       String: 
//  *                      - args           Array: (optional)
//  *                      - resultModifier Function: (optional)
//  *                      - onError        Function: (optional)
//  *                      - timemoutLocal  Number: (optional)  overrides `timeoutGlobal`
//  *                      - delayPromise   Promise: (optional) if supplied, will wait untils promise is finalized
//  * 
//  * @example Example 1: A simple message sent to the socket server with 15 seconds timeout
//  * ```javascript
//  * const socket = require('socket.io-client')(....)
//  * const emitter = PromisE.getSocketEmitter(socket, 15000, 0)
//  * const result = await emitter('message', ['Hello world'])
//  * ```
//  * 
//  * @example Example 2: Handle time out
//  * ```javascript
//  * const resultPromise = emitter('message', ['Hello world'])
//  * resultPromise
//  * .then(result => alert('Result received on time'))
//  * .catch(err => {
//  *     if (resultPromise.timeout) alert('Request is taking longer than expected')
//  *      resultPromise
//  *          .promise
//  *          .then(result => alert('Finally, got the result after the timeout'))
//  * })
//  * ```
//  */
// PromisE.getSocketEmitter = (
//     socket,
//     timeoutGlobal,
//     errorArgIndex = 0, // first argument in the call
//     callbackIndex = null, // null = last argument
// ) => (
//     eventName,
//     args = [],
//     resultModifier,
//     errorModifier,
//     timeoutLocal,
//     callbackIndexLocal = callbackIndex,
//     delayPromise
// ) => {
//         args = !isArr(args)
//             ? [args]
//             : args
//         const timeout = isPositiveNumber(timeoutLocal)
//             ? timeoutLocal
//             : timeoutGlobal
//         const getError = err => new Error(
//             isFn(errorModifier)
//             && errorModifier(err)
//             || err
//         )
//         const promise = new PromisE((resolve, reject) => {
//             const interceptor = async (...result) => {
//                 try {
//                     let err = isInteger(errorArgIndex) && result.splice(errorArgIndex, 1)[0]
//                     if (!!err) return reject(getError(err))

//                     result = result.length > 1
//                         ? result // if multiple values returned from the backend resolve with an array
//                         : result[0] // otherwise resolve with single value

//                     if (isFn(resultModifier)) result = await resultModifier(result)
//                 } catch (err) {
//                     console.log('PromisE.getSocketEmitter', { eventName, interceptorError: err })
//                 }
//                 resolve(result)
//             }
//             try {
//                 if (callbackIndexLocal === null) {
//                     // last item is the callback 
//                     args = [...args, interceptor]
//                 } else if (isFn(args[callbackIndexLocal])) {
//                     // replace exising callback
//                     args[callbackIndexLocal] = interceptor
//                 } else {
//                     // inject the callback at specific index
//                     args.splice(callbackIndexLocal, 0, interceptor)
//                 }
//                 // if a promise is supplied wait until it's resolved
//                 PromisE(delayPromise)
//                     .finally(() => socket.emit(eventName, ...args))
//             } catch (err) {
//                 reject(getError(err))
//             }
//         })

//         return !isPositiveNumber(timeout)
//             ? promise
//             : PromisE.timeout(timeout, promise)
//     }
