import { isArr, isFn } from '@superutils/core'
import { UnsubscribeCandidates } from './types'

/**
 * @name    unsubscribeAll
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
			const fn = isFn(x) ? x : isFn(x.unsubscribe) ? x.unsubscribe : null
			fn && fn()
		} catch (e) {} // ignore
	})
}
