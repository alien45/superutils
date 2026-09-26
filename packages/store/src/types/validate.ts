import { type TypedMap } from '@superutils/core'

/**
 * Validator `actionParams` for `IObjectStore`.
 *
 * See {@link Store_Validate} for function signature.
 */
export type IObjectStore_ValidatorParams<
	T extends object,
	Key extends keyof T = keyof T,
> = {
	clear: []
	delete: [keys: Key[]]
	patch: [data: Partial<T>, silent?: boolean]
	set: [key: Key, Value: T[Key], silent?: boolean]
	setAll: [data: T, replace?: boolean, silent?: boolean]
	write: [data?: TypedMap<T>, silent?: boolean]
}

/**
 * Validator `actionParams` for `IStore`.
 *
 * See {@link Store_Validate} for function signature.
 */
export type IStore_ValidatorParams<Key, Value> = {
	clear: []
	delete: [keys: Key[]]
	set: [key: Key, Value: Value, silent?: boolean]
	setAll: [data: Map<Key, Value>, replace?: boolean, silent?: boolean]
	write: [data?: Map<Key, Value>, silent?: boolean]
}

/**
 * Generic validator function signature used by `IStore` and `IObjectStore` instance.
 *
 * Invoked before data is serialized and committed to the underlying storage.
 *
 * @template ThisArg - Store instance bound to the validator function.
 * @template Params - Tuple containing the full data Map to be persisted: `[data: Map<Key, Value>]`.
 * @template Action - The literal action name: `'write'`.
 *
 * @returns `true/undefined` (valid) or `false` (invalid)
 */
export type Store_Validate<ThisArg, Params, Action> = (
	this: ThisArg,
	actionParams: Params,
	action: Action,
) => boolean | void

export type Store_ValidatorFactory<
	ThisArg,
	AllParams extends Record<Store_ValidateAction, any[]>,
> = {
	-readonly [K in keyof AllParams]?: Store_Validate<ThisArg, AllParams[K], K>
}

/**
 * Literal union of all operations that can be intercepted by a validator.
 */
export type Store_ValidateAction =
	'clear' | 'delete' | 'set' | 'setAll' | 'write'
