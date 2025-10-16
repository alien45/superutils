import { RetryOptions } from './types'
import { DeferredOptions, ResolveError, ResolveIgnored } from './types/deferred'

/** Global configuration */
export const config = {
	/** Default value for `options` used by `PromisE.*deferred*` functions */
	deferOptions: {
		delayMs: 100,
		resolveError: ResolveError.REJECT,
		resolveIgnored: ResolveIgnored.WITH_LAST,
		throttle: false,
	} as DeferredOptions,
	delayTimeoutMsg: 'Timed out after',
	retryOptions: {
		retry: 1,
		retryBackOff: 'exponential',
		retryDelay: 300,
		retryDelayJitter: true,
		retryDelayJitterMax: 100,
		retryIf: null,
	} satisfies Required<RetryOptions>,
}

export type Config = typeof config

export default config
