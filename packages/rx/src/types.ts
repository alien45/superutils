export interface SubjectLike<T = unknown> {
	next: (value: T) => void
	subscribe: (
		next: (value: T) => void,
		...args: unknown[]
	) => SubscriptionLike
	unsubscribe?: Unsubscribe
	closed?: boolean
	value?: T
}

export interface SubscriptionLike {
	closed?: boolean
	unsubscribe: Unsubscribe
}

/** Wrap a value from a signle subject or an array of subjects and values */
export type UnwrapSubjectValue<T> =
	T extends SubjectLike<infer V>
		? V
		: T extends readonly unknown[]
			? { -readonly [K in keyof T]: UnwrapSubjectValue<T[K]> }
			: T

export type Unsubscribe = () => void

export type UnsubscribeCandidates =
	// single function
	| Unsubscribe
	// single subscription
	| SubscriptionLike
	// array of subscriptions
	| SubscriptionLike[]
	// array of mixed values
	| unknown[]
	// object of mixed values
	| Record<PropertyKey, unknown>
	// values to be ignored
	| undefined
	| null
	| boolean
