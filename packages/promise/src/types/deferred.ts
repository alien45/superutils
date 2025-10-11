import { DeferredConfig, ThrottleConfig } from '@superutils/core'

export type DeferredOptions<ThisArg = unknown> = {
	/** Delay in milliseconds, used for `debounce` and `throttle` modes. */
	delayMs?: number

	/** Callback invoked whenever promise/function throws error */
	onError?: (err: any) => any | Promise<any>

	/**
	 * Whenever a promise/function is ignored when in debource/throttle mode, `onIgnored` wil be invoked.
	 * The promise/function will not be invoked, unless it's manually invoked using the `ignored` function.
	 * Use for debugging or logging purposes.
	 */
	onIgnore?: (ignored: () => Promise<any>) => any | Promise<any>

	/**
	 * Whenever a promise/function is executed successfully `onResult` will be called.
	 * Those that are ignored but resolve with last will not cause `onResult` to be invoked.
	 *
	 * Result can be `undefined` if `ResolveIgnored.WITH_UNDEFINED` is used.
	 */
	onResult?: (result?: any) => any | Promise<any>

	/**
	 * Indicates what to do when a promise in the queue is ignored.
	 * See {@link ResolveIgnored} for available options.
	 */
	resolveIgnored?: ResolveIgnored

	resolveError?: ResolveError

	/** Enable throttle mode. Requires {@link DeferredOptions.delayMs}*/
	throttle?: boolean
} & (
	| ({ delayMs: number; throttle: true } & ThrottleConfig<ThisArg>)
	| ({ delayMs?: number; throttle?: false | never } & DeferredConfig<ThisArg>)
)

/** Options for what to do when deferred promise/function fails */
export enum ResolveError {
	/** Neither resolve nor reject the failed */
	NEVER = 'NEVER',
	/** (default) Reject the failed as usual */
	REJECT = 'REJECT',
	/** Resolve (not reject) with the error/reason */
	WITH_ERROR = 'RESOLVE_ERROR',
	/** Resolve with undefined */
	WITH_UNDEFINED = 'RESOLVE_UNDEFINED',
}

/** Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized. */
export enum ResolveIgnored {
	/** Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks. */
	NEVER = 'NEVER',
	/** (default) resolve with active promise result, the one that caused the current promise/callback to be ignored).  */
	WITH_LAST = 'WITH_LAST',
	/** resolve with `undefined` value */
	WITH_UNDEFINED = 'WITH_UNDEFINED',
}
