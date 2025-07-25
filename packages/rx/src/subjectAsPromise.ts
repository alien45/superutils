/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubjectLike, SubscriptionLike } from './types'

export const isFn = (x: unknown): x is Function => typeof x === 'function'

/**
 * @name    subjectAsPromise
 * @summary sugar for RxJS subject as promise and, optionally, wait until an expected value is received
 * 
 * @param   {Subject}           subject         RxJS subject or similar subscribable
 * @param   {*|Function}        expectedValue   (optional) if undefined, will resolve as soon as any value is received.
 *                      If function, it should return true or false to indicate whether the value should be resolved.
 * @param   {Number|Function}   timeout         (optional) will reject if no value received within given time
 * @param   {String}            timeoutMsg      (optional) error message to use when times out.
 *                                              Default: 'Request timed out before an expected value is received'
 * 
 * @returns {[Promise<T>, Function]}   will reject with: 
 *                                  - `null` if times out
 *                                  - `undefined` if @subject is not a valid RxJS subject like subscribable
 */
export const subjectAsPromise = <T = unknown>(
	subject: SubjectLike<T>,
	expectedValue?: T | ((value: T) => boolean),
	timeout?: number,
	timeoutMsg: string = 'request timed out before an expected value is received',
): [Promise<T>, () => void] => {
	if (!subject) return [Promise.reject('subject must be an instance of BehaviorSubject.'), () => { }]

	let subscription: SubscriptionLike
	let timeoutId: NodeJS.Timeout
	let unsubscribed: boolean
	const unsubscribe = () => setTimeout(() => {
		!unsubscribed && subscription?.unsubscribe?.()
		unsubscribed = true
		clearTimeout(timeoutId)
	}, 50)
	const promise = new Promise<T>((resolve, reject) => {
		subscription = subject.subscribe(value => {
			const shouldResolve = isFn(expectedValue) && expectedValue(value)
				// no expected value set. resolve with first value received
				|| expectedValue === undefined
				// exact match
				|| value === expectedValue
				// resolve only when `subject.value` is NOT undefined
				|| (expectedValue === subjectAsPromise.anyValueSymbol && value !== undefined)
			if (!shouldResolve) return

			unsubscribe()
			resolve(value)
		})
		if (timeout && timeout > 0) timeoutId = setTimeout(() => {
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
subjectAsPromise.anyValueSymbol = Symbol('any-value')

export default subjectAsPromise