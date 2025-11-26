# @superutils/fetct

An extended `Promise` implementation, named `PromisE`, that provides additional features and utilities for easier asynchronous flow control in JavaScript and TypeScript applications.

This package offers a drop-in replacement for the native `Promise` that includes status tracking (`.pending`, `.resolved`, `.rejected`) and a suite of powerful static methods for common asynchronous patterns like deferred execution, throttling, and cancellable fetches.

## Features

- **Promise Status**: Easily check if a promise is `pending`, `resolved`, or `rejected`.
- **Deferred Execution**: Defer or throttle promise-based function calls with `PromisE.deferred()`.
- **Auto-cancellable Fetch**: Automatically abort pending requests when subsequent requests are made using `PromisE.deferredFetch()` and `PromisE.deferredPost()`.
- **Auto-cancellable Fetch**: The `PromisE.deferredFetch` and `PromisE.deferredPost` utilities automatically abort pending requests when a new deferred/throttled call is made.
- **Timeouts**: Wrap any promise with a timeout using `PromisE.timeout()`.
- **Rich Utilities**: A collection of static methods like `.all()`, `.race()`, `.delay()`, and more, all returning `PromisE` instances.

## Installation

```bash
npm install @superutils/core @superutils/promise @superutils/fetch
```

## Usage

### `fetch(url, options)`

Make a simple GET request. No need for `response.json()` or `result.data.theActualData` drilling.

```typescript
import { fetch } from '@superutils/fetch'

const theActualData = await fetch('https://dummyjson.com/products/1')
console.log(theActualData)
```

### `fetchDeferred(deferOptions, url, fetchOptions)`

A powerful utility that combines `PromisE.deferred()` from `@superutils/promise` package with `fetch()`. It's perfect for implementing cancellable, debounced/throttled search inputs.

```typescript
import { fetchDeferred, ResolveIgnored } from '@superutils/fetch'

// Create a debounced search function with a 300ms delay.
const searchProducts = fetchDeferred({
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

Using "defaultFetchArgs" to reduce redundancy

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

## Enumerations

- [FetchAs](enumerations/FetchAs.md)
- [ResolveError](enumerations/ResolveError.md)
- [ResolveIgnored](enumerations/ResolveIgnored.md)

## Classes

- [FetchError](classes/FetchError.md)

## Interfaces

- [FetchResult](interfaces/FetchResult.md)

## Type Aliases

- [Config](type-aliases/Config.md)
- [DeferredOptions](type-aliases/DeferredOptions.md)
- [FetchArgs](type-aliases/FetchArgs.md)
- [FetchArgsInterceptor](type-aliases/FetchArgsInterceptor.md)
- [FetchConf](type-aliases/FetchConf.md)
- [FetchDeferredArgs](type-aliases/FetchDeferredArgs.md)
- [FetchDeferredCbArgs](type-aliases/FetchDeferredCbArgs.md)
- [FetchErrMsgs](type-aliases/FetchErrMsgs.md)
- [FetchInterceptorError](type-aliases/FetchInterceptorError.md)
- [FetchInterceptorRequest](type-aliases/FetchInterceptorRequest.md)
- [FetchInterceptorResponse](type-aliases/FetchInterceptorResponse.md)
- [FetchInterceptorResult](type-aliases/FetchInterceptorResult.md)
- [FetchInterceptors](type-aliases/FetchInterceptors.md)
- [FetchOptions](type-aliases/FetchOptions.md)
- [FetchOptionsInterceptor](type-aliases/FetchOptionsInterceptor.md)
- [FetchRetryOptions](type-aliases/FetchRetryOptions.md)
- [Interceptor](type-aliases/Interceptor.md)
- [PostArgs](type-aliases/PostArgs.md)
- [PostBody](type-aliases/PostBody.md)

## Variables

- [config](variables/config.md)

## Functions

- [fetch](functions/fetch.md)
- [fetchDeferred](functions/fetchDeferred.md)
- [getResponse](functions/getResponse.md)
- [mergeFetchOptions](functions/mergeFetchOptions.md)
- [postDeferred](functions/postDeferred.md)

## References

### default

Renames and re-exports [fetch](functions/fetch.md)
