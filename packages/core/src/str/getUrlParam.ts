import { arrUnique } from '../arr'
import fallbackIfFails from '../fallbackIfFails'
import { isArr, isStr, isUrl } from '../is'

/**
 * Read parameters of a given URL
 *
 * @param name   (optional) name of a specific parameter to get value of.
 * If not provided, will return an object containing all the URL parameters with respective values.
 * @param url (optional) default: `window.location.href`
 * @param asArray (optional) parameter names that should be returned as Array.
 * By default if a parameter contains multiple values it will be returned as unique Array.
 *
 * @returns {String|Object}
 */
export const getUrlParam = <
	TName extends string | undefined,
	TAsArray extends
		| undefined
		| string[]
		| (TName extends undefined ? never : true),
	TResult = TName extends undefined
		? Record<string, string>
		: string | string[],
>(
	name?: TName,
	url?: string | URL,
	asArray?: TAsArray,
): TResult => {
	url ??= fallbackIfFails(() => window.location.href, [], '')
	const _asArray: string[] = isArr<string>(asArray)
		? asArray
		: asArray === true && isStr(name)
			? [name]
			: []
	const prepareResult = (value: unknown = '', values: unknown = {}) =>
		(name
			? isArr(value) || !_asArray.includes(name)
				? value
				: [value].filter(Boolean)
			: values) as TResult

	if (!url) return prepareResult()
	if (typeof URLSearchParams === 'undefined' || !URLSearchParams) {
		const r = getUrlParamRegex(name, url, _asArray)
		return prepareResult(r, r)
	}

	const search = isUrl(url) ? url.search : url.split('?')?.[1] || ''
	if (search === '?' || !search) return prepareResult()

	const params = new URLSearchParams(search)

	const getValue = (paramName: string) => {
		const value = arrUnique(params.getAll(paramName))
		return value.length > 1 || _asArray.includes(paramName)
			? value
			: value[0]
	}

	if (name) return prepareResult(getValue(name))

	const result: Record<string, string | string[]> = {}
	for (const name of arrUnique([...params.keys()])) {
		result[name] = getValue(name)
	}

	return result as TResult
}

/**
 * Get url params using regex as a fallback for {@link getUrlParam}.
 * For older browsers or environments where `URLSearchParams` is not supported.
 */
const getUrlParamRegex = (
	name?: string,
	url?: string | URL,
	asArray: string[] = [],
) => {
	url ??= fallbackIfFails(() => window.location.href, [], '')

	if (isUrl(url)) url = url.toString()

	const params: Record<string, string | string[]> = {}
	const regex = /[?&]+([^=&]+)=([^&]*)/gi

	url?.replace(regex, (_, name: string, value: string) => {
		value = decodeURIComponent(value)
		if (asArray.includes(name) || params[name] !== undefined) {
			params[name] = isArr(params[name]) ? params[name] : [params[name]]
			params[name] = arrUnique([...params[name], value]).filter(Boolean)
		} else {
			params[name] = value
		}
		return ''
	})
	return name ? params[name] : params
}
