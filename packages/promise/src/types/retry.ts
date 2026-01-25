import { ValueOrPromise } from '@superutils/core'

/** Function to determine whether retry should be attempted based on previous result/error */
export type RetryIfFunc<T = unknown> = (
	prevResult: T | undefined,
	retryCount: number,
	error?: unknown,
) => ValueOrPromise<boolean | void>

/** Options for automatic retry mechanism */
export type RetryOptions<T = unknown> = {
	/**
	 * Maximum number of retries.
	 *
	 * The total number of attempts will be `retry + 1`.
	 *
	 * Default: `1`
	 */
	retry?: number
	/**
	 * Accepted values:
	 * - exponential: each subsequent retry delay will be doubled from the last
	 * - linear: fixed delay between retries
	 * Default: 'exponential'
	 */
	retryBackOff?: 'exponential' | 'linear'
	/**
	 * Minimum delay in milliseconds between retries.
	 * Default: `300`
	 */
	retryDelay?: number
	/**
	 * Whether to add a random delay between 0ms and `retryDelayJitterMax` to the `retryDelay`.
	 *
	 * This helps to avoid "thundering herd" problem when multiple retries are attempted simultaneously.
	 *
	 * Default: `true`
	 */
	retryDelayJitter?: boolean
	/**
	 * Maximum jitter delay (in milliseconds) to be added to the `retryDelay` when `retryDelayJitter` is `true`.
	 *
	 * A random value between `0` and `retryDelayJitterMax` will be added to the base `retryDelay`.
	 *
	 * Default: `100`
	 */
	retryDelayJitterMax?: number
	/**
	 * Additional condition to be used to determine whether function should be retried.
	 *
	 * If `retryIf` not provided, execution will be retried on any error until the retry limit is reached
	 * or a result is received without an exception.
	 *
	 * @param prevResult The result from the previous attempt, if any.
	 * @param retryCount The number of retries that have been attempted so far.
	 * @param error The error from the previous attempt, if any.
	 *
	 * Expected return values:
	 * - `true`: retry will be attempted regardless of error.
	 * - `false`: no further retry will be attempted and the last error/result will be returned.
	 * - `void | undefined`: retry will be attempted only if there was an error.
	 */
	retryIf?: RetryIfFunc<T>
}
