/** This is an entrypoint tailored for IIFE builds for browsers. */
import * as allExports from './index'

const { default: fetch } = allExports

Object.keys(allExports).forEach(key => {
	if (['default', 'fetch'].includes(key)) return
	;(fetch as unknown as Record<string, unknown>)[key] ??= (
		allExports as Record<string, unknown>
	)[key]
})

export default fetch
