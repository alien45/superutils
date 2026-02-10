import { expect, vi } from 'vitest'
import {
	createClient,
	createPostClient,
	FetchArgs,
	ResolveIgnored,
} from '../src'
import { productsBaseUrl } from './utils'

/**
 * Returns a function that simulates debounced and throttled calls with variables of
 * leading and trailing options by creating  post/get client making sure that the returned
 * results are consistent by invoking deferred callbacks `100` times each in batches of `4`.
 * Total 400 calls are made.
 */
const getClientDeferredSimulator = (postClient = false) => {
	const delayMs = 600
	const _createClient = postClient
		? (createPostClient as typeof createClient)
		: createClient
	const client = _createClient(
		{}, // fixed and common options are not being tested here
		{},
		{
			delayMs,
			resolveIgnored: ResolveIgnored.WITH_LAST,
		},
	)

	const simulateClientCalls = async ({
		throttle = false,
		leading = false,
		trailing = false,
	}) => {
		vi.useFakeTimers()
		const getProductsDeferred = client.deferred(
			{
				throttle,
				leading,
				trailing,
			},
			productsBaseUrl + '/1',
		)

		const simulateSeriesOfCalls = async () => {
			// use count to make expectedResult easier to predict by localizing for each batch of calls
			let count = 0
			const fetchFunc = vi.fn((...args: FetchArgs) =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: async () => ++count,
				} as unknown as Response),
			)
			vi.stubGlobal('fetch', fetchFunc)
			const expectedResult =
				throttle && trailing
					? [1, 2, 2, 2]
					: !throttle && leading
						? [1, 1, 1, 2]
						: [1, 1, 1, 1]
			// start series calls
			const promises = Promise.all([
				getProductsDeferred(),
				getProductsDeferred(),
				getProductsDeferred(),
				getProductsDeferred(),
			])
			await vi.runAllTimersAsync()
			await expect(promises).resolves.toEqual(expectedResult)
			// end series by timing it out
			await vi.advanceTimersByTime(delayMs)
		}

		for (let i = 1; i <= 1; i++) await simulateSeriesOfCalls()
		vi.useRealTimers()
		// vi.unstubAllGlobals()
	}
	return simulateClientCalls
}

export default getClientDeferredSimulator
