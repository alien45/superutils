/** Check if value is instance of URL */
export const isUrl = (x: unknown): x is URL => x instanceof URL

/**
 * Check if a value is a valid URL/string-URL.
 *
 * @param x The value to check.
 * @param strict If true:
 * - requires a domain name with a TLDs etc.
 * - and x is string, catches any auto-correction (eg: trailing spaces being removed, spaces being replaced by `%20`)
 * by `new URL()` to ensure string URL is valid
 * Defaults to `true`.
 * @param tldExceptions when in strict mode, treat these hosts as valid despite no domain name extensions
 * Defaults to `['localhost']`
 *
 * @returns `true` if the value is a valid URL, `false` otherwise.
 */
export const isUrlValid = (
	x: unknown,
	strict = true,
	tldExceptions = ['localhost'],
) => {
	if (!x) return false
	try {
		if (typeof x !== 'string' && !isUrl(x)) return false
		const url = isUrl(x) ? x : new URL(x)
		// If strict mode is set to `true` and if a string value provided, it must match resulting value of new URL(x).
		// This can be used to ensure that a URL can be queried without altering.
		if (!strict) return true

		// require domain name & extension when not using localhost
		const gotTld =
			tldExceptions.includes(url.hostname)
			|| url.host.split('.').length > 1
		if (!gotTld) return false

		// catch any auto-correction by `new URL()` to ensure string URL is valid
		// Eg: spaces in the domain name being replaced by `%20` or missing `/` in protocol being auto added
		// Eg: trailing and leading spaces being removed
		let y = `${x}`
		if (y.endsWith(url.hostname)) y += '/'
		return url.href === y
	} catch (_) {
		return false
	}
}
export default isUrl
