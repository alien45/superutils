import { ValueOrPromise } from '@superutils/core'

export interface IPromisE<T = unknown> extends Promise<T> {
	/** 0: pending, 1: resolved, 2: rejected */
	readonly state: 0 | 1 | 2

	/** callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve/reject methods */
	onEarlyFinalize: OnEarlyFinalize<T>[]

	/** Indicates if the promise is still pending/unfinalized */
	readonly pending: boolean

	/** Reject pending promise early. */
	reject: (reason: unknown) => void

	/** Indicates if the promise has been rejected */
	readonly rejected: boolean

	/** Resovle pending promise early. */
	resolve: (value: T | PromiseLike<T>) => void

	/** Indicates if the promise has been resolved */
	readonly resolved: boolean
}

export type OnEarlyFinalize<T> = <
	TResolved extends boolean,
	TValue = TResolved extends true ? T : unknown,
>(
	resolved: TResolved,
	resultOrReason: TValue,
) => ValueOrPromise<unknown>

export type PromiseParams<T = unknown> = ConstructorParameters<
	typeof Promise<T>
>
