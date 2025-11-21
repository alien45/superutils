import { arrUnique } from '../arr'
import fallbackIfFails from '../fallbackIfFails'
import { isUrl } from '../is'

/**
 * @name    getUrlParam
 * @summary read parameters of a given URL
 *
 * @param name   (optional) name of a specific parameter to get value of.
 * If not provided, will return an object containing all the URL parameters with respective values.
 * @param url (optional) default: `window.location.href`
 * @param arrayNames (optional) parameter names that should be returned as Array.
 * By default if a parameter contains multiple values it will be returned as unique Array.
 *
 * @returns {String|Object}
 */
export const getUrlParam = (
	name?: string,
	url?: string | URL,
	arrayNames: string[] = [],
) => {
	url ??= fallbackIfFails(() => window.location.href, [], '')

	try {
		const search = isUrl(url)
			? url.search
			: '?' + (url.split('?')?.[1] || '')
		if (!search) return {}

		const params = new URLSearchParams(search)

		if (name) return params.get(name)

		const result: Record<string, string | string[]> = {}
		const uniqKeys = arrUnique([...params.keys()])
		for (const key of uniqKeys) {
			const value = arrUnique(params.getAll(key))
			result[key] =
				value.length > 1 || arrayNames.includes(key)
					? value
					: (value[0] ?? '')
		}

		return result
	} catch (_) {
		return getUrlParamRegex(name, url, arrayNames)
	}
}

/** Get url params using regex. For older browsers where URLSearchParams is not supported */
export const getUrlParamRegex = (
	name?: string,
	url?: string | URL,
	arrayNames: string[] = [],
) => {
	url ??= fallbackIfFails(() => window.location.href, [], '')
	if (isUrl(url)) url = url.toString()
	const params: Record<string, string | string[]> = {}
	const regex = /[?&]+([^=&]+)=([^&]*)/gi

	url.replace(regex, (_, name: string, value: string) => {
		value = decodeURIComponent(value)
		if (arrayNames.includes(name)) params[name] ??= []
		if (params[name] === undefined) {
			params[name] = value
			return ''
		}
		params[name] = arrUnique([...params[name], value])
		return ''
	})
	return name ? params[name] || '' : params
}
