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
setInterval(() => {}, 1e8) // keep the Node.js process alive
const deferredFn = PromisE.deferred({
	delayMs: 100,
	resolveIgnored: ResolveIgnored.WITH_LAST,
	throttle: true,
})
const executionOrder: number[] = []
Promise.all(
	new Array(3).fill(0).map((_, i) =>
		deferredFn(() => {
			executionOrder.push(i + 1)
			return PromisE.delay(50, i + 1)
		}).then(console.log),
	),
)

// all.then(() => console.log({ executionOrder }))

const example = async (options: Partial<DeferredAsyncOptions>) => {
	console.log('\n\nOptions:', options)
	const df = PromisE.deferred({
		delayMs: 100,
		resolveIgnored: ResolveIgnored.WITH_LAST,
		// onResult: result => console.log({ result }),
		onIgnore: () => console.log('Call ignored'),
		...options,
	})
	const all = [
		df(() => PromisE.delay(400)).then(console.log),
		df(() => PromisE.delay(500)).then(console.log),
		df(() => PromisE.delay(1000)).then(console.log),
		// delay 2 seconds and invoke df() again
		// PromisE.delay(1050, () => df(() => PromisE.delay(200))).then(
		// 	console.log,
		// ),
	]
	return await Promise.all(all)
}

// Without throttle
// example(false)
// // `1000` and `200` will be printed in the console
// // with throttle
// example({ throttle: true, trailing: true })
// `5000` and `200` will be printed in the console
// with throttle with strict mode
// example({ throttle: true, trailing: true })
// `5000` will be printed in the console

//----------------------------------------------------------------
// Create a throttled function to auto-save product updates.
// const saveProductThrottled = fetch.post.deferred(
// 	{
// 		delayMs: 1000, // Throttle window of 1 second
// 		throttle: true,
// 		trailing: true, // Ensures the very last update is always saved
// 		onResult: product => console.log(`[Saved] Product: ${product.title}`),
// 	},
// 	'https://dummyjson.com/products/add', // Default URL
// )
// // Simulate a user typing quickly, triggering multiple saves.
// console.log('User starts typing...')
// saveProductThrottled({ title: 'iPhone' }) // Executed immediately (leading edge)
// PromisE.delay(200, () => saveProductThrottled({ title: 'iPhone 15' })) // Ignored (within 1000ms throttle window)
// PromisE.delay(300, () => saveProductThrottled({ title: 'iPhone 15 Pro' })) // Ignored
// PromisE.delay(400, () => saveProductThrottled({ title: 'iPhone 15 Pro Max' })) // Queued to execute on the trailing edge
// Outcome:
// The first call ('iPhone') is executed immediately.
// The next two calls are ignored by the throttle.
// The final call ('iPhone 15 Pro Max') is executed after the 1000ms throttle window closes,
// thanks to `trailing: true`.
// This results in only two network requests instead of four.

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
