import { objReadOnly, type ObjReadOnlyConf } from '../obj'

/**
 * @name	arrReadOnly
 * @summary sugar for `objReadOnly()` for an Array
 *
 * @param input
 * @param config (optional)
 * @param config.silent
 * @param config.strict
 * @param config.revocable
 *
 * @returns Readonly Array or object containing readonly Array and revoke function
 */
export const arrReadOnly = <
	T extends unknown[],
	Revocable extends true | false = false,
>(
	input: T,
	config?: ObjReadOnlyConf<T, Revocable>,
) => objReadOnly(input, config)

export default arrReadOnly
