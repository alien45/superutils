import { DeferredAsyncOptions, ResolveError, ResolveIgnored } from '../src/'

export const getDeferredContext = <Delay extends number>(
	delayMs: Delay = 100 as Delay,
) => {
	const context = {
		data: {
			errors: [],
			ignored: [],
			results: [],
		},
		delayMs,
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
	} as DeferredAsyncOptions<unknown, Delay> & {
		data: {
			errors: unknown[]
			ignored: (<T = unknown>() => Promise<T>)[]
			results: unknown[]
		}
	}
	return context
}
