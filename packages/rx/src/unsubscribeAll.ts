import { isFn } from '@superutils/core'
import isSubscriptionLike from './isSubscriptionLike'
import { UnsubscribeCandidates } from './types'

/**
 * @function    unsubscribeAll
 * @summary unsubscribe to multiple RxJS subscriptions
 * @param   {Function|Unsubscribable|Array} unsub
 */
export const unsubscribeAll = (
	unsub: UnsubscribeCandidates = {},
	onError?: (err: unknown) => void,
) => {
	if (!unsub) return

	try {
		// single function supplied
		if (isFn(unsub)) return unsub()

		// single subscription
		if (isSubscriptionLike(unsub)) return unsub.unsubscribe()

		// array/object
		Object.values(unsub as UnsubscribeCandidates[]).forEach(value =>
			unsubscribeAll(value, onError),
		)
	} catch (err) {
		onError?.(err)
	}
}
