import { isPositiveInteger, ValueOrPromise } from '@superutils/core'
import delay from './delay'
import { RetryOptions } from './types'
import config from './config'

/**
 * Executes a function and retries it on failure or until a specific condition is met.
 *
 * The function will be re-executed if:
 * 1. The `func` promise rejects or the function throws an error.
 * 2. The optional `retryIf` function returns `true`.
 * 3. `retry > 0`
 *
 * Retries will stop when the `retry` count is exhausted, or when `func` executes successfully
 * (resolves without error) AND the `retryIf` (if provided) returns `false`.
 *
 * @template T The type of the value that the `func` returns/resolves to.
 * @param {() => ValueOrPromise<T>}	func The function to execute. It can be synchronous or asynchronous.
 * @param {RetryOptions} [options={}] (optional) Options for configuring the retry mechanism.
 * @property {number} [options.retry=1] (optional) The maximum number of retries.
 * @property {number} [options.retryDelayMs=300] The base delay in milliseconds between retries.
 * @property {'exponential' | 'fixed'} [options.retryBackOff='exponential'] The backoff strategy. 'exponential' doubles the delay for each subsequent retry. 'fixed' uses a constant delay.
 * @property {boolean} [options.retryDelayJitter=true] If true, adds a random jitter to the delay to prevent thundering herd problem.
 * @property {number} [options.retryDelayJitterMax=100] The maximum jitter in milliseconds to add to the delay.
 * @property {(result: T | undefined, retryCount: number) => boolean} [options.retryIf] A function that is called after a successful execution of `func`. If it returns `true`, a retry is triggered. It receives the result and the current retry count.
 * @returns {Promise<T | undefined>} A promise that resolves with the result of the last successful execution of `func`.
 * If all retries fail (either by throwing an error or by the condition function always returning true),
 * it resolves with `undefined`. Errors thrown by `func` are caught and handled internally, not re-thrown.
 */
export const retry = async <T>(
	func: () => ValueOrPromise<T>,
	options: RetryOptions<T> = {},
): Promise<T> => {
	const d = config.retryOptions
	const {
		retryIf,
		retryBackOff = d.retryBackOff,
		retryDelayJitter = d.retryDelayJitter,
	} = options
	let {
		retry: maxRetries = 1,
		retryDelay: delayMs,
		retryDelayJitterMax: jitterMax,
	} = options
	maxRetries = maxRetries >= 0 ? maxRetries : d.retry
	delayMs = isPositiveInteger(delayMs) ? delayMs : d.retryDelay
	jitterMax = isPositiveInteger(jitterMax) ? jitterMax : d.retryDelayJitterMax
	let retryCount = 0
	let result: T | undefined
	let error: unknown
	let shouldRetry = false
	do {
		if (retryBackOff === 'exponential' && retryCount > 1) delayMs *= 2
		if (retryDelayJitter) delayMs += Math.floor(Math.random() * jitterMax)

		retryCount > 0 && (await delay(delayMs))

		try {
			error = undefined
			result = await func()
		} catch (err) {
			error = err
		}
		shouldRetry =
			maxRetries > 0
			&& retryCount < maxRetries
			&& (!!error || !!retryIf?.(result, retryCount++))
	} while (shouldRetry)

	if (error && !result) throw error as Error
	return result as T
}

export default retry
