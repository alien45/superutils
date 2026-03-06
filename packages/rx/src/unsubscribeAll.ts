import { isArr, isFn, isObj } from '@superutils/core'
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
	// single function supplied
	if (isFn(unsub)) return unsub()

	// single subscription
	if (!isArr(unsub) && isFn(unsub.unsubscribe)) return unsub.unsubscribe()

	// multi: array/object
	const obj = unsub as Record<PropertyKey, unknown>
	Object.keys(obj).forEach(key => {
		try {
			if (!obj[key]) return

			isFn(obj[key])
				? obj[key]()
				: isObj(obj[key], false)
					? isFn(obj[key].unsubscribe)
						? obj[key].unsubscribe()
						: unsubscribeAll(obj[key] as UnsubscribeCandidates)
					: null
		} catch (err) {
			onError?.(err)
		}
	})
}
