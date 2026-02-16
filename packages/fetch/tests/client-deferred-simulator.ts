import { expect, vi } from 'vitest'
import {
	createClient,
	createPostClient,
	FetchArgs,
	ResolveIgnored,
} from '../src'
import { productsBaseUrl } from './utils'

/**
 * Returns a function that simulates debounced and throttled calls with variations of
 * leading and trailing options by creating  post/get client making sure that the returned
 * results are consistent by invoking deferred callbacks `10` times each in batches of `4`.
 * Total 400 calls are made.
 */
const getClientDeferredSimulator = (postClient = false) => {
	const delay = 600
	const _createClient = postClient
		? (createPostClient as typeof createClient)
		: createClient
	const client = _createClient(
		{}, // fixed and common options are not being tested here
		{},
		{
			delay,
			resolveIgnored: ResolveIgnored.WITH_LAST,
		},
	)

	const simulateClientCalls = async ({
		throttle = false,
		leading = false,
		trailing = false,
	}) => {
		const getProductsDeferred = client.deferred(
			{
				throttle,
				leading,
				trailing,
			},
			productsBaseUrl + '/1',
		)
		const simulateSeriesOfCalls = async () => {
			vi.useFakeTimers()
			const expectedResult = throttle
				? trailing
					? [1, 4, 4, 4]
					: [1, 1, 1, 1]
				: leading
					? [1, 1, 1, 4]
					: [4, 4, 4, 4]
			// start series calls
			const promises = Promise.all(
				[1, 2, 3, 4].map(n =>
					getProductsDeferred(
						...[
							postClient && {},
							{ fetchFunc: fetchFunc(n), debugTag: n },
						].filter(Boolean),
					),
				),
			)
			await vi.runAllTimersAsync()
			await expect(promises).resolves.toEqual(expectedResult)
			// end series by timing it out
			await vi.advanceTimersByTime(delay)
		}

		for (let i = 1; i <= 10; i++) await simulateSeriesOfCalls()
	}
	return simulateClientCalls
}

const fetchFunc =
	(n = 0) =>
	() =>
		Promise.resolve({
			ok: true,
			status: 200,
			json: async () => n,
		} as unknown as Response)
export default getClientDeferredSimulator
