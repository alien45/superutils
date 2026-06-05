import { unsubscribeAll, UnsubscribeCandidate } from '@superutils/rx'
import { useUnmount } from '../hooks/useMount'

/**
 * Auto-unsubscribe from RxJS subscriptions and/or unsubscribe functions when unmounting a component.
 */
export const useUnsubscribe = (...candidates: UnsubscribeCandidate[]) =>
	useUnmount(() => unsubscribeAll(candidates))

export default useUnsubscribe
