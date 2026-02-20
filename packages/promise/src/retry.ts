import {
	fallbackIfFails,
	isEmpty,
	isPositiveInteger,
	objCopy,
	ValueOrPromise,
} from '@superutils/core'
import delay from './delay'
import PromisEBase from './PromisEBase'
import type { RetryOptions } from './types'

/**
 * Executes a function asynchronously and retries it on failure or until a specific condition is met.
 *
 * The function will be re-executed if:
 * 1. The `func` promise rejects or the function throws an error.
 * 2. The optional `retryIf` function returns `true`.
 * 3. `retry > 0`
 *
 * Retries will stop when the `retry` count is exhausted, or when `func` executes successfully
 * (resolves without error) AND the `retryIf` (if provided) returns `false`.
 *
 * @template T The type of the value that the `func` resolves to.
 *
 * @param func The function to execute. It can be synchronous or asynchronous.
 * @param options (optional) Configuration of the retry mechanism.
 *
 * The following options' default values can be configured to be EFFECTIVE GLOBALLY.
 *
 * ```typescript
 * PromisE.retry.defaults = {
 *     retry: 1,
 *     retryBackOff: 'exponential',
 *     retryDelay: 300,
 *     retryDelayJitter: true,
 *     retryDelayJitterMax: 100,
 * }
 * ```
 * @param options.retry (optional) The maximum number of retries. Default: `1`
 * @param options.retryBackOff (optional) The backoff strategy.
 * Accepted values:
 * - `'exponential'` doubles the delay for each subsequent retry.
 * - `'linear'` uses a constant delay.
 *
 * Default: `'exponential'`
 * @param options.retryDelay (optional) The base delay in milliseconds between retries.
 *
 * Default: `300`
 * @param options.retryDelayJitter (optional) If true, adds a random jitter to the delay to prevent
 * the thundering herd problem.
 *
 * Default: `true`
 * @param options.retryDelayJitterMax The maximum jitter in milliseconds to add to the delay.
 *
 * Default: `100`
 * @param options.retryIf (optional) A function that is called after a successful execution of `func`.
 * If it returns `true`, a retry is triggered.
 *
 * **Arguments:**
 * - `result`: result received after the most recent `func` excution
 * - `retryCount`: number of times the execution has been retried (`total_attemts - 1`)
 *
 * If `retryIf()` throws error, the are handled gracefully and it's return value defaults `false` (no further retry).
 *
 * @returns A promise that resolves with the result of the last successful execution of `func`.
 * If all retries fail (either by throwing an error or when `retryIf()` returned true in every time),
 * it resolves with the last return value of `func()`. Errors thrown by `func` are caught and handled internally,
 * only re-thrown if no result is received after maximum retries.
 */
export const retry = <T>(
	func: () => ValueOrPromise<T>,
	options: RetryOptions<T>,
) => {
	let finalized = false
	const promise = PromisEBase.try<T, []>(async () => {
		// merge options with default oasync async async ptions conditionally
		options = objCopy(retry.defaults, options ?? {}, [], (key, value) => {
			switch (key) {
				// case 'retryDelayJitter':
				// 	return true
				case 'retry':
				// eslint-disable-next-line no-fallthrough
				case 'retryDelay':
				case 'retryDelayJitterMax':
					// use default value if  0 or negative integer
					return value !== 0 && !isPositiveInteger(value)
			}
			return !!isEmpty(value) // for other properties only override if not empty
		})

		const {
			retry: maxRetries,
			retryBackOff,
			retryDelay,
			retryDelayJitter,
			retryDelayJitterMax,
		} = options as Required<RetryOptions>
		let _retryDelay = retryDelay
		let retryCount = -1
		let result: T | undefined
		let error: unknown
		let shouldRetry = false
		do {
			retryCount++
			if (retryBackOff === 'exponential' && retryCount > 1)
				_retryDelay *= 2
			if (retryDelayJitter)
				_retryDelay += Math.floor(Math.random() * retryDelayJitterMax)

			if (!finalized && retryCount > 0) await delay(_retryDelay)

			if (!finalized) {
				try {
					error = undefined
					result = await func()
				} catch (err) {
					error = err
				}
			}

			if (finalized || maxRetries === 0 || retryCount >= maxRetries) break

			shouldRetry = !!(
				(await fallbackIfFails(
					options.retryIf ?? error, // if `retryIf` not provided, retry on error
					[result, retryCount, error],
					error, // if `retryIf` throws error, default to retry on error
				)) ?? error
			)
		} while (shouldRetry)

		if (error !== undefined) return Promise.reject(error as Error)
		return result as T
	})
	promise.onEarlyFinalize.push(() => {
		finalized = true
	})
	return promise
}
/** Global default values */
retry.defaults = {
	retry: 1,
	retryBackOff: 'exponential',
	retryDelay: 300,
	retryDelayJitter: true,
	retryDelayJitterMax: 100,
} satisfies Omit<Required<RetryOptions>, 'retryIf'>

export default retry
