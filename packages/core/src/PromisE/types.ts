import { TimeoutId } from '../types'
import { ResolveIgnored } from './deferred'
import PromisE from './PromisE'

export type ExecutorFunc<T = unknown> = PromiseParams<T>[0]

export type FetchOptions = Omit<RequestInit, 'headers'> & { 
    headers?: Record<string, string>
}

export type OnEarlyFinalize<T> = <
    TResolved extends boolean,
    TValue = TResolved extends true
        ? T
        : any
>(
    resolved: TResolved,
    resultOrReason: TValue
) => void | Promise<void>

export type PostArgs = Parameters<typeof PromisE.post>

export type PostBody = Record<string, unknown> | string | BodyInit | null

// export interface PromisEType<T = unknown> extends Promise<T> {
//     pending: Boolean,
//     rejected: Boolean,
//     resolved: Boolean,
// }

export type PromiseParams<T = unknown> = ConstructorParameters<typeof Promise<T>>

export type PromisE_withResolvers<T = unknown> = { promise: PromisE<T> }
    & Omit<ReturnType<typeof Promise.withResolvers<T>>, 'promise'>

export type PromisE_Deferred_Options<TDefault = unknown> = {
    defer?: number,
    onError?: (err: Error) => void,
    /**
     * Use for debugging or logging purposes only.
     */
    onIgnore?: (ignored: (() => Promise<TDefault>)) => void,
    onResult?: (result: TDefault | undefined) => void | Promise<void>,
    /** 
     * Indicates what to do when a promise in the queue is ignored.
     * See {@link ResolveIgnored} for available options.
     */
    resolveIgnored?: ResolveIgnored,
    /** If true will gracefully ignore eny exception while invoking any callback function provided */
    silent?: boolean,
    /** If provided will be used as the "thisArg" when invoking any of the provided callback functions */
    thisArg?: unknown,
    throttle?: boolean,
}

/* Describes a delay PromisE and it's additional properties. */
export type PromisE_Delay<T = unknown> = PromisE<T> & {
    /**
     * Caution: pausing will prevent the promise from resolving/rejeting automatically.
     * 
     * In order to finalize the promise either the `resolve()` or the `reject()` method must be invoked manually.
     * 
     * An never-finalized promise may cause memory leak and will leave it at the mercry of the garbage collector.
     * Use `pause()` only if you are sure.
     * 
     * ---
     * 
     * @example ```
     * // Example 1: SAFE => no memory leak, because no reference to the promise is stored and no suspended code
     * <button onClick={() => {
     *     const promise = PromisE.delay(1000).then(... do stuff ....)
     *     setTimeout(() => promise.pause(), 300)
     * }}>Click Me</button>
     * ```
     * 
     * ---
     * 
     * @example ```
     * // Example 2: UNSAFE => potential memory leak, because of suspended code
     * <button onClick={() => {
     *     const promise = PromisE.delay(1000)
     *     setTimeout(() => promise.pause(), 300)
     *     await promise // suspended code
     *     //... do stuff ....
     * }}>Click Me</button>
     * ```
     * 
     * ---
     * 
     * @example ```
     * // Example 3: UNSAFE => potential memory leak, because of preserved reference.
     * // Until the reference to promises is collected by the garbage collector, 
     * // reference to the unfinished promise will remain in memory.
     * const promises = []
     * <button onClick={() => {
     *     const promise = PromisE.delay(1000)
     *     setTimeout(() => promise.pause(), 300)
     *     promises.push(promise)
     * }}>Click Me</button>
     * ```
     */
    pause: () => void
    timeoutId: TimeoutId
}

/**
 * Descibes a timeout PromisE and it's additional properties.
 */
export type PromisE_Timeout<T = unknown> = PromisE<T> & { 
    /** The result/data promise. If more than one supplied in `args` result promise will be a combined `PromisE.all` */
    data: PromisE<T>
    timedout: boolean
    /** Clearing the timeout will prevent it from timing out */
    clearTimeout: () => void
    /** The timeout promise */
    timeout: PromisE_Delay<Error>
}