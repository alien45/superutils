import { TimeoutOptions } from '@superutils/promise'
import type { SubjectLike, SubscriptionLike } from 'rxjs'


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
	| (SubscriptionLike | unknown)[]
	// object of mixed values including all above
	| object
	// values to be ignored
	| undefined
	| null
	| boolean

/** Wrap a value from a signle subject or an array of subjects and values */
export type UnwrapSubjectValue<T> =
	T extends SubjectLike<infer V>
		? V
		: T extends readonly unknown[]
			? { -readonly [K in keyof T]: UnwrapSubjectValue<T[K]> }
			: T
