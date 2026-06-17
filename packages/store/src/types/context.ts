/* eslint-disable @typescript-eslint/no-explicit-any */
import { IStore } from './IStore'

/** Utility to exclude store props & o in context */
export type Store_ContextExcludeProps<Context> = Context extends object
	? {
			[K in keyof Context]: K extends keyof IStore<any, any, any>
				? never
				: Context[K]
		}
	: never

/** Extract context return type */
export type Store_ContextReturn<Context> = Context extends (
	...args: any[]
) => infer R
	? R
	: Context extends object
		? Context
		: unknown

/** Validate and exclude store properties from context   */
export type Store_ContextValidate<Context, Store> = Context extends (
	...args: unknown[]
) => infer R
	? (store: Store) => Store_ContextExcludeProps<R>
	: Store_ContextExcludeProps<Context>
