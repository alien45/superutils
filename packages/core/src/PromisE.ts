// ToDo: remove dependency to utiils/rx?
// import { BehaviorSubject, subjectAsPromise } from '@utiils/rx'
import deferred from './deferred'
import { fallbackIfFails } from './fallbackIfFails'
import {
    isArr,
    isAsyncFn,
    isError,
    isFn,
    isInteger,
    isObj,
    isPositiveInteger,
    isPositiveNumber,
    isPromise,
    isStr,
    isValidURL,
} from './is'
import { AsyncFn, TimeoutId } from './types'

const textsCap = {
    invalidUrl: 'Invalid URL',
    reqTimedout: 'Request timed out',
    timedout: 'Timed out after',
}
export interface PromisEType<T = unknown> extends Promise<T> {
    pending: Boolean,
    rejected: Boolean,
    resolved: Boolean,
}
export type PromisEWithResolvers<T = unknown> = { promise: PromisE<T> }
    & Omit<ReturnType<typeof Promise.withResolvers<T>>, 'promise'>
export type PromiseParams<T = unknown> = ConstructorParameters<typeof Promise<T>>
export type ExecutorFunc<T = unknown> = PromiseParams<T>[0]
export type PromisE_Delay<T = unknown> = PromisE<T> & {
    /**
     * Caution: pausing will prevent the promise from ever resolving/rejeting and leaving it for the garbage collector.
     * If the promise must either resolved, use the `continue()` method
     */
    pause: () => void
    /* Reject the un-/paused delay promise. */
    reject: (err: Error) => void
    /* Resolve the un-/paused delay promise. */
    resolve: (value?: T) => void
    timeoutId: TimeoutId
}
export type PromisE_Timeout<T = unknown> = PromisE<T> & { 
    /** The result/data promise. If more than one supplied in `args` result promise will be a combined `PromiE.all` */
    data: PromisE<T>
    timedout: boolean
    /** Clearing the timeout will prevent it from timing out */
    clearTimeout: () => void
    /** The timeout promise */
    timeout: PromisE_Delay<Error>
}

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
    private _pending = true
    private _resolved = false
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
              
        super((resolve, reject) => (async () => {
            try {
                const value = await promise
                this._resolved = true
                resolve(value)
            } catch (err) {
                this._rejected = true
                reject(err)
            }
            this._pending = false
        })())
    }

    public get pending () { return this._pending }
    public get rejected () { return this._rejected }
    public get resolved () { return this._resolved }

    /**
     * @name    PromisE.delay
     * @summary Creates a promise that completes after given delay/duration.
     * 
     * @param {Number}    delayMs   duration in milliseconds
     * @param {unknown}   result    (optional) specify a value to resolve or reject with.
     *                              Default: `delayMs` when resolved or timed out error when rejected
     * @param {boolean}   asRejected (optional) if `true`, will reject the promise after the delay.
     * 
     * @example ```javascript
     * console.log('Waiting for app initialization or something else to be ready')
     * // wait 3 seconds before proceeding
     * await PromisE.delay(3000)
     * console.log('App ready')
     * ```
     */
    static delay = <T = number>(
        delayMs: number,
        result: T = delayMs as T,
        asRejected: boolean = false
    ): PromisE_Delay<T> => {
        const { 
            promise: _promise,
            reject,
            resolve
        } = PromisE.withResolvers<T>()
        const promise = _promise as PromisE_Delay<T>
        const finalize = (result?: T | Error, doReject = false) => {
            if (!promise.pending) return
            
            // clear the timeout
            promise.pause()

            !doReject 
                ? resolve((result ?? delayMs) as T)
                : reject(result ?? new Error(`${textsCap.timedout} ${delayMs}ms`))
        }
        promise.timeoutId = setTimeout(
            () => finalize(result, asRejected),
            delayMs
        )
        promise.pause = () => clearTimeout(promise.timeoutId)
        promise.reject = error => finalize(error, true)
        promise.resolve = (value = result) => finalize(value, false)
        return promise
    }

    /**
     * @name    PromisE.delay
     * @summary Creates a promise that rejects after given delay/duration.
     * 
     * @example ```javascript
     * console.log('Will reject after 3 seconds')
     * const rejectPromise = PromisE.delay(3000, new Error('App did not initialization on time'))
     * const intervalId = setInterval(() => {
     *     if (appReady()) rejectPromise.cancel('resolves with a string so that execution continues')
     * })
     * await rejectPromise
     * clearInterval(intervalId)
     * ```
     */
    static delayReject = <T = unknown>(
        delay: number,
        reason?: T,
    ) => PromisE.delay(
        delay,
        reason,
        true
    )

    /**
     * @name    PromisE.fetch
     * @summary makes a fetch request and returns Response.
     * Default options.headers["content-type"] is 'application/json'.
     * Will reject promise if response status code is 2xx (200 <= status < 300).
     * 
     * @param   {string|URL} url
     * @param   {String}    options.method  (optional) Default: `"get"`
     * @param   {Number}    timeout         (optional) duration in milliseconds to abort the request if it takes longer.
     */
    static fetch = <T = unknown>(
        ...args: Parameters<typeof PromisE.fetchRaw>
    ): PromisE<T> => new PromisE<T>(
        PromisE
        .fetchRaw(...args)
        .then(response => response.json())
    )

    /**
     * @name    PromisE.fetchRaw
     * @summary makes a fetch request and returns Response.
     * Does not return an instance of `PromisE`.
     */
    static fetchRaw = async (
        url: string | URL,
        options?: RequestInit,
        timeout?: number,
      ) => {
        if (!isValidURL(url, false)) throw new Error(textsCap.invalidUrl)

        options = isObj(options) && options || {}
        options.method ??= 'get'
        let timeoutId: TimeoutId
        if (isPositiveNumber(timeout)) {
            const abortCtrl = new AbortController()
            timeoutId = setTimeout(() => abortCtrl.abort(), timeout)
            options.signal = abortCtrl.signal
        }

        const response = await fetch(url.toString(), options)
            .catch(err => Promise.reject(
                err?.name === 'AbortError'
                    ? new Error(textsCap.reqTimedout)
                    : err
            ))
            .finally(() => timeoutId && clearTimeout(timeoutId))
        const { status = 0 } = response || {}
        const isSuccess = status >= 200 && status < 300
        if (!isSuccess) {
            const json = await response.json() || {}
            const message = json.message || `Request failed with status code ${status}. ${JSON.stringify(json || '')}`
            const error = new Error(`${message}`.replace('Error: ', ''))
            throw error
        }

        return response
    }
    
    /**
     * @name    PromisE.post
     * @summary make a HTTP "POST" request and return result as JSON.
     * Default "content-type" is 'application/json'.
     * Will reject promise if response status code is 2xx (200 <= status < 300).
     */
    static post = <T = unknown> (...args: Parameters<typeof PromisE.postRaw>) => new PromisE<T>(
        PromisE
            .postRaw(...args)
            .then(response => response.json())
    )

    /**
     * @name    PromisE.postRaw
     * @summary makes a HTTP "POST" request and returns Response.
     * Does not return an instance of `PromisE`.
     */
    static postRaw = (
        url: string,
        data?: Pick<RequestInit, 'body'>,
        options?: Omit<RequestInit, 'method'>,
        timeout?: number,
    ) => PromisE.fetchRaw(
        url,
        {
            ...options,
            body: !isStr(data)
                ? JSON.stringify(data)
                : data,
            headers: {
                'content-type': 'application/json',
                ...options?.headers,
            },
            method: 'POST',
        },
        timeout
    )

    // /**
//  * @name    PromisE.timeout
//  * @summary times out a promise after specified timeout duration.
//  * 
//  * @param {Number}      timeout  (optional) timeout duration in milliseconds. 
//  *                               Default: `10000`
//  * @param {...Promise}  promise  promise/function: one or more promises as individual arguments
//  * 
//  * @example Example 1: multiple promises
//  * ```javascript
//  *    PromisE.timeout(
//  *      30000, // timeout duration
//  *      Promise.resolve(1)
//  *    )
//  *    // Result: 1
//  * ```
//  *
//  * @example Example 2: multiple promises
//  *
//  * ```javascript
//  *    PromisE.timeout(
//  *      30000, // timeout duration
//  *      Promise.resolve(1),
//  *      Promise.resolve(2),
//  *      Promise.resolve(3),
//  *    )
//  *    // Result: [ 1, 2, 3 ]
//  * ```
//  * 
//  * @example Example 3: default timeout duration 10 seconds
//  * ```javascript
//  *    const promise = PromisE.timeout(PromisE.delay(20000))
//  *    promise.catch(err => {
//  *          if (promise.timeout) {
//  *              // request timed out
//  *              alert('Request is taking longer than expected......')
//  *              promise.promise.then(result => alert(result))
//  *              return
//  *          }
//  *          alert(err)
//  *      })
//  *```
//  * @returns {PromisE} resultPromise
//  */
// PromisE.timeout = (...args) => {
//     const timeoutIndex = args.findIndex(isPositiveNumber)
//     const timeout = timeoutIndex >= 0
//         && args.splice(timeoutIndex, 1)
//         || 10000
//     // use all arguments except last one
//     const promiseArgs = args
//     const promise = promiseArgs.length === 1
//         ? PromisE(promiseArgs[0]) // makes sure single promise resolves to a single result
//         : PromisE.all(promiseArgs)
//     let timeoutId
//     const timeoutPromise = new PromisE((_, reject) =>
//         // only reject if it's still pending
//         timeoutId = setTimeout(() => {
//             if (!promise.pending) return

//             resultPromise.timeout = true
//             reject(textsCap.timedout)
//         }, timeout)
//     )
//     const resultPromise = PromisE.race([promise, timeoutPromise])
//     resultPromise.promise = promise
//     resultPromise.timeoutId = timeoutId
//     resultPromise.clearTimeout = () => clearTimeout(timeoutId)
//     resultPromise.timeoutPromise = timeoutPromise
//     return resultPromise
// }

    /**
     * @name    PromisE.timeout
     * @summary times out a promise after specified timeout duration.
     * 
     * @param {Number}      timeout  (optional) timeout duration in milliseconds. 
     *                               Default: `10000`
     * @param {...Promise}  promise  promise/function: one or more promises as individual arguments
     * 
     * @example Example 1: single promise - resolved
     * ```javascript
     *      PromisE.timeout(
     *        5000, // timeout after 5000ms
     *        PromisE.delay(1000), // resolves after 1000ms with value 1000
     *      ).then(console.log)
     *    // Result: 1000
     * ```
     *
     * @example Example 2: multiple promises - resolved
     *
     * ```javascript
     *    PromisE.timeout(
     *      5000, // timeout after 5000ms
     *      PromisE.delay(1000), // resolves after 1000ms with value 1000
     *      PromisE.delay(2000), // resolves after 2000ms with value 2000
     *      PromisE.delay(3000), // resolves after 3000ms with value 3000
     *    ).then(console.log)
     *    // Result: [ 1000, 2000, 3000 ]
     * ```
     * 
     * @example Example 3: timed out & rejected
     * ```javascript
     *    PromisE.timeout(
     *      5000, // timeout after 5000ms
     *      PromisE.delay(20000), // resolves after 20000ms with value 20000
     *    ).catch(console.error)
     *    // Error: Error('Timed out after 5000ms')
     *```
     * 
     * @example Example 4: timed out & but not rejected.
     * // Eg: when API request is taking longer than expected, print a message but not reject the promise.
     * ```javascript
     * const promise = PromisE.timeout(
     *   5000, // timeout after 5000ms
     *   PromisE.delay(20000), // data promise, resolves after 20000ms with value 20000
     * )
     * const data = await promise.catch(err => {
     *     // promise did not time out, but was rejected because one of the data promises rejected
     *     if (!promise.timeout.rejected) return Promise.reject(err)
     * 
     *     // promise timed out >> print/update UI
     *     console.log('Request is taking longer than expected......')
     *     // now return the data promise (the promise(s) provided in the PromisE.timeout())
     *     return promise.data
     * })
     *```
    */
    static timeout = <
        T extends readonly unknown[] | [],
        TOut = T['length'] extends 1
            ? Awaited<T[0]>
            : { -readonly [K in keyof T]: Awaited<T[K]>}
    >(
        timeout: number = 10000,
        ...values: T
    ): PromisE_Timeout<TOut> => {
        const dataPromise = (
            values.length === 1
                ? new PromisE(values[0]) // single promise resolves to a single result
                : PromisE.all(values) // array of promises resolves to an array of results
        ) as PromisE<TOut>
        const timeoutPromise = PromisE.delayReject<Error>(timeout)
        const promise = PromisE.race([
            dataPromise,
            timeoutPromise
        ]) as PromisE_Timeout<TOut>
        promise.clearTimeout = () => clearTimeout(timeoutPromise.timeoutId)
        promise.data = dataPromise
        promise.timeout = timeoutPromise
        // make sure to 
        dataPromise
            .catch(e => e) // prevents unhandled rejection here
            .finally(promise.clearTimeout)
        return promise
    }

    /*
     * ---------------------------- Sugary bits -----------------------------
     */

    /** 
     * @name    PromisE.all
     * @summary sugar for `new PromisE(Promise.all(...))`
     */
    static all = <
        T extends readonly unknown[] | [],
    >(values: T) => new PromisE(
        Promise.all<T>(values)
    )

    /** 
     * @name    PromisE.all
     * @summary sugar for `new PromisE(Promise.allSettled(...))`
     */
    // static allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }>
    // static allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>
    static allSettled <T extends readonly unknown[] | []>(values: T) {
        return new PromisE(
            Promise.allSettled<T>(values)
        )
    }

    /** 
     * @name    PromisE.any
     * @summary sugar for `new PromisE(Promise.any(...))`
     */
    static any<T extends readonly unknown[] | []>(values: T): PromisE<Awaited<T[number]>>
    static any<T>(values: Iterable<T | PromiseLike<T>>): PromisE<Awaited<T>>
    static any <T extends readonly unknown[]>(values: T) {
        return new PromisE(
            Promise.any<T>(values)
        )
    }

    /** 
     * @name    PromisE.race
     * @summary sugar for `new PromisE(Promise.race(..))`
     */
    static race = <T>(values: T[]) => new PromisE(
        Promise.race(values)
    )

    /**
     * Sugar for `new PromisE(Promise.reject(...))`
     */
    static reject = (reason: any) => new PromisE(Promise.reject(reason))

    /**
     * Sugar for `new PromisE(Promise.resolve(...))`
     */
    static resolve(): PromisE<void>
    static resolve<T>(value: T | PromiseLike<T>): PromisE<T>
    static resolve<T = void>(value?: T | PromiseLike<T>): PromisE<T>
    static resolve(value?: unknown): PromisE<unknown> {
        return new PromisE(Promise.resolve(value))
    }

    /**
     * Sugar for `new PromisE(Promise.try(...))`
     */
    static try = <T, U extends unknown[]>(
        ...args: Parameters<typeof Promise.try<T, U>>
    ) => new PromisE<Awaited<T>>(
        Promise.try<T, U>(...args)
    )

    /**
     * Sugar for `new PromisE(Promise.resolve(...))`
     */
    static withResolvers = <T = unknown>(): PromisEWithResolvers<T> => {
        const res = Promise.withResolvers<T>()
        return {
            ...res,
            promise: new PromisE<T>(res.promise),
        }
    }
}

// const promises = [
//     Promise.resolve(1),
//     Promise.resolve('2'),
//     Promise.resolve(false),
// ] as const

// const tout = PromisE.timeout(1000, promises)
// tout.then(x => console.log({x}))

// const all = Promise.all(promises)
// const all2 = PromisE.all(promises)
// all2.then(x => {})
// const all3 = new PromisE(Promise.all(promises))
// const race = Promise.race(promises)
// const race2 = PromisE.race([...promises])
// const as = Promise.allSettled(promises).then(x => x)
// const try1 = Promise.try(() => 2)
// const try2 = PromisE.try(() => PromisE.delay(2000).then(x => `${x}`))
// const b = PromisE.post<{a: string}>(
//     'https://google.com',
//     {},
//     {},
//     100,
// )

// export default function PromisE<T = unknown>(
//     promise: any, // ToDo: add types
//     ...args: unknown[]
// ): PromisEReturn<T> {
//     if (!(promise instanceof Promise)) {
//         try {
//             // supplied is not a promise instance
//             // check if it is an uninvoked async function
//             promise = isPromise(promise)
//                 ? promise
//                 : isAsyncFn(promise) // may or may not work on nodejs with webpack & babel
//                     ? promise.apply(null, args) // pass rest of the arguments to the async function (args[0])
//                     : isFn(promise)
//                         ? new Promise(promise)
//                         : Promise.resolve(promise) // anything else resolve as value
//         } catch (err) {
//             // something unexpected happened!
//             promise = Promise.reject(err)
//         }
//     }

//     promise.pending = true
//     promise.resolved = false
//     promise.rejected = false
//     promise
//         .then(
//             () => promise.resolved = true,
//             () => promise.rejected = true
//         )
//         .finally(() => promise.pending = false)
//     return promise
// }

// /** 
//  * @name PromisE.deferred
//  * @summary the adaptation of the `deferred()` function tailored for Promises.
//  * 
//  *
//  * @param   {Function}  callback    (optional)
//  * @param   {Number}    defer       (optional)
//  * @param   {Object}    conf        (optional)
//  * @param   {Function}  conf.onError   (optional)
//  * @param   {Function}  conf.onIgnore  (optional) invoked whenever callback invocation is ignored by a newer invocation
//  * @param   {Function}  conf.onResult  (optional)
//  * @param   {Boolean}   conf.strict    (optional) only used if `throttle` is truthy.
//  *                                     Default: `false`
//  * @param   {Boolean}   conf.throttle  (optional) Default: `false`
//  * 
//  * @description The main difference is that:
//  *  - Notes: 
//  *      1. A "request" simply means invokation of the returned callback function
//  *      2. By "handled" it means a "request" will be resolved or rejected.
//  *  - `PromisE.deferred` is to be used with promises/functions
//  *  - There is no specific time delay.
//  *  - The time when a request is completed is irrelevant. 
//  *  - If not throttled:
//  *      1. Once a request is handled, all previous requests will be ignored and pool starts anew.
//  *      2. If a function is provided in the  returned callback, ALL of them will be invoked, regardless of pool size.
//  *      3. The last/only request in an on-going requests' pool will handled (resolve/reject).
//  *  - If throttled:
//  *      1. Once a requst starts executing, subsequent requests will be added to a queue.
//  *      2. The last/only item in the queue will be handled. Rest will be ignored.
//  *      3. If a function is provided in the returned callback, it will be invoked only if the requst is handled. 
//  *      Thus, improving performance by avoiding unnecessary invokations.
//  *      4. If every single request/function needs to be invoked, avoid using throttle.
//  * 
//  *  - If throttled and `strict` is truthy, all subsequent request while a request is being handled will be ignored.
//  * 
//  * @example Explanation & example usage:
//  * <BR>
//  * ```javascript
//  * const example = throttle => {
//  *     const df = PromisE.deferred(throttle)
//  *     df(() => PromisE.delay(5000)).then(console.log)
//  *     df(() => PromisE.delay(500)).then(console.log)
//  *     df(() => PromisE.delay(1000)).then(console.log)
//  *     // delay 2 seconds and invoke df() again
//  *     setTimeout(() => {
//  *         df(() => PromisE.delay(200)).then(console.log)
//  *     }, 2000)
//  * }
//  * 
//  * // Without throttle
//  * example(false)
//  * // `1000` and `200` will be printed in the console
//  * 
//  * // with throttle
//  * example(true)
//  * // `5000` and `200` will be printed in the console
//  * 
//  * // with throttle with strict mode
//  * example(true)
//  * // `5000` will be printed in the console
//  * ```
//  * 
//  * @returns {Function} callback accepts only one argument and it must be a either a promise or a function
// */
// PromisE.deferred = (
//     callback,
//     defer,
//     {
//         onError = () => { },
//         onIgnore,
//         onResult, // result: whatever is returned from the callback on the execution/request that was "handled"
//         strict,
//         thisArg,
//         throttle = !!callback,
//     } = {}
// ) => {
//     let lastPromise
//     const ids = []
//     const queue = []
//     const done = (resolver, id) => result => {
//         const index = ids.indexOf(id)
//         // Ignore if:
//         // 1. this is not the only/last promise
//         // 2. if a previous promise has already resolved/rejected
//         if (index === -1 || index !== ids.length - 1) return
//         // invalidates all unfinished previous promises
//         resolver(result)
//         ids.splice(0)
//         lastPromise = null
//         const handler = queue
//             .splice(0)
//             .pop()
//         handler && handler()
//     }
//     let dp = promise => PromisE((resolve, reject) => {
//         const handler = () => {
//             const id = Symbol()
//             try {
//                 ids.push(id)
//                 promise = PromisE(
//                     isFn(promise)
//                         ? promise()
//                         : promise
//                 )
//                 lastPromise = promise
//                 promise.then(
//                     done(resolve, id),
//                     done(reject, id)
//                 )
//             } catch (err) {
//                 // execution failed while invoking promise()
//                 done(reject, id)
//             }
//         }
//         if (!throttle || !lastPromise) return handler()

//         // simply add subsequent requests to the queue and only execute/resolve the last in the queue
//         !strict && queue.push(handler)
//     })
//     // when a defer/delay is specified, only start executing after the specified delay
//     if (isPositiveNumber(defer)) dp = PromisE.deferredAsync(dp, defer)
//     if (!isFn(callback)) return dp

//     const cb = async (...args) => {
//         const result = await dp(() => callback.call(thisArg, ...args))
//             ?.catch(err => {
//                 const throwError = onError?.(err) !== false
//                 return throwError && Promise.reject(err) || undefined
//             })
//         onResult?.(result)?.catch(() => { })
//         return result
//     }

//     return cb
// }

// PromisE.deferredAsync = (
//     callback,
//     delay = 50,
//     tid,
// ) => async (...args) => {
//     clearTimeout(tid)
//     const emptySymbol = Symbol('empty')
//     const rxResult = new BehaviorSubject(emptySymbol)
//     tid = setTimeout(
//         () => rxResult.next(
//             // catch any error
//             (async () => await callback?.(...args))()
//         ),
//         delay,
//     )
//     const resultPromise = subjectAsPromise(
//         rxResult,
//         x => x !== emptySymbol,
//     )[0]
//     return await resultPromise
// }

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