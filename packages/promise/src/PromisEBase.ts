import {
    asAny,
    asAny,
    isFn,
    isPromise
} from '@utiils/core'
import {
    PromisE_WithResolvers,
    OnEarlyFinalize,
    PromiseParams,
    IPromisE,
    ResolveIgnored,
 } from './types'

/** 
 * @class PromisEBase
 * @summary attempts to solve a simple problem of Promise status (resolved/rejected) not being accessible externally.
 * 
 * For more example see static functions like `PromisE.deferred}, `PromisE.fetch}, `PromisE.timeout} etc.
 *
 * ---
 *
 * @example ```javascript
 * // Examples of how to use `PromisE`.
 * 
 * // Example 1: As a drop-in replacement for `Promise` class
 * const p = new PromisE((resolve, reject) => resolve('done'))
 * console.log(
 *  p.pending, // Indicates if promise has finalized (resolved/rejected)
 *  p.resolved, // Indicates if the promise has resolved
 *  p.rejected // Indicates if the promise has rejected
 * ) 
 * 
 * // Example 2: Extend an existing `Proimse` instance to check status
 * const p = new PromisE(promiseInstance)
 * console.log(p.pending)
 * 
 * // 3. Invoke functions
 * const p = PromisE.try(() => { throw new Error('I am a naughty function' ) })
 * p.catch(console.error)
 * console.log(p.pending)
 * ```
 */
export class PromisEBase<T = unknown> extends Promise<T> implements IPromisE<T> {
    private _resolve?: ((value: T) => void)
    private _reject?: (reason: any) => void
    
    static defaultResolveIgnored = ResolveIgnored.WITH_LAST

    /** callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve()/reject() methods */
    public onEarlyFinalize: OnEarlyFinalize<T>[] = []
    
    constructor(...args: PromiseParams<T>)
    constructor(promise: Promise<T>)
    constructor(data: T)
    constructor(input: Promise<T> | PromiseParams<T>[0]) {
        if (input instanceof PromisEBase) return input

        const superArg = isFn(input)
            ? input
            : ((resolve, reject) => {
                isPromise(input)
                    ? input.then(resolve, reject)
                    : resolve(input)
            }) as PromiseParams<T>[0]
        super(superArg)
        setTimeout(() => {
            super.then(
                () => asAny(this).resolved = true,
                () => asAny(this).rejected = true,
            ).finally(() => asAny(this).pending = false)
        })

        //
        // reduced original
        //
        // const promise = isPromise(input)
        //     ? input
        //     : !isFn(input)
        //         ? Promise.resolve<T>(input)
        //         : new Promise<T>(input)

        // super(async (resolve, reject) => {
        //     setTimeout(() => {
        //         this._resolve = resolve
        //         this._reject = reject
        //     })
        //     try {
        //         const value = await (
        //             isFn(input)
        //                 ? (async () => {
        //                     const pwr = Promise.withResolvers<T>()
        //                     input(pwr.resolve, pwr.reject)
        //                     return pwr.promise
        //                 })()
        //                 : isPromise(promise)
        //                     ? promise
        //                     : input
        //         )
        //         resolve(value)
        //         asAny(this).resolve = true
        //     } catch (err) {
        //         reject(err)
        //         asAny(this).rejected = true
        //     } finally {
        //         asAny(this).pending = false
        //     }
        // })

        //
        // Original
        //
        // const promise = isPromise(input)
        //     ? input
        //     : !isFn(input)
        //         ? Promise.resolve<T>(input)
        //         : new Promise<T>(input)

        // super((resolve, reject) => {
        //     setTimeout(() => {
        //         this._resolve = resolve
        //         this._reject = reject
        //     })
        //     promise.then(
        //         value => {
        //             resolve(value)
        //             asAny(this).resolved = true
        //             asAny(this).pending = false
        //         },
        //         err => {
        //             reject(err)
        //             asAny(this).rejected = true
        //             asAny(this).pending = false
        //         }
        //     )
        // })
    }
    
    //
    //
    //-------------------- Status related read-only attributes --------------------
    //
    //

    /** Indicates if the promise is still pending/unfinalized */
    public readonly pending: boolean = true

    /** Indicates if the promise has been rejected */
    public readonly rejected: boolean = false

    /** Indicates if the promise has been resolved */
    public readonly resolved: boolean = false

    //
    //
    // --------------------------- Early resolve/reject ---------------------------
    //
    //

    /** Resovle pending promise early. */
    public resolve = (value: T) => {
        this.pending && setTimeout(() => {
            this._resolve?.(value)
            this.onEarlyFinalize.forEach(fn => Promise.try(fn, true, value))
        })
        return this as IPromisE<T>
    }

    /** Reject pending promise early. */
    public reject = (reason: any) => {
        this.pending && setTimeout(() => {
            this._reject?.(reason)
            this.onEarlyFinalize.forEach(fn => Promise.try(fn, false, reason))
        })
        return this as IPromisE<T>
    }


    //
    //
    // Extend all static `Promise` methods
    //
    //

    /** Sugar for `new PromisE(Promise.all(...))` */
    static all = <T extends readonly unknown[] | []>(values: T) => new PromisEBase(
        Promise.all<T>(values)
    ) as IPromisE<{ -readonly [P in keyof T]: Awaited<T[P]> }>

    /** Sugar for `new PromisE(Promise.allSettled(...))` */
    static allSettled = <T extends unknown[]>(values: T) => new PromisEBase(
        Promise.allSettled<T>(values)
    ) as IPromisE<PromiseSettledResult<Awaited<T[number]>>[]>

    /** Sugar for `new PromisE(Promise.any(...))` */
    static any = <T extends unknown[]>(values: T) => new PromisEBase(
        Promise.any<T>(values)
    ) as IPromisE<T[number]>

    /** Sugar for `new PromisE(Promise.race(..))` */
    static race = <T>(values: T[]) => new PromisEBase(Promise.race(values)) as IPromisE<Awaited<T>>

    /** Extends Promise.reject */
    static reject = <T = never>(reason: any) => {
        const { promise, reject } = PromisEBase.withResolvers<T>()
        setTimeout(() => reject(reason)) // required to avoid unhandled rejection
        return promise
    }

    /** Sugar for `new PromisE(Promise.resolve(...))` */
    static resolve = <T>(value?: T) => new PromisEBase<T>(
        Promise.resolve<T>(value as T)
    ) as IPromisE<T>

    /** Sugar for `new PromisE(Promise.try(...))` */
    static try = <T, U extends unknown[]>(
        ...args: Parameters<typeof Promise.try<T, U>>
    ) => new PromisEBase(
        Promise.try<T, U>(...args)
    ) as IPromisE<Awaited<T>>

    /** Creates a new {@link IPromisE} instance and returns it in an object, along with its `resolve` and `reject` functions. */
    static withResolvers = <T = unknown>(): PromisE_WithResolvers<T> => {
        const pwr = Promise.withResolvers<T>()
        const promise = new PromisEBase<T>(pwr.promise) as IPromisE<T>
        return { ...pwr, promise }
    }
}
export default PromisEBase