# @superutils/fetch

A lightweight `fetch` wrapper for browsers and Node.js, designed to simplify data fetching and reduce boilerplate.

This package enhances the native `fetch` API by providing a streamlined interface and integrating practical & useful features from `@superutils/promise`. It offers built-in support for automatic retries, request timeouts, interceptors, and effortless request cancellation, making complex asynchronous flows simple and manageable.

## Table of Contents

- Features
- Installation
- Usage
    - [`fetch()`](#fetch): make HTTP requests just like built-in `fetch()`
    - [`fetchDeferred()`](#fetch-deferred): cancellable and debounced or throttled `fetch()`
    - [`post()`](#post): make post-like requests
    - [`postDeferred()`](#post-deferred) cancellable and debounced or throttled `post()`

## Features

- **Simplified API**: Automatically parses JSON responses, eliminating the need for `.then(res => res.json())`.
- **Built-in Retries**: Automatic request retries with configurable exponential or fixed backoff strategies.
- **Request Timeouts**: Easily specify a timeout for any request to prevent it from hanging indefinitely.
- **Cancellable & Debounced Requests**: The `fetchDeferred` utility provides debouncing and throttling capabilities, automatically cancelling stale or intermediate requests. This is ideal for features like live search inputs.
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
import { fetch } from '@superutils/fetch'

const theActualData = await fetch('https://dummyjson.com/products/1', {
	method: 'get', // default
})
console.log(theActualData)
// Alternative:
const theActualData = await fetch.get('https://dummyjson.com/products/1')
console.log(theActualData)
```

<div id="fetch-deferred"></div>

### `fetch.get.deferred(deferOptions, url, fetchOptions)`

A practical utility that combines `PromisE.deferred()` from the `@superutils/promise` package with `fetch()`. It's perfect for implementing cancellable, debounced, or throttled search inputs.

```typescript
import { fetchDeferred, ResolveIgnored } from '@superutils/fetch'

// Create a debounced search function with a 300ms delay.
const searchProducts = fetch.get.deferred({
	delayMs: 300, // Debounce delay
	resolveIgnored: ResolveIgnored.WITH_UNDEFINED, // Ignored (aborted) promises will resolve with `undefined`
})

// User types 'iphone'
searchProducts('https://dummyjson.com/products/search?q=iphone').then(
	result => {
		console.log('Result for "iphone":', result)
	},
)

// Before 300ms has passed, the user continues typing 'iphone 9'
setTimeout(() => {
	searchProducts('https://dummyjson.com/products/search?q=iphone 9').then(
		result => {
			console.log('Result for "iphone 9":', result)
		},
	)
}, 200)
// Outcome:
// The first request for "iphone" is aborted.
// The first promise resolves with `undefined`.
// The second request for "iphone 9" is executed after the 300ms debounce delay.
```

**Behavior with different `deferOptions` in the example above:**

- **`throttle: true`**: Switches from debounce to throttle mode. The first request for "iphone" would
  execute immediately. The second request for "iphone 9", made within the 300ms throttle window, would be ignored.
- **`delayMs: 0`**: Disables debouncing and throttling, enabling sequential/queue mode. Both requests ("iphone"
  and "iphone 9") would execute, but one after the other, never simultaneously.
- **`resolveIgnored`**: Controls how the promise for an aborted request (like the first "iphone" call) resolves.
    1. `ResolveIgnored.WITH_UNDEFINED` (used in the example): The promise for the aborted "iphone"
       request resolves with `undefined`.
    2. `ResolveIgnored.WITH_LAST`: The promise for the aborted "iphone" request waits and resolves with the result
       of the final "iphone 9" request. Both promises resolve to the same value.
    3. `ResolveIgnored.NEVER`: The promise for the aborted "iphone" request is neither resolved nor rejected.
       It will remain pending indefinitely.
    4. `ResolveIgnored.WITH_ERROR`: The promise for the aborted "iphone" request is rejected with a `FetchError`.

#### Using defaults to reduce redundancy

```typescript
import { fetchDeferred, ResolveIgnored } from '@superutils/fetch'

// Create a throttled function to fetch a random quote.
// The URL and a 3-second timeout are set as defaults, creating a reusable client.
const getRandomQuote = fetchDeferred(
	{
		delayMs: 300, // Throttle window
		throttle: true,
		// Ignored calls will resolve with the result of the last successful call.
		resolveIgnored: ResolveIgnored.WITH_LAST,
	},
	'https://dummyjson.com/quotes/random', // Default URL
	{ timeout: 3000 }, // Default fetch options
)

// Call the function multiple times in quick succession.
getRandomQuote().then(quote => console.log('Call 1 resolved:', quote.id))
getRandomQuote().then(quote => console.log('Call 2 resolved:', quote.id))
getRandomQuote().then(quote => console.log('Call 3 resolved:', quote.id))

// Outcome:
// Due to throttling, only one network request is made.
// Because `resolveIgnored` is `WITH_LAST`, all three promises resolve with the same quote.
// The promises for the two ignored calls resolve as soon as the first successful call resolves.
// Console output will show the same quote ID for all three calls.
```

<div id="post"></div>

### `fetch.post(url, options)`

<div id="post-deferred"></div>

### `fetch.post.deferred(deferOptions, url, postOptions)`

<div id="method-specific"></div>
