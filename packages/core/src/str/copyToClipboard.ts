import { fallbackIfFails } from '../fallbackIfFails'

/**
 * @summary Copies text to browser clipboard.
 *
 * CAUTION:
 * Based on browser security policy it may be required to invoke `copyToClipboard` from an user-generated event handler.
 *
 * This function first attempts to use the modern, asynchronous Clipboard API (`window.navigator.clipboard.writeText`).
 * If that fails or is unavailable, it falls back to the legacy `document.execCommand('copy')` method.
 *
 *
 * @param	{String} str
 *
 * @returns number
 * `0`: copy failed (both methods attempted)
 * `1`: modern API success
 * `2`: fallback success
 */
export const copyToClipboard = (str: string): Promise<0 | 1 | 2> =>
	fallbackIfFails(
		// First attempt: modern clipboard API
		() => navigator.clipboard.writeText(str).then(() => 1),
		[],
		// If clipboard API is not available or fails, use the fallback method
		() =>
			fallbackIfFails(
				() => {
					const el = document.createElement('textarea')
					el.value = str
					el.setAttribute('readonly', '')
					el.style.position = 'absolute'
					el.style.left = '-9999px'
					document.body.appendChild(el)
					el.select()

					const result = document.execCommand('copy')
					document.body.removeChild(el)
					return Promise.resolve(result ? 2 : 0)
				},
				[],
				() => Promise.resolve(0),
			),
	)
export default copyToClipboard
