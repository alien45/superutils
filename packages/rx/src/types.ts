export interface SubjectLike<T = unknown> {
	// getValue: () => T,
	next: (value: T) => void
	subscribe: (
		next: (value: T) => void,
		...args: unknown[]
	) => SubscriptionLike
	value: T
}

export interface SubscriptionLike {
	closed?: boolean
	unsubscribe: Unsubscribe
}

export type Unsubscribe = () => void

export type UnsubscribeCandidates =
	| Unsubscribe
	| SubscriptionLike
	| SubscriptionLike[]
	| Record<string, SubscriptionLike | Unsubscribe>
