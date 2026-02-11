import type {
	DeferredOptions,
	PositiveNumber,
	ValueOrPromise,
} from '@superutils/core'
import type { IPromisE } from './PromisEBase'

/** Return type of `PromisE.deferred()` */
export type DeferredAsyncCallback<TArgs extends unknown[] | [] = []> = <
	TResult = unknown,
>(
	promise: Promise<TResult> | ((...args: TArgs) => Promise<TResult>),
) => IPromisE<TResult>

export type GetPromiseFunc<T> = <TResult = T>() => Promise<TResult>

/** Default options used by `PromisE.deferred` and related functions */
export type DeferredAsyncDefaults<ThisArg = unknown, Delay = unknown> = Pick<
	Required<DeferredAsyncOptions<ThisArg, Delay>>,
	'resolveError' | 'resolveIgnored'
> & {
	delayMs: number
}

/** Options for `PromisE.deferred` and other related functions */
export type DeferredAsyncOptions<ThisArg = unknown, Delay = unknown> = {
	/**
	 * Delay in milliseconds, used for `debounce` and `throttle` modes. Use `0` for sequential execution.
	 *
	 * Use `0` to disable debounce/throttle and execute all operations sequentially.
	 *
	 * Default: `100` (or whatever is set in `PromisE.deferred.defaults.delayMs`)
	 */
	delayMs?: 0 | PositiveNumber<Delay>

	/**
	 * Whether to ignore (based on `resolveIgnored` settings) stale promises.
	 * In debounce/throttle mode, when an older promise is resolved after a newly resolved promise,
	 * the older one is considered stale.
	 *
	 * Default: `false`
	 */
	ignoreStale?: boolean

	/**
	 * Whenever a promise/function is ignored when in debounce/throttle mode, `onIgnored` wil be invoked.
	 * The promise/function will not be invoked, unless it's manually invoked using the `ignored` function.
	 * Use for debugging or logging purposes.
	 */
	onIgnore?: (
		this: ThisArg,
		ignored: GetPromiseFunc<unknown>,
	) => ValueOrPromise<unknown>

	/**
	 * Whenever a promise/function is executed successfully `onResult` will be called.
	 * Those that are ignored but resolve with last will not cause `onResult` to be invoked.
	 *
	 * Result can be `undefined` if `ResolveIgnored.WITH_UNDEFINED` is used.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onResult?: (this: ThisArg, result?: any) => ValueOrPromise<unknown>

	/**
	 * Indicates what to do when a promise in the queue is ignored.
	 * See {@link ResolveIgnored} for available options.
	 */
	resolveIgnored?: ResolveIgnored

	/**
	 * What do to when an executed function/promise throws error
	 * See {@link ResolveError} for available options.
	 */
	resolveError?: ResolveError
} & (Delay extends 0
	? {
			throttle?: false
			/** Callback invoked whenever promise/function throws error */
			onError?: (this: ThisArg, err: unknown) => ValueOrPromise<unknown>
			/** The value to be used as "thisArg" whenever any of the callbacks are invoked */
			thisArg?: ThisArg
		}
	: DeferredOptions<ThisArg>)

/** Determines what to do when deferred promise/function fails */
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

/**
 * Determines what to do when a promise/callback is ignored, either because of being
 * deferred, throttled or another been prioritized.
 */
export enum ResolveIgnored {
	/** Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks. */
	NEVER = 'NEVER',
	/** (default) resolve with active promise result, the one that caused the current promise/callback to be ignored. */
	WITH_LAST = 'WITH_LAST',
	/** resolve with `undefined` value */
	WITH_UNDEFINED = 'WITH_UNDEFINED',
}
