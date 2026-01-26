import type { FetchOptions } from './types'

/**
 * Add AbortController to options if not present and propagate external abort signal if provided.
 *
 * @param options The fetch options object.
 *
 * @returns The AbortController instance associated with the options.
 */
export const getAbortCtrl = (
	options: Partial<FetchOptions>,
): AbortController => {
	options ??= {}
	if (!(options.abortCtrl instanceof AbortController))
		options.abortCtrl = new AbortController()

	const { abortCtrl, signal } = options

	if (signal instanceof AbortSignal && !signal.aborted) {
		// propagate abort signal
		const handleAbort = () => abortCtrl.abort()
		signal.addEventListener('abort', handleAbort, { once: true })

		abortCtrl.signal.addEventListener(
			'abort',
			() => signal.removeEventListener('abort', handleAbort),
			{ once: true },
		)
	}

	return abortCtrl
}

export default getAbortCtrl
