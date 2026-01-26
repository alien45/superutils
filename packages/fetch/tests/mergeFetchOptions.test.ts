import { describe, expect, it } from 'vitest'
import { ContentType, mergeFetchOptions } from '../src'

describe('mergeFetchOptions', () => {
	it('should ignore non-object values', () => {
		expect(mergeFetchOptions(null as any, undefined as any)).toEqual({
			errMsgs: {},
			headers: new Headers(),
			interceptors: {
				error: [],
				request: [],
				response: [],
				result: [],
			},
			timeout: 0,
		})
	})

	it('should merge fetch options correctly', () => {
		const merged = mergeFetchOptions(
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
			timeout: 0,
		})
	})
})
