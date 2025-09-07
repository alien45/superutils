export interface IPromisE<T = unknown> extends Promise<T> {

    /** callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve/reject methods */
    onEarlyFinalize: OnEarlyFinalize<T>[]
    
    /** Indicates if the promise is still pending/unfinalized */
    readonly pending: boolean
    
    /** Reject pending promise early. */
    reject: (reason: any) => IPromisE<T>

    /** Indicates if the promise has been rejected */
    readonly rejected: boolean

    /** Resovle pending promise early. */
    resolve: (value: T) => IPromisE<T>

    /** Indicates if the promise has been resolved */
    readonly resolved: boolean
}

/* Describes a delay PromisE and it's additional properties. */
export interface IPromisE_Delay<T = unknown> extends IPromisE<T> {
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
    timeoutId: Parameters<typeof clearTimeout>[0]
}

/**
 * Descibes a timeout PromisE and it's additional properties.
 */
export type IPromisE_Timeout<T = unknown> = IPromisE<T> & { 
    /** The result/data promise. If more than one supplied in `args` result promise will be a combined `PromisE.all` */
    data: IPromisE<T>
    /** A shorthand getter to check if the promise has timed out. Same as `promise.timeout.rejected`. */
    readonly timedout: boolean
    /** Clearing the timeout will prevent it from timing out */
    clearTimeout: () => void
    /** The timeout promise */
    timeout: IPromisE_Delay<T>
}

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

export type PostBody = Record<string, unknown> | BodyInit | null

export type PromiseParams<T = unknown> = ConstructorParameters<typeof Promise<T>>

export type PromisE_Deferred_Options = {
    // defer?: number,
    onError?: (err: Error) => void,
    /**
     * Use for debugging or logging purposes only.
     */
    // onIgnore?: <TResult = TData>(ignored: (() => Promise<TResult>)) => void,
    onIgnore?: (ignored: (() => Promise<any>)) => any,

    // onResult?: <TResult = TData>(result: TResult | undefined) => void | Promise<void>,
    onResult?: (result: any | undefined) => any | IPromisE<any>,

    /** 
     * Indicates what to do when a promise in the queue is ignored.
     * See {@link ResolveIgnored} for available options.
     */
    resolveIgnored?: ResolveIgnored,
    /** If true will gracefully ignore eny exception while invoking any callback function provided */
    silent?: boolean,
    /** If provided will be used as the "thisArg" when invoking any of the provided callback functions */
    thisArg?: unknown,
    // throttle?: boolean,
} & ({ defer?: number, throttle?: undefined } | { defer: number, throttle: boolean })

export type PromisE_FetchArgs = [
    url: string | URL,
    options?: FetchOptions,
    timeout?: number,
    abortCtrl?: AbortController,
    errMsgs?: {
        invalidUrl: string,
        reqTimedout: string,
    }
]
export type PromisE_FetchDeferredArgs = [
    url?: string | URL,
    options?: FetchOptions,
    timeout?: number,
    errMsgs?: {
        invalidUrl: string,
        reqTimedout: string,
    }
]

export type PromisE_PostArgs = [
    url: string | URL,
    data?: PostBody,
    options?: Omit<FetchOptions, 'method'>,
    timeout?: number,
    abortCtrl?: AbortController,
]

export type PromisE_PostDeferredArgs = [
    url?: string | URL,
    data?: PostBody,
    options?: Omit<FetchOptions, 'method'>,
    timeout?: number,
    // abortCtrl?: AbortController,
]

/** Describes PromisE with with resolvers */
export type PromisE_WithResolvers<T = unknown> = { promise: IPromisE<T> }
    & Omit<ReturnType<typeof Promise.withResolvers<T>>, 'promise'>

/** Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized. */
export enum ResolveIgnored {
    /** Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks. */
    NEVER = 'NEVER',
    /** (default) resolve with active promise result, the one that caused the current promise/callback to be ignored).  */
    WITH_LAST = 'WITH_LAST',
    /** resolve with `undefined` value */
    WITH_UNDEFINED = 'WITH_UNDEFINED',
}