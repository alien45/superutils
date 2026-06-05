import {
	fallbackIfFails,
	isError,
	isFn,
	isObj,
	isPositiveNumber,
} from '@superutils/core'
import {
	timeout,
	type IPromisE_Timeout,
	TIMEOUT_MAX,
} from '@superutils/promise'
import { isObservable, Observable, skip, SubscriptionLike } from 'rxjs'
import { AsPromise_Defaults, AsPromise_Options } from './types'

/**
 * @summary Create a promise using RxJS subject and wait until an expected value is received
 *
 * @param input$ RxJS subject or observable
 * @param expectedValue	(optional) if undefined, will resolve as soon as any value is received.
 * If function, it should return true or false to indicate whether the value should be resolved.
 * @param timeoutOrOptions (optional) timeout duration or options
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
	input$: Observable<T>,
	expectedValue?: T | ((value: T) => boolean),
	timeoutOrOptions?: number | AsPromise_Options,
) => {
	let subscription: SubscriptionLike
	const options = isObj(timeoutOrOptions)
		? timeoutOrOptions
		: { timeout: timeoutOrOptions }
	options.timeout = isPositiveNumber(options.timeout)
		? options.timeout
		: TIMEOUT_MAX

	const promise = timeout(
		{
			...options,
			onTimeout: async () => {
				const msg = options.timeoutMsg ?? asPromise.defaults.timeoutMsg
				return (
					(await fallbackIfFails(options.onTimeout, [], undefined))
					?? (isError(msg) ? msg : new Error(msg))
				)
			},
		},
		new Promise<T>((resolve, reject) => {
			if (!isObservable(input$))
				return reject(new Error(asPromise.defaults.invalidInputMsg))

			subscription = input$
				.pipe(skip(options.skip ?? 0))
				.subscribe(value => {
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
asPromise.defaults = {
	invalidInputMsg: 'Input must be an observable or subject instance',
	timeoutMsg: 'Request timed out before an expected value is received',
} as AsPromise_Defaults

export default asPromise
