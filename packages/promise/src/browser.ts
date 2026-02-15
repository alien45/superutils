/** This is an entrypoint tailored for IIFE builds for browsers. */
import * as allExports from './index'

const { default: PromisE } = allExports

Object.keys(allExports).forEach(key => {
	if (['default', 'PromisE'].includes(key)) return
	const val = (allExports as Record<string, unknown>)[key]

	;(PromisE as unknown as Record<string, unknown>)[key] ??= val
})

export default PromisE
