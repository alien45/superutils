import fallbackIfFails from '../fallbackIfFails'
import { isEnvBrowser } from '../is'

/**
 * @name	copyToClipboard
 * @summary copies text to browser clipboard. Not compatible with NodeJS.
 *
 * @param	{String} str
 */
export const copyToClipboard = (str: string) =>
	isEnvBrowser()
	&& fallbackIfFails(
		() => window.navigator.clipboard.writeText(str),
		[],
		// For older browsers, if clipboard.writeText() is not supported
		() => {
			const el = document.createElement('textarea')
			el.value = str
			el.setAttribute('readonly', '')
			el.style.position = 'absolute'
			el.style.left = '-9999px'
			document.body.appendChild(el)
			el.select()
			document.execCommand('copy')
			document.body.removeChild(el)
		},
	)
export default copyToClipboard
