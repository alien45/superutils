# @superutils/fetch

A lightweight `fetch` wrapper for browsers and Node.js, designed to simplify data fetching and reduce boilerplate.

This package enhances the native `fetch` API by providing a streamlined interface and integrating practical & useful features from `@superutils/promise`. It offers built-in support for automatic retries, request timeouts, interceptors, and effortless request cancellation, making complex asynchronous flows simple and manageable.

## Table of Contents

- Features
- Installation
- Usage
    - [`fetch()`](#fetch): make HTTP requests just like built-in `fetch()`
    - [`Method Specific Functions`](#methods)
    - [`fetch.get.deferred()`](#fetch-deferred): cancellable and debounced or throttled `fetch()`
    - [`fetch.post()`](#post): make post requests
    - [`fetch.post.deferred()`](#post-deferred) cancellable and debounced or throttled `post()`

## Features

- **Simplified API**: Automatically parses JSON responses, eliminating the need for `.then(res => res.json())`.
- **Built-in Retries**: Automatic request retries with configurable exponential or fixed backoff strategies.
- **Request Timeouts**: Easily specify a timeout for any request to prevent it from hanging indefinitely.
- **Cancellable & Debounced Requests**: The `fetch.METHOD.deferred()` utilities provide debouncing and throttling capabilities, automatically cancelling stale or intermediate requests. This is ideal for features like live search inputs.
- **Interceptors**: Hook into the request/response lifecycle to globally modify requests, handle responses, or manage errors.
- **Strongly Typed**: Written in TypeScript for excellent autocompletion and type safety.
- **Isomorphic**: Works seamlessly in both Node.js and browser environments.

## Installation

```bash
npm install @superutils/fetch
```

## Usage

<div id="fetch"></div>

### `fetch(url, options)`

Make a simple GET request. No need for `response.json()` or `result.data.theActualData` drilling.

```typescript
import fetch from '@superutils/fetch'

fetch('https://dummyjson.com/products/1', {
	method: 'get', // default
}).then(theActualData => console.log(theActualData))
// Alternative:
fetch
	.get('https://dummyjson.com/products/1')
	.then(theActualData => console.log(theActualData))
```

<div id="methods"></div>

### Method Specific Functions

While `fetch()` provides access to all HTTP request methods by specifying it in options (eg: `{ method: 'get' }`), for ease of use you can also use the following:

- `fetch.delete(...)`
- `fetch.get(...)`
- `fetch.head(...)`
- `fetch.options(...)`
- `fetch.patch(...)`
- `fetch.post(...)`
- `fetch.put(...)`

**Deferred variants:** To debounce/throttle requests.

- `fetch.delete.deferred(...)`
- `fetch.get.deferred(...)`
- `fetch.head.deferred(...)`
- `fetch.options.deferred(...)`
- `fetch.patch.deferred(...)`
- `fetch.post.deferred(...)`
- `fetch.put.deferred(...)`

<div id="fetch-deferred"></div>

### `fetch.get.deferred(deferOptions, defaultUrl, defaultOptions)`

A practical utility that combines `PromisE.deferred()` from the `@superutils/promise` package with `fetch()`. It's perfect for implementing cancellable, debounced, or throttled search inputs.

```javascript
import fetch from '@superutils/fetch'

// Create a debounced search function with a 300ms delay.
const searchProducts = fetch.get.deferred({
	delayMs: 300, // Debounce delay
	resolveIgnored: 'WITH_UNDEFINED', // Ignored (aborted) promises will resolve with `undefined`
})

// User types 'iphone'
searchProducts('https://dummyjson.com/products/search?q=iphone').then(
	result => {
		console.log('Result for "iphone":', result)
	},
)

// Before 300ms has passed, the user continues typing 'iphone 12'
setTimeout(() => {
	searchProducts('https://dummyjson.com/products/search?q=iphone 12').then(
		result => {
			console.log('Result for "iphone 12":', result)
		},
	)
}, 200)
// Outcome:
// The first request for "iphone" is aborted.
// The first promise resolves with `undefined`.
// The second request for "iphone 12" is executed after the 300ms debounce delay.
```

**Behavior with different `deferOptions` in the example above:**

- **`throttle: true`**: Switches from debounce to throttle mode. The first request for "iphone" would
  execute immediately. The second request for "iphone 12", made within the 300ms throttle window, would be ignored.
- **`delayMs: 0`**: Disables debouncing and throttling, enabling sequential/queue mode. Both requests ("iphone"
  and "iphone 12") would execute, but one after the other, never simultaneously.
- **`resolveIgnored` (enum)**: Controls how the promise for an aborted request (like the first "iphone" call) resolves.
    1. `ResolveIgnored.WITH_UNDEFINED` (used in the example): The promise for the aborted "iphone"
       request resolves with `undefined`.
    2. `ResolveIgnored.WITH_LAST`: The promise for the aborted "iphone" request waits and resolves with the result
       of the final "iphone 12" request. Both promises resolve to the same value.
    3. `ResolveIgnored.NEVER`: The promise for the aborted "iphone" request is neither resolved nor rejected.
       It will remain pending indefinitely.
- **`resolveError` (enum)**: Controls how failed requests are handled.
    1.  `ResolveError.NEVER`: Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks.
    2.  `ResolveError.WITH_LAST`: (default) resolve with active promise result, the one that caused the current promise/callback to be ignored.
    3.  `ResolveError.WITH_UNDEFINED`: resolve failed requests with `undefined` value
    4.  `ResolveError.WITH_ERROR`: The promise for the aborted "iphone" request is rejected with a `FetchError`.

#### Using defaults to reduce redundancy

```javascript
import fetch from '@superutils/fetch'

// Create a throttled function to fetch a random quote.
// The URL and a 3-second timeout are set as defaults, creating a reusable client.
const getRandomQuote = fetch.get.deferred(
	{
		delayMs: 300, // Throttle window
		throttle: true,
		// Ignored calls will resolve with the result of the last successful call.
		resolveIgnored: 'WITH_LAST',
	},
	'https://dummyjson.com/quotes/random', // Default URL
	{ timeout: 3000 }, // Default fetch options
)

// Call the function multiple times in quick succession.
getRandomQuote().then(quote => console.log('Call 1 resolved:', quote))
getRandomQuote().then(quote => console.log('Call 2 resolved:', quote))
getRandomQuote().then(quote => console.log('Call 3 resolved:', quote))

// Outcome:
// Due to throttling, only one network request is made.
// Because `resolveIgnored` is `WITH_LAST`, all three promises resolve with the same quote.
// The promises for the two ignored calls resolve as soon as the first successful call resolves.
// Console output will show the same quote ID for all three calls.
```

<div id="post"></div>

### `fetch.post(url, options)`

Send a POST request to create a new product and receive the parsed JSON response.

```javascript
import fetch from '@superutils/fetch'

const newProduct = { title: 'Perfume Oil' }

fetch.post('https://dummyjson.com/products/add', newProduct).then(
	createdProduct => console.log('Product created:', createdProduct),
	error => console.error('Failed to create product:', error),
)
```

<div id="post-deferred"></div>

### `fetch.post.deferred(deferOptions, url, data, options)`

HTTP POST request with debounce/throttle.

#### Example 1: Auto-saving form data with throttling

```typescript
import fetch from '@superutils/fetch'
import PromisE from '@superutils/promise'

// Create a throttled function to auto-save product updates.
const saveProductThrottled = fetch.post.deferred(
	{
		delayMs: 1000, // Throttle window of 1 second
		throttle: true,
		trailing: true, // Ensures the very last update is always saved
		onResult: product => console.log(`[Saved] Product: ${product.title}`),
	},
	'https://dummyjson.com/products/add', // Default URL
)
// Simulate a user typing quickly, triggering multiple saves.
console.log('User starts typing...')

// Executed immediately (leading edge)
saveProductThrottled({ title: 'iPhone' })
// Ignored (within 1000ms throttle window)
PromisE.delay(200, () => saveProductThrottled({ title: 'iPhone 15' }))
// Ignored
PromisE.delay(300, () => saveProductThrottled({ title: 'iPhone 15 Pro' }))
// Queued to execute on the trailing edge
PromisE.delay(400, () => saveProductThrottled({ title: 'iPhone 15 Pro Max' }))
// Outcome:
// The first call ('iPhone') is executed immediately.
// The next two calls are ignored by the throttle.
// The final call ('iPhone 15 Pro Max') is executed after the 1000ms throttle window closes,
// thanks to `trailing: true`.
// This results in only two network requests instead of four.
```

#### Example 2: debouncing an authentication token refresh

```typescript
import fetch from '@superutils/fetch'
import PromisE from '@superutils/promise'

// Mock a simple token store
let currentRefreshToken = ''
// Create a debounced function to refresh the auth token.
// It waits 300ms after the last call before executing.
const requestNewToken = fetch.post.deferred(
	{
		delayMs: 300, // debounce delay
		onResult: ({ refreshToken = '' }) => {
			console.log(
				`Auth token successfully refreshed at ${new Date().toISOString()}`,
			)
			currentRefreshToken = refreshToken
		},
	},
	'https://dummyjson.com/auth/refresh', // Default URL
	() => ({
		refreshToken: currentRefreshToken,
		expiresInMins: 30,
	}),
)

// First authenticate user to get the initial refresh token and then request new referesh tokens
fetch
	.post<{ refreshToken: string }>(
		'https://dummyjson.com/auth/login',
		{
			username: 'emilys',
			password: 'emilyspass',
			expiresInMins: 30,
		},
		{ credentials: 'include' },
	)
	.then(result => {
		currentRefreshToken = result?.refreshToken

		requestNewToken() // Called at 0ms
		PromisE.delay(50, requestNewToken) // Called at 50ms
		PromisE.delay(100, requestNewToken) // Called at 100ms
	}, console.error)
// Outcome:
// The first two calls are aborted by the debounce mechanism.
// Only the final call executes, 300ms after it was made (at the 400ms mark).
// The token is refreshed only once, preventing redundant network requests.
```
