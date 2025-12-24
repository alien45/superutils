import { DeferredAsyncOptions, ResolveError, ResolveIgnored } from '../src/'

export const getDeferredContext = () => {
	const context = {
		data: {
			errors: [],
			ignored: [],
			results: [],
		},
		delayMs: 100,
		onError(err) {
			context.data.errors.push(err)
		},
		onIgnore(ignored) {
			context.data.ignored.push(ignored)
		},
		onResult(result) {
			context.data.results.push(result)
		},
		resolveIgnored: ResolveIgnored.WITH_LAST,
		resolveError: ResolveError.REJECT,
		throttle: false,
		trailing: false,
		leading: false,
		get thisArg() {
			return this
		},
	} as DeferredAsyncOptions & {
		data: {
			errors: unknown[]
			ignored: unknown[]
			results: unknown[]
		}
	}
	return context
}
