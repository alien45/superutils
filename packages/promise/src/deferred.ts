import {
	deferred as deferredCore,
	fallbackIfFails,
	forceCast,
	isFn,
	isPositiveNumber,
	throttled as throttledCore,
} from '@superutils/core'
import PromisEBase from './PromisEBase'
import {
	IPromisE,
	DeferredOptions,
	ResolveError,
	ResolveIgnored,
	DeferredReturn,
} from './types'
import config from './config'

/**
 * @function PromisE.deferred
 * @summary the adaptation of the `deferred()` function tailored for Promises.
 *
 *
 * @param options           (optional) options
 * @param options.delayMs   (optional) delay in milliseconds to be used with debounce & throttle modes. When `undefined` or `>= 0`, execution will be sequential.
 * @param options.onError   (optional)
 * @param options.onIgnore  (optional) invoked whenever callback invocation is ignored by a newer invocation
 * @param options.onResult  (optional)
 * @param options.resolveIgnored  (optional) see {@link ResolveIgnored}.
 * Default: `PromisE.defaultResolveIgnord` (changeable)
 *
 * @param options.throttle  (optional) toggle to switch between debounce/deferred and throttle mode.
 * Requires `defer`.
 * Default: `false`
 *
 * @returns {Function} a callback that is invoked in one of the followin 3 methods:
 * - sequential: when `delayMs <= 0` or `delayMs = undefined`
 * - debounced: when `delayMs > 0` and `throttle = false`
 * - throttled: when `delayMs > 0` and `throttle = true`
 *
 * The main difference is that:
 *  - Notes:
 *      1. A "request" simply means invokation of the returned callback function
 *      2. By "handled" it means a "request" will be resolved or rejected.
 *  - `PromisE.deferred` is to be used with promises/functions
 *  - There is no specific time delay.
 *  - The time when a request is completed is irrelevant.
 *  - If not throttled:
 *      1. Once a request is handled, all previous requests will be ignored and pool starts anew.
 *      2. If a function is provided in the  returned callback, ALL of them will be invoked, regardless of pool size.
 *      3. The last/only request in an on-going requests' pool will handled (resolve/reject).
 *  - If throttled:
 *      1. Once a requst starts executing, subsequent requests will be added to a queue.
 *      2. The last/only item in the queue will be handled. Rest will be ignored.
 *      3. If a function is provided in the returned callback, it will be invoked only if the request is handled.
 *      Thus, improving performance by avoiding unnecessary invokations.
 *      4. If every single request/function needs to be invoked, avoid using throttle.
 *
 *  - If throttled and `strict` is truthy, all subsequent request while a request is being handled will be ignored.
 *
 * @example Explanation & example usage:
 * ```typescript
 * const example = throttle => {
 *     const df = PromisE.deferred(throttle)
 *     df(() => PromisE.delay(5000)).then(console.log)
 *     df(() => PromisE.delay(500)).then(console.log)
 *     df(() => PromisE.delay(1000)).then(console.log)
 *     // delay 2 seconds and invoke df() again
 *     setTimeout(() => {
 *         df(() => PromisE.delay(200)).then(console.log)
 *     }, 2000)
 * }
 *
 * // Without throttle
 * example(false)
 * // `1000` and `200` will be printed in the console
 *
 * // with throttle
 * example(true)
 * // `5000` and `200` will be printed in the console
 *
 * // with throttle with strict mode
 * example(true)
 * // `5000` will be printed in the console
 * ```
 */
export function deferred<T>(options: DeferredOptions = {}): DeferredReturn {
	const defaults = config.deferOptions
	let { onError, onIgnore, onResult } = options
	const {
		delayMs = defaults.delayMs,
		resolveError = defaults.resolveError, // by default reject on error
		resolveIgnored = defaults.resolveIgnored,
		thisArg,
		throttle = defaults.throttle,
	} = options
	let lastPromisE: IPromisE<unknown> | null = null
	interface QueueItem extends PromisEBase<unknown> {
		getPromise: () => Promise<unknown>
		started?: boolean
	}
	const queue = new Map<symbol, QueueItem>()
	const gotDelay = isPositiveNumber(delayMs)
	if (thisArg !== undefined) {
		onError = onError?.bind(thisArg)
		onIgnore = onIgnore?.bind(thisArg)
		onResult = onResult?.bind(thisArg)
	}
	const ignoreOrProceed = (currentId: symbol, qItem?: QueueItem) => {
		lastPromisE = null
		if (!gotDelay) {
			queue.delete(currentId)
			const [nextId, nextItem] = [...queue.entries()][0] || []
			return nextId && nextItem && execute(nextId, nextItem)
		}

		const items = [...queue.entries()]
		const currentIndex = items.findIndex(([id]) => id === currentId)
		for (let i = 0; i <= currentIndex; i++) {
			const [iId, iItem] = items[i]
			queue.delete(iId)
			if (iItem == undefined || iItem.started) continue

			onIgnore && fallbackIfFails(onIgnore, [iItem.getPromise], undefined)

			// Options for ignored
			// WITH_UNDEFINED: resolve with undefined
			// WITH_LAST: resolve/reject with most recent promise
			// NEVER: leave unresovled (potential memory leak if not handled properly by consumer)
			switch (resolveIgnored) {
				case ResolveIgnored.WITH_UNDEFINED:
					iItem.resolve(undefined as T)
					break
				case ResolveIgnored.WITH_LAST:
					qItem?.then(iItem.resolve, iItem.reject)
					break
				case ResolveIgnored.NEVER:
					// just ignore
					break
			}
		}
	}
	const finalizeCb =
		<TResolve extends true | false = true>(
			resolve: TResolve,
			id: symbol,
			qItem: QueueItem,
		) =>
		(resultOrErr: unknown) => {
			ignoreOrProceed(id, qItem)
			if (resolve) {
				qItem.resolve(resultOrErr)
				onResult && fallbackIfFails(onResult, [resultOrErr], undefined)
				return
			}

			onError && fallbackIfFails(onError, [resultOrErr], undefined)
			switch (resolveError) {
				case ResolveError.REJECT:
					qItem.reject(resultOrErr as Error)
				// eslint-disable-next-line no-fallthrough
				case ResolveError.NEVER:
					break
				case ResolveError.WITH_UNDEFINED:
					resultOrErr = undefined
				// eslint-disable-next-line no-fallthrough
				case ResolveError.WITH_ERROR:
					qItem.resolve(resultOrErr)
					break
			}
		}
	const execute = (() => {
		const execute = (id: symbol, qItem: QueueItem) => {
			qItem.started = true
			lastPromisE = new PromisEBase(qItem.getPromise())
			lastPromisE.then(
				finalizeCb(true, id, qItem),
				finalizeCb(false, id, qItem),
			)
		}
		if (!gotDelay) return execute

		const deferFn = throttle ? throttledCore : deferredCore
		return deferFn(execute, delayMs, options)
	})()

	const deferredFunc = <TResult = T>(
		promise: Promise<TResult> | (() => Promise<TResult>),
	) => {
		const id = Symbol('deferred-queue-item-id')
		const qItem = new PromisEBase() as QueueItem
		qItem.getPromise = isFn(promise) ? promise : () => promise
		qItem.started = false
		queue.set(id, qItem)

		if (gotDelay || !lastPromisE) execute(id, qItem)

		return forceCast<IPromisE<TResult>>(qItem)
	}
	return deferredFunc
}
export default deferred
