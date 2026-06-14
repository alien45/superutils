/* eslint-disable @typescript-eslint/no-explicit-any */
import { IStore } from './IStore'

/** Utility to exclude store props & o in context */
export type ContextExcludeProps<Context> = Context extends object
	? {
			[K in keyof Context]: K extends keyof IStore<any, any, any>
				? never
				: Context[K]
		}
	: never

/** Extract context return type */
export type ContextReturn<Context> = Context extends (...args: any[]) => infer R
	? R
	: Context extends object
		? Context
		: unknown

/** Validate and exclude store properties from context   */
export type ContextValidate<Context, Store> = Context extends (
	...args: unknown[]
) => infer R
	? (store: Store) => ContextExcludeProps<R>
	: ContextExcludeProps<Context>
