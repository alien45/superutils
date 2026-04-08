import { isBool, isFn } from '@superutils/core'
import { Subscription } from 'rxjs'

/**
 * Check if value is an instance of RxJS `Subscription` or subscription-like object
 *
 * @param value
 * @param strict (optional) if true, will only check if value is instance of Subscription. Default: `false`
 */
export const isSubscriptionLike = (
	value: unknown,
	strict = false,
): value is Subscription => {
	if (value instanceof Subscription) return true

	const sub = value as Record<string, unknown>
	return (
		!strict //
		&& !!sub
		&& isBool(sub.closed)
		&& isFn(sub.unsubscribe)
	)
}

export default isSubscriptionLike
