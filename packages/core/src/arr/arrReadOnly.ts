import { objReadOnly, type ReadOnlyConfig } from '../obj'

/**
 * Sugar for `objReadOnly()` for an Array
 *
 * @param arr
 * @param config (optional)
 * @param config.add (optional) Whether to allow adding new properties. Default: `false`
 * @param config.revocable (optional) Default: `false`
 * @param config.silent (optional) Whether to throw error when a write operation is rejected. Default: `true`
 *
 * @returns Readonly Array or object containing readonly Array and revoke function
 */
export const arrReadOnly = <T>(
	arr: T[],
	config: Omit<ReadOnlyConfig<T[]>, 'revoke'> = {},
) => objReadOnly(new ReadOnlyArrayHelper(config, arr) as T[], config)

export default arrReadOnly

/**
 * Helper class for creating read-only arrays.
 *
 * Caution: This class can by itself only make the array partially read-only.
 * Use {@link arrReadOnly()} instead.
 */
export class ReadOnlyArrayHelper<T> extends Array<T> {
	constructor(
		readonly config: Omit<ReadOnlyConfig<T[]>, 'revoke'>,
		arr: T[],
	) {
		config.silent ??= true
		super(...arr)
	}

	private ignoreOrThrow = <RV>(returnValue: RV): RV => {
		if (this.config.silent) return returnValue

		throw new Error('Mutation not allowed on read-only array')
	}

	pop = () => this.ignoreOrThrow(this[this.length - 1])

	push = (...items: T[]) =>
		!this.config.add
			? this.ignoreOrThrow(this.length)
			: super.push(...items)

	reverse = () => this.ignoreOrThrow(this)

	shift = () => this.ignoreOrThrow(this[0])

	splice = (..._ignoredArgs: unknown[]) => this.ignoreOrThrow([])

	unshift = (..._ignoredArgs: T[]) => this.ignoreOrThrow(this.length)

	// fromAsync = super.fromAsync

	reduce = super.reduce

	reduceRight = super.reduceRight
}
