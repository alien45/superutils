/**
 * A type-safe extension of the built-in Map.
 *
 * While a standard `Map<K, V>` returns a union `V | undefined` for any key,
 * `StrictMap<T>` uses the property types of `T` to provide specific types for
 * known keys when using `.get()`.
 *
 * @template T - The object structure providing the key-value types.
 */
export type TypedMap<
	T extends object,
	Key extends keyof T = keyof T,
	Value = T[Key],
> = Omit<Map<Key, Value>, 'get' | 'set'> & {
	get<K extends Key>(key: K): T[K] | undefined

	set<K extends Key>(key: K, value: T[K]): Map<Key, Value>
}
