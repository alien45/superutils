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
	 * Delay in milliseconds between retries.
	 * Default: `300`
	 */
	retryDelay?: number
	/**
	 * Add a random delay between 0ms and `retryDelayJitterMax` to the `retryDelayMs`.
	 * Default: `true`
	 */
	retryDelayJitter?: boolean
	/**
	 * Maximum delay (in milliseconds) to be used when randomly generating jitter delay duration.
	 * Default: `100`
	 */
	retryDelayJitterMax?: number
	/**
	 * Additional condition/function to be used to determine whether function should be retried.
	 * `retryIf` will only be executed when function execution is successful.
	 */
	retryIf?:
		| null
		| ((
				prevResult: T | undefined,
				retryCount: number,
				error?: unknown,
		  ) => boolean)
}
