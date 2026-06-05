import { TimeoutOptions } from '@superutils/promise'
import type { Observable, SubscriptionLike } from 'rxjs'

export type AsPromise_Defaults = Required<
	Pick<AsPromise_Options, 'invalidInputMsg' | 'timeoutMsg'>
>
export type AsPromise_Options = Omit<TimeoutOptions, 'batchFunc'> & {
	/** Error message used when input is not a valid observable */
	invalidInputMsg?: string
	/** Number of emit values to skip/ignore. Default: `0` */
	skip?: number
	/** Error message to use when times out. */
	timeoutMsg?: string | Error
}

export type Unsubscribe = SubscriptionLike['unsubscribe']

export type UnsubscribeCandidate =
	// single function
	| Unsubscribe
	// single subscription
	| SubscriptionLike
	// array of subscriptions and other values
	| SubscriptionLike[]
	| unknown[]
	// object of mixed values including all above
	| object
	// values to be ignored
	| undefined
	| null
	| boolean

/**
 * Recursively extracts the emitted value type from an Observable, an array of Observables,
 * or returns the type itself if it's a static value.
 *
 * @template T - The input type to unwrap.
 */
export type UnwrapSourceValue<T> =
	T extends Observable<infer V>
		? V
		: T extends readonly unknown[]
			? { -readonly [K in keyof T]: UnwrapSourceValue<T[K]> }
			: T

/**
 * Recursively extracts the emitted value type from an Observable or an array of Observables,
 * similar to {@link UnwrapSourceValue}.
 *
 * However, if the Observable does not have a `.value` property (i.e., it is not a `BehaviorSubject`),
 * the resulting type is unioned with `undefined` to reflect that an initial value may not be
 * immediately available.
 *
 * @template T - The input type to unwrap.
 */
export type UnwrapSourceValueStrict<T> =
	T extends Observable<infer V>
		? T extends { value: infer V }
			? V // a subject with value
			: V | undefined // observable without value
		: T extends readonly unknown[]
			? { -readonly [K in keyof T]: UnwrapSourceValueStrict<T[K]> }
			: T
