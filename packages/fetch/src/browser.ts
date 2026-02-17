/** This is an entrypoint tailored for IIFE builds for browsers. */
import * as promiseExports from '@superutils/promise'
import * as fetchExports from './index'

/**
 * Export the fetch function and include all other exports as it's property
 *
 * ### Usage:
 * - `window.superutils.fetch(...)`
 * - `window.superutils.fetch.get(...)`
 * - `window.superutils.fetch.createClient(...)`
 */
const fetch = fetchExports.default

Object.keys(fetchExports).forEach(key => {
	if (['default', 'fetch'].includes(key)) return
	;(fetch as unknown as Record<string, unknown>)[key] ??= (
		fetchExports as Record<string, unknown>
	)[key]
})
export default fetch

/**
 * Include all exports from @supertuils/promise:
 * 1. as if it were imported independantly
 * 2. only adds ~0.5KB (95%+ of the code is already used by @superutils/fetch)
 * 3. eliminates the need to import it separately
 * window.superutils.fetch(...)
 * window.superutils.fetch.get(...)
 * window.superutils.fetch.createClient(...)
 *
 * Usage:
 * window.
 */
const PromisE = promiseExports.default
Object.keys(promiseExports).forEach(key => {
	if (['default', 'PromisE'].includes(key)) return
	;(PromisE as unknown as Record<string, unknown>)[key] ??= (
		promiseExports as Record<string, unknown>
	)[key]
})
const w = globalThis as unknown as Record<string, Record<string, unknown>>
w.superutils ??= {}
w.superutils.PromisE ??= PromisE
