import { isFn } from '@superutils/core'
import isSubscriptionLike from './isSubscriptionLike'
import { UnsubscribeCandidate } from './types'

/**
 * Unsubscribe from one or mroe RxJS subscriptions
 *
 * @param candidate RxJS subscription, unsubscribe function or mix of both in array/object
 */
export const unsubscribeAll = (
	candidate: UnsubscribeCandidate = {},
	onError?: (err: unknown) => void,
): void => {
	if (!candidate) return

	try {
		// single function supplied
		if (isFn(candidate)) {
			candidate()
			return
		}

		// single subscription
		if (isSubscriptionLike(candidate)) {
			candidate.unsubscribe()
			return
		}

		// array/object
		Object.values(candidate as UnsubscribeCandidate[]).forEach(value =>
			unsubscribeAll(value, onError),
		)
	} catch (err) {
		onError?.(err)
	}
}
export default unsubscribeAll
