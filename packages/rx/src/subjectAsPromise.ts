/* eslint-disable @typescript-eslint/no-explicit-any */
import { isFn, noop, TimeoutId } from '@superutils/core'
import PromisE from '@superutils/promise'
import { SubjectLike, SubscriptionLike } from './types'

export const ANY_VALUE_SYMBOL = Symbol('any-value')
/**
 * @function    subjectAsPromise
 * @summary sugar for RxJS subject as promise and, optionally, wait until an expected value is received
 *
 * @param   {Subject}           subject         RxJS subject or similar subscribable
 * @param   {*|Function}        expectedValue   (optional) if undefined, will resolve as soon as any value is received.
 *                      If function, it should return true or false to indicate whether the value should be resolved.
 * @param   {Number|Function}   timeout         (optional) will reject if no value received within given time
 * @param   {String}            timeoutMsg      (optional) error message to use when times out.
 *                                              Default: 'Request timed out before an expected value is received'
 *
 * @returns {[PromisE<T>, Function]}   will reject with:
 *                                  - `null` if times out
 *                                  - `undefined` if `subject` is not a valid RxJS subject like subscribable
 *
 * ----------------------------------------
 *
 * @example Create an interval runner subject that triggers incremental value every second.
 * ```typescript
 * const rxInterval = new IntervalSubject(true, 1000, 1, 1)
 *
 * // create a promise that only resolves when expected value is received
 * const [promise, unsubscribe] = subjectAsPromise(rxInterval, 10)
 * promise.then(value => console.log('Value should be 10', value))
 * ```
 */
export const subjectAsPromise = <T = unknown>(
	subject: SubjectLike<T>,
	expectedValue?: T | ((value: T) => boolean),
	timeout?: number,
	timeoutMsg: string = 'request timed out before an expected value is received', // eslint-disable-line @typescript-eslint/no-inferrable-types
) => {
	if (!subject) {
		const r = PromisE.reject<T>(
			new Error('subject must be an instance of BehaviorSubject.'),
		)
		return [r, noop] as const
	}

	let subscription: SubscriptionLike
	let timeoutId: TimeoutId
	let unsubscribed: boolean
	const unsubscribe = () =>
		setTimeout(() => {
			!unsubscribed && subscription?.unsubscribe?.()
			unsubscribed = true
			clearTimeout(timeoutId)
		}, 50) // ToDo: double-check if timeout is really needed here
	const promise = new PromisE<T>((resolve, reject) => {
		subscription = subject.subscribe(value => {
			const shouldResolve =
				value === expectedValue  // exact match
				// no expected value set. resolve with first value received
				|| expectedValue === undefined
				// expected value is a function and returns boolean
				|| (isFn(expectedValue) && expectedValue(value))
				// resolve only when `subject.value` is NOT undefined
				|| (expectedValue === ANY_VALUE_SYMBOL && value !== undefined)
			if (!shouldResolve) return

			unsubscribe()
			resolve(value)
		})
		if (timeout && timeout > 0)
			timeoutId = setTimeout(() => {
				// prevent rejecting if already unsubscribed
				if (unsubscribed) return

				unsubscribe()
				reject(timeoutMsg)
			}, timeout)
	})

	return [promise, unsubscribe]
}
/**
 * Use this symbol as expected value to indicate the promise should resolve whenever any value (except for `undefined`) is received
 */
subjectAsPromise.ANY_VALUE_SYMBOL = ANY_VALUE_SYMBOL

export default subjectAsPromise
