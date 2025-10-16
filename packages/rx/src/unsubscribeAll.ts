/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isArr, isFn } from '@superutils/core'
import { UnsubscribeCandidates } from './types'

/**
 * @function    unsubscribeAll
 * @summary unsubscribe to multiple RxJS subscriptions
 * @param   {Function|Unsubscribable|Array} unsub
 */
export const unsubscribeAll = (unsub: UnsubscribeCandidates = {}) => {
	// single function supplied
	if (isFn(unsub)) return unsub()

	// single subscription
	if (!isArr(unsub) && isFn(unsub.unsubscribe)) return unsub.unsubscribe()

	// multi: array/object
	Object.values(unsub).forEach(x => {
		try {
			if (!x) return
			const fn: null | ((...args: unknown[]) => unknown) = isFn(x)
				? x
				: isFn(x.unsubscribe)
					? x.unsubscribe
					: null
			fn?.()
		} catch (e) {
			e
		}
	})
}
