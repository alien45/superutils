import {
	fallbackIfFails,
	toDatetimeLocal,
	TupleMaxLength,
	arrReverse,
	reverse,
	randomInt,
	deferred,
} from '@superutils/core'
import { PromisE, IPromisE, DeferredAsyncOptions } from '@superutils/promise'

import {
	BehaviorSubject,
	copyRxSubject,
	IntervalSubject,
	subjectAsPromise,
	SubjectLike,
} from '@superutils/rx'
import { delay, distinctUntilChanged } from 'rxjs'
import fetch, { FetchAs, FetchError, ResolveIgnored } from '@superutils/fetch'

console.log('Started')

// fetch
// 	.get('https://dummyjson.com/products/1', {
// 		interceptors: {
// 			error: [
// 				(err, url, options) => {
// 					console.log('Request failed', err, url, options)
// 					// return nothing/undefined to keep the error unchanged
// 					// or return modified/new error
// 					err.message = 'My custom error message!'
// 					return err
// 				},
// 			],
// 			request: [
// 				(url, options) => {
// 					// add extra headers or modify request options here
// 					options.headers.append('x-custom-header', 'some value')

// 					// transform the URL by returning a modified URL
// 					return url + '?param=value'
// 				},
// 			],
// 			response: [
// 				async (response, url, options) => {
// 					if (response.ok)
// 						console.log('request was successful', { url, options })
// 				},
// 			],
// 			result: [
// 				(result, url, options) => {
// 					const productId = Number(
// 						new URL(url).pathname.split('/products/')[1],
// 					)
// 					if (options.method === 'get' && !Number.isNaN(productId)) {
// 						;(result as { title: string }).title ??= 'Unknown title'
// 					}
// 					return result
// 				},
// 			],
// 		},
// 	})
// 	.then(product => console.log({ product }))

// ----------------------------------------------------------------
// // Create a throttled function to fetch a random quote.
// // The URL and a 3-second timeout are set as defaults, creating a reusable client.
// const getRandomQuote = fetch.get.deferred(
// 	{
// 		delayMs: 300, // Throttle window
// 		throttle: true,
// 		// Ignored calls will resolve with the result of the last successful call.
// 		resolveIgnored: ResolveIgnored.WITH_UNDEFINED,
// 	},
// 	'https://dummyjson.com/quotes/random', // Default URL
// 	// { timeout: 3000 }, // Default fetch options
// )

// // Call the function multiple times in quick succession.
// getRandomQuote().then(quote => console.log('Call 1 resolved:', quote))
// getRandomQuote().then(quote => console.log('Call 2 resolved:', quote))
// getRandomQuote().then(quote => console.log('Call 3 resolved:', quote))

// ----------------------------------------------------------------
// const newProduct = { title: 'Perfume Oil' }

// fetch.post('https://dummyjson.com/products/add', newProduct).then(
// 	createdProduct => console.log('Product created:', createdProduct),
// 	error => console.error('Failed to create product:', error),
// )

// ----------------------------------------------------------------
// const dfc = PromisE.deferredCallback(
// 	(value: unknown) => {
// 		console.log('Executing with value:', value)
// 		return value
// 	},
// 	{
// 		delayMs: 300,
// 		throttle: true,
// 		// trailing: true,
// 		resolveIgnored: ResolveIgnored.WITH_LAST,
// 		onResult: result => console.log({ result }),
// 		onError: er => console.error('Error in deferred fetch:', er),
// 		onIgnore: getPromise =>
// 			getPromise().then(r => console.log('Ignored call', r)),
// 	},
// )

// dfc('First Call')
// dfc('Second Call')
// dfc('Third Call')
