import { IStore } from './IStore'

// Augment validate object into IStore interface
declare module './IStore' {
	interface IStore<Key, Value, CD extends boolean = false> {
		/**
		 * A configuration object containing optional validation hooks for specific store operations.
		 *
		 * This structure allows for granular control over write operations, enabling you
		 * to define custom logic to intercept and prevent invalid state updates.
		 *
		 * **Behavior:**
		 * - Invoked immediately before the store's internal state is updated.
		 * - If validation fails (throw error), the operation is aborted and the error is propagated to the caller.
		 * - The `write` validator is invoked during every persistence cycle, serving as a final check
		 * after operation-specific hooks (e.g., `set` or `delete`).
		 * - For reference-type values (e.g., Objects, Maps, Arrays), validators can be used to mutate the data
		 * (e.g., for normalization) before it is committed.
		 */
		validate?: Store_Validate<Key, Value, CD>
	}
}

/**
 * A configuration object containing optional validation hooks for specific store operations.
 *
 * See {@link IStore.validate} or inidivdual actions for more details.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template CacheDisabled - Whether caching is disabled for the store.
 */
export type Store_Validate<
	Key,
	Value,
	CacheDisabled extends boolean,
	ThisArg extends IStore<Key, Value, CacheDisabled> = IStore<
		Key,
		Value,
		CacheDisabled
	>,
> = {
	/**
	 * Validator for the `clear()` operation.
	 * Invoked before all entries are removed from the store.
	 *
	 * **Throw an error to invalidate and abort the operation.**
	 *
	 * @param actionParams - Empty array for this action.
	 * @param action - The literal action name: `'clear'`.
	 */
	clear?: (this: ThisArg, actionParams: [], action: 'clear') => void

	/**
	 * Validator for the `delete()` operation.
	 * Invoked before one or more entries are removed by their keys.
	 *
	 * **Throw an error to invalidate and abort the operation.**
	 *
	 * @param actionParams - Tuple containing the array of keys: `[keys: Key[]]`.
	 * @param action - The literal action name: `'delete'`.
	 */
	delete?: (
		this: ThisArg,
		actionParams: [keys: Key[]],
		action: 'delete',
	) => void

	/**
	 * Validator for the `set()` operation.
	 * Invoked before a single key-value pair is added or updated.
	 *
	 * **Throw an error to invalidate and abort the operation.**
	 *
	 * @param actionParams - Tuple containing the key and value: `[key: Key, value: Value]`.
	 * @param action - The literal action name: `'set'`.
	 */
	set?: (
		this: ThisArg,
		actionParams: [key: Key, value: Value],
		action: 'set',
	) => void

	/**
	 * Validator for the `setAll()` operation.
	 * Invoked before merging or replacing the entire dataset.
	 *
	 * **Throw an error to invalidate and abort the operation.**
	 *
	 * @param actionParams - Tuple containing the data Map and replace flag:
	 *   `[data?: Map<Key, Value>, replace?: boolean]`.
	 * @param action - The literal action name: `'setAll'`.
	 */
	setAll?: (
		this: ThisArg,
		actionParams: [data?: Map<Key, Value>, replace?: boolean],
		action: 'setAll',
	) => void

	/**
	 * Validator for the `write()` operation.
	 * Invoked immediately before data is serialized and committed to the underlying storage.
	 * This acts as a final gatekeeper for the entire state during persistence.
	 *
	 * The `write` validator is invoked during every persistence cycle, serving as a final check
	 * after operation-specific hooks (like `set` or `delete`).
	 *
	 * **Throw an error to invalidate and abort the operation.**
	 *
	 * @param actionParams - Tuple containing the full data Map to be persisted: `[data: Map<Key, Value>]`.
	 * @param action - The literal action name: `'write'`.
	 */
	write?: (
		this: ThisArg,
		actionParams: [data: Map<Key, Value>],
		action: 'write',
	) => void
}

/**
 * Literal union of all operations that can be intercepted by a validator.
 */
export type Store_ValidateAction =
	| 'clear'
	| 'delete'
	| 'set'
	| 'setAll'
	| 'write'
