import { IStore } from './IStore'

/**
 * Literal union of all operations that can be intercepted by a validator.
 */
export type Store_ValidateAction =
	| 'clear'
	| 'delete'
	| 'set'
	| 'setAll'
	| 'write'

/**
 * Function signature for an operation-specific validation hook.
 *
 * **Behavior:**
 * - Invoked immediately before the store's internal state is updated.
 * - If validation fails (throw error), the write operation is aborted and error is propagated to the caller.
 *
 * @param params - The specific payload for the action:
 *   - `clear`: `[]`
 *   - `delete`: `[keys: Key[]]`
 *   - `set`: `[key: Key, value: Value]`
 *   - `setAll`: `[data: Map<Key, Value>, replace: boolean]`
 *   - 'write': `[data: Map<Key, Value>]`
 * @param action - The literal name of the action being performed.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template CacheDisabled - Whether caching is disabled.
 */
export type Store_ValidateFn<
	Key,
	Value,
	CacheDisabled extends boolean,
	Action extends keyof IStore<Key, Value> & Store_ValidateAction,
> = (
	this: IStore<Key, Value, CacheDisabled>,
	params: 'clear' extends Action
		? []
		: 'delete' extends Action
			? [keys: Key[]]
			: 'set' extends Action
				? [key: Key, value: Value]
				: 'setAll' extends Action
					? [data?: Map<Key, Value>, replace?: boolean]
					: 'write' extends Action
						? [data: Map<Key, Value>]
						: [],
	action: Action,
) => void | undefined | boolean

/**
 * A configuration object containing optional validation hooks for specific store operations.
 *
 * This structure allows for granular control over write operations, enabling you
 * to define custom logic to intercept and prevent invalid state updates.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template CacheDisabled - Whether caching is disabled for the store.
 */
export type Store_Validate<Key, Value, CacheDisabled extends boolean> = {
	clear?: Store_ValidateFn<Key, Value, CacheDisabled, 'clear'>
	delete?: Store_ValidateFn<Key, Value, CacheDisabled, 'delete'>
	set?: Store_ValidateFn<Key, Value, CacheDisabled, 'set'>
	setAll?: Store_ValidateFn<Key, Value, CacheDisabled, 'setAll'>
	write?: Store_ValidateFn<Key, Value, CacheDisabled, 'write'>
}
