import deferred from './deferred'

/** Super for `deferred()` function */
export function debounce(...args: Parameters<typeof deferred>) {
	return deferred(...args)
}
export default debounce
