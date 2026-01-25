import {
	deferred as deferredSync,
	fallbackIfFails,
	isFn,
	isPositiveNumber,
	objCopy,
} from '@superutils/core'
import PromisEBase from './PromisEBase'
import {
	IPromisE,
	DeferredAsyncOptions,
	ResolveError,
	ResolveIgnored,
	DeferredAsyncCallback,
	GetPromiseFunc,
	DeferredAsyncDefaults,
} from './types'

/**
 * @function PromisE.deferred
 *
 * The adaptation of the `deferred()` function from `@superutils/core` tailored for Promises.
 *
 *
 * # Notes
 *
 * - A "request" simply means invokation of the returned callback function
 * - By "handled" it means a "request" will be resolved or rejected.
 * - `PromisE.deferred` is to be used with promises/functions.
 * `PromisE.deferredCallback` is for use with callback functions.
 * - There is no specific time delay.
 * - If a request takes longer than `delayMs`, the following request will be added to queue
 * and either be ignored or exectued based on the debounce/throttle configuration.
 * - If not throttled:
 *     1. Once a request is handled, all previous requests will be ignored and pool starts anew.
 *     2. If a function is provided in the  returned callback, ALL of them will be invoked, regardless of pool size.
 *     3. The last/only request in an on-going requests' pool will handled (resolve/reject).
 * - If throttled:
 *     1. Once a requst starts executing, subsequent requests will be added to a queue.
 *     2. The last/only item in the queue will be handled. Rest will be ignored.
 *     3. If a function is provided in the returned callback, it will be invoked only if the request is handled.
 *     Thus, improving performance by avoiding unnecessary invokations.
 *     4. If every single request/function needs to be invoked, avoid using throttle.
 * - If throttled and `strict` is truthy, all subsequent request while a request is being handled will be ignored.
 *
 * @param options (optional) Debounce/throttle configuration.
 *
 * The properties' default values can be overridden to be EFFECTIVE GLOBALLY:
 * ```typescript
 * deferred.defaults = {
 *     delayMs: 100,
 *     resolveError: ResolveError.REJECT,
 *     resolveIgnored: ResolveIgnored.WITH_LAST,
 * }
 * ```
 * @property options.delayMs   (optional) delay in milliseconds to be used with debounce & throttle modes. When `undefined` or `>= 0`, execution will be sequential.
 * @property options.onError   (optional)
 * @property options.onIgnore  (optional) invoked whenever callback invocation is ignored by a newer invocation
 * @property options.onResult  (optional)
 * @property options.resolveIgnored  (optional) see {@link ResolveIgnored}.
 * Default: `PromisE.defaultResolveIgnord` (changeable)
 *
 * @property options.throttle  (optional) toggle to switch between debounce/deferred and throttle mode.
 * Requires `defer`.
 * Default: `false`
 *
 * @returns Callback function that can be invoked in one of the followin 3 methods:
 * - sequential: when `delayMs <= 0`
 * - debounced: when `delayMs > 0` and `throttle = false`
 * - throttled: when `delayMs > 0` and `throttle = true`
 *
 * @example Debounce calls
 * ```typescript
 * const example = async (options = {}) => {
 * 	const df = PromisE.deferred({
 * 		delayMs: 100,
 * 		resolveIgnored: ResolveIgnored.NEVER, // never resolve ignored calls
 * 		...options,
 * 	})
 * 	df(() => PromisE.delay(500)).then(console.log)
 * 	df(() => PromisE.delay(1000)).then(console.log)
 * 	df(() => PromisE.delay(5000)).then(console.log)
 * 	// delay 2 seconds and invoke df() again
 * 	await PromisE.delay(2000)
 * 	df(() => PromisE.delay(200)).then(console.log)
 * }
 * example({ ignoreStale: false, throttle: false })
 * // `200` and `1000` will be printed in the console
 * example({ ignoreStale: true, throttle: false })
 * // `200` will be printed in the console
 * ```
 *
 * @example Throttle calls
 * ```typescript
 * const example = async (options = {}) => {
 * 	const df = PromisE.deferred({
 * 		delayMs: 100,
 * 		resolveIgnored: ResolveIgnored.NEVER, // never resolve ignored calls
 * 		...options,
 * 	})
 * 	df(() => PromisE.delay(5000)).then(console.log)
 * 	df(() => PromisE.delay(500)).then(console.log)
 * 	df(() => PromisE.delay(1000)).then(console.log)
 * 	// delay 2 seconds and invoke df() again
 * 	await PromisE.delay(2000)
 * 	df(() => PromisE.delay(200)).then(console.log)
 * }
 *
 * example({ ignoreStale: true, throttle: true })
 * // `200` will be printed in the console
 *
 * example({ ignoreStale: false, throttle: true })
 * // `200` and `5000` will be printed in the console
 * ```
 */
export function deferred<T = unknown, ThisArg = unknown, Delay = unknown>(
	options: DeferredAsyncOptions<ThisArg, Delay> = {},
): DeferredAsyncCallback {
	let sequence = 0
	options = objCopy(
		deferred.defaults as Record<string, unknown>,
		options as Record<string, unknown>,
		[],
		'empty',
	) as DeferredAsyncOptions<ThisArg, Delay>
	let { onError, onIgnore, onResult } = options
	const {
		delayMs = 0,
		ignoreStale,
		resolveError,
		resolveIgnored,
		thisArg,
		throttle,
	} = options
	interface QueueItem extends PromisEBase<unknown> {
		getPromise: GetPromiseFunc<T>
		result?: IPromisE<T>
		started: boolean
		sequence: number
	}
	let lastInSeries: QueueItem | null = null
	let lastExecuted: QueueItem
	const queue = new Map<symbol, QueueItem>()
	const isSequential = !isPositiveNumber(delayMs)

	if (thisArg !== undefined) {
		onError = onError?.bind(thisArg)
		onIgnore = onIgnore?.bind(thisArg)
		onResult = onResult?.bind(thisArg)
	}

	const handleIgnore = (items: [symbol, QueueItem][]) => {
		for (const [iId, iItem] of items) {
			queue.delete(iId)
			const isStale =
				ignoreStale && iItem.sequence < lastExecuted!.sequence
			if (iItem.resolved || (iItem.started && !isStale)) continue

			// prevent re-executing when a function is provided for execution instead of a direct promise
			if (iItem.started) {
				iItem.getPromise = (() => iItem.result) as GetPromiseFunc<T>
			}

			fallbackIfFails(onIgnore, [iItem.getPromise], 0)

			switch (resolveIgnored) {
				case ResolveIgnored.WITH_UNDEFINED:
					// resolve with undefined
					iItem.resolve(undefined as T)
					break
				case ResolveIgnored.WITH_LAST:
					// resolve/reject with most recent promise
					lastExecuted?.then(iItem.resolve, iItem.reject)
					break
				case ResolveIgnored.NEVER:
					// leave unresovled (potential memory leak if not handled properly by consumer)
					break
			}
		}
		if (!queue.size) sequence = 0
	}
	// after a queue item is executed, decide whether to ignore or proceed with remaining items in the queue
	const handleRemaining = (currentId: symbol) => {
		lastInSeries = null

		if (isSequential) {
			queue.delete(currentId)
			const [nextId, nextItem] = [...queue.entries()][0] || []
			return nextId && nextItem && handleItem(nextId, nextItem)
		}

		let items = [...queue.entries()]
		if (throttle === true && options.trailing) {
			// in throttle mode only ignore items before the current queue item
			const currentIndex = items.findIndex(([id]) => id === currentId)
			items = items.slice(0, currentIndex)
		} else if (!throttle) {
			// In deferred mode, prevent the last queue item from being ignored.
			// This is because there can possibly be more calls coming in.
			items = items.slice(0, -1)
		}
		handleIgnore(items)
		queue.delete(currentId)
	}
	const executeItem = async (id: symbol, qItem: QueueItem) => {
		try {
			qItem.started = true
			lastExecuted = qItem
			lastInSeries = qItem
			qItem.result ??= PromisEBase.try(qItem.getPromise) as IPromisE<T>
			const result = await qItem.result
			const isStale =
				!!ignoreStale && qItem.sequence < lastExecuted!.sequence
			if (isStale) return handleIgnore([[id, qItem]])

			qItem.resolve(result)
			onResult && fallbackIfFails(onResult, [result], undefined)
		} catch (err) {
			onError && fallbackIfFails(onError, [err], undefined)
			switch (resolveError) {
				case ResolveError.REJECT:
					qItem.reject(err as Error)
				// eslint-disable-next-line no-fallthrough
				case ResolveError.NEVER:
					break
				case ResolveError.WITH_UNDEFINED:
					qItem.resolve(undefined)
					break
				case ResolveError.WITH_ERROR:
					qItem.resolve(err)
					break
			}
		}
		handleRemaining(id)
	}
	// handle items in one of the following modes: sequential or deferred (debounce or throttle)
	const handleItem = isSequential
		? executeItem
		: deferredSync(
				executeItem,
				delayMs,
				options as Parameters<typeof deferredSync>[2],
			)

	return <TResult = T>(
		promise: Promise<TResult> | (() => Promise<TResult>),
	) => {
		const id = Symbol('deferred-queue-item-id')
		const qItem = new PromisEBase() as QueueItem
		qItem.getPromise = (
			isFn(promise) ? promise : () => promise
		) as GetPromiseFunc<TResult>
		qItem.started = false
		qItem.sequence = ++sequence
		queue.set(id, qItem)

		// Execute first item in a series.
		// Or, in throttle/debounce mode, send to respective delay function
		if (!lastInSeries || !isSequential) handleItem(id, qItem)

		return qItem as IPromisE<TResult>
	}
}
/** Global default values */
deferred.defaults = {
	/**
	 * Default delay in milliseconds, used in `debounce` and `throttle` modes.
	 *
	 * Use `0` (or negative number) to disable debounce/throttle and execute all operations sequentially.
	 */
	delayMs: 100,
	/** Set the default error resolution behavior. {@link ResolveError} for all options. */
	resolveError: ResolveError.REJECT,
	/** Set the default ignored resolution behavior. See {@link ResolveIgnored} for all options. */
	resolveIgnored: ResolveIgnored.WITH_LAST,
} satisfies DeferredAsyncDefaults
export default deferred
