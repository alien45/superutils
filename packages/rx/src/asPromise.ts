import {
	fallbackIfFails,
	isError,
	isFn,
	isObj,
	isPositiveNumber,
	isSubjectLike,
} from '@superutils/core'
import PromisE, {
	IPromisE_Timeout,
	TIMEOUT_MAX,
	TimeoutOptions,
} from '@superutils/promise'
import { isObservable, Subscribable } from './rxjs'
import { SubjectLike, SubscriptionLike } from './types'

/**
 * @summary Create a promise using RxJS subject and wait until an expected value is received
 *
 * @param subject RxJS subject or observable
 * @param expectedValue	(optional) if undefined, will resolve as soon as any value is received.
 * If function, it should return true or false to indicate whether the value should be resolved.
 * @param timeoutOrOptions (optional)
 * @param timeoutOrOptions.timeout (optional) timeout duration in milliseconds if no value received within given time
 * @param timeoutOrOptions.timeoutMsg (optional) error message to use when times out.
 *
 * @returns timeout promise
 *
 * @example
 * #### Create a promise using RxJS subject
 * ```typescript
 * import { BehaviorSubject, subjectAsPromise } from '@superutils/rx'
 *
 * const subject = new BehaviorSubject(0)
 * setInterval(() => subject.next(subject.value + 1), 1000)
 *
 * // resolve conditionally based on value received
 * subjectAsPromise(subject, value => value >= 3)
 * 	.then(value => console.log('Expected >= 3, received ', value))
 *
 * // resolve when only specific value is received
 * subjectAsPromise(subject, 5).then(value => console.log('Expected 5, received ', value))
 * ```
 */
export const asPromise = <T = unknown>(
	subject: Subscribable<T> | SubjectLike<T>,
	expectedValue?: T | ((value: T) => boolean),
	timeoutOrOptions?:
		| number
		| (Omit<TimeoutOptions, 'batchFunc'> & { timeoutMsg?: string | Error }),
) => {
	if (!isSubjectLike(subject) && !isObservable(subject))
		return PromisE.reject<T>(
			new Error('subject must be an instance of BehaviorSubject'),
		) as unknown as IPromisE_Timeout<T>

	let subscription: SubscriptionLike
	const options = isObj(timeoutOrOptions)
		? timeoutOrOptions
		: { timeout: timeoutOrOptions }

	options.timeout = isPositiveNumber(options.timeout)
		? options.timeout
		: TIMEOUT_MAX

	const promise = PromisE.timeout(
		{
			...options,
			onTimeout: async () => {
				const { onTimeout, timeoutMsg } = options

				const msg = await fallbackIfFails(onTimeout, [], undefined)
				return (
					msg
					?? (isError(timeoutMsg)
						? timeoutMsg
						: new Error(
								timeoutMsg
									?? 'request timed out before an expected value is received',
							))
				)
			},
		},
		new PromisE<T>(resolve => {
			subscription = subject.subscribe((value: T) => {
				const shouldResolve =
					value === expectedValue  // exact match
					// no expected value set. resolve with first value received
					|| expectedValue === undefined
					// expected value is a function and returns boolean
					|| (isFn(expectedValue)
						&& fallbackIfFails(expectedValue, [value], false))

				shouldResolve && resolve(value)
			})
		}),
	)

	promise.onFinalize.push(() => {
		subscription?.unsubscribe?.()
	})
	return promise as IPromisE_Timeout<T>
}
export default asPromise
