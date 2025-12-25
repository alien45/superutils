import {
	fallbackIfFails,
	toDatetimeLocal,
	TupleMaxLength,
	arrReverse,
	reverse,
	randomInt,
	deferred,
	throttled,
} from '@superutils/core'
import { PromisE, IPromisE, DeferredAsyncOptions } from '@superutils/promise'

import {
	BehaviorSubject,
	copyRxSubject,
	IntervalSubject,
	subjectAsPromise,
	SubjectLike,
} from '@superutils/rx'
import { delay, distinctUntilChanged, throttle } from 'rxjs'
import fetch, { ResolveIgnored, postDeferred } from '@superutils/fetch'

console.log('Started')

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
