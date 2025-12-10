import { DeferredAsyncOptions, ResolveError, ResolveIgnored } from '../src/'

export const getDeferredContext = () =>
	({
		data: {
			errors: [],
			ignored: [],
			results: [],
		},
		delayMs: 100,
		onError(err) {
			this.data.errors.push(err)
		},
		onIgnore(ignored) {
			this.data.ignored.push(ignored)
		},
		onResult(result) {
			this.data.results.push(result)
		},
		resolveIgnored: ResolveIgnored.WITH_LAST,
		resolveError: ResolveError.REJECT,
		throttle: false,
		get thisArg() {
			return this
		},
	}) as DeferredAsyncOptions & {
		data: {
			errors: unknown[]
			ignored: unknown[]
			results: unknown[]
		}
	}
