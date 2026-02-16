import { describe, expect, it } from 'vitest'
import { ContentType, mergeOptions } from '../src'

describe('mergeOptions', () => {
	it('should ignore non-object values', () => {
		expect(mergeOptions(null as any, undefined as any)).toEqual({
			errMsgs: {},
			headers: new Headers(),
			interceptors: {
				error: [],
				request: [],
				response: [],
				result: [],
			},
			timeout: undefined,
		})
	})

	it('should merge fetch options correctly', () => {
		const merged = mergeOptions(
			{
				headers: new Headers([
					['content-type', ContentType.APPLICATION_JSON],
				]),
				method: 'get',
			},
			{
				headers: new Headers([
					[
						'content-type',
						ContentType.APPLICATION_X_WWW_FORM_URLENCODED,
					],
				]),
				method: 'post',
			},
			{
				headers: new Headers(),
			},
		)
		expect(merged).toEqual({
			errMsgs: {},
			headers: new Headers([
				['content-type', ContentType.APPLICATION_X_WWW_FORM_URLENCODED],
			]),
			interceptors: {
				error: [],
				request: [],
				response: [],
				result: [],
			},
			method: 'post',
			timeout: undefined,
		})
	})
})
