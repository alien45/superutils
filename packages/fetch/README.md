# @superutils/fetch

A lightweight `fetch` wrapper for browsers and Node.js, designed to simplify data fetching and reduce boilerplate.

This package enhances the native `fetch` API by providing a streamlined interface and integrating practical & useful features from `@superutils/promise`. It offers built-in support for automatic retries, request timeouts, interceptors, and effortless request cancellation, making complex asynchronous flows simple and manageable.

<div v-if="false">

For full API reference check out the [docs page](https://alien45.github.io/superutils/packages/@superutils/fetch/).

</div>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
    - [NPM](#npm)
    - [CDN / Browser](#cdn--browser)
    - [Defaults](#defaults)
        - [Timeout](#timeout)
        - [Conent Type](#content-type)
        - [Response Parsing](#fetch-as)
- [Usage](#usage)
    - [`fetch()`](#fetch): drop-in replacement for built-in `fetch()`
    - [`TimeoutPromise` Instance](#promise-features): finer control over the request
    - [`Method Specific Functions`](#methods)
    - [`fetch.get()`](#fetch-get)
    - [`fetch.get.deferred()`](#fetch-deferred): cancellable and debounced or throttled `fetch()`
    - [`fetch.post()`](#post): make post requests
    - [`fetch.post.deferred()`](#post-deferred): cancellable and debounced or throttled `post()`
    - [`Retry`](#retry) Retry on request failure
    - [`Timeout`](#timeout) Abort request on timeout
    - [`Interceptors/Transformers`](#interceptors)
    - [`createClient()`](#create-client)
    - [`createPostClient()`](#create-post-client)

## Features

- **Simplified API**: Automatically parses JSON responses, eliminating the need for `.then(res => res.json())`.
- **Built-in Retries**: Automatic request retries with configurable exponential or fixed backoff strategies.
- **Request Timeouts**: Easily specify a timeout for any request to prevent it from hanging indefinitely.
- **Cancellable & Debounced Requests**: The `fetch.METHOD.deferred()` utilities provide debouncing and throttling capabilities, automatically cancelling stale or intermediate requests. This is ideal for features like live search inputs.
- **Interceptors**: Hook into the request/response lifecycle to globally modify requests, handle responses, or manage errors.
- **Strongly Typed**: Written in TypeScript for excellent autocompletion and type safety.
- **Isomorphic**: Works seamlessly in both Node.js and browser environments.

## Installation

### NPM

Install using your favorite package manager (e.g., `npm`, `yarn`, `pnpm`, `bun`, etc.):

```bash
npm install @superutils/fetch
```

Dependency: `@superutils/core` and `@superutils/promise` will be automatically installed by package manager

### CDN / Browser

If you are not using a bundler, you can include the minified browser build directly:

```xml
<script src="https://unpkg.com/@superutils/fetch@latest/dist/browser/index.min.js"></script>
```

OR,

```xml
<script src="https://cdn.jsdelivr.net/npm/@superutils/fetch/dist/browser/index.min.js"></script>
```

This will expose a global namespace `superutils` with the following:

```java
// Default export (function) from `@superutils/fetch` + named exports
superutils.fetch
// Default export (class) from `@superutils/promise` + named exports
superutils.PromisE

const { fetch, PromisE } = superutils

// Fetch usage
fetch('url', { method: 'get', timeout: 10_000 })
fetch.get('url')
fetch.createClient({ method: 'post', timeout: 30_000 }, {}, { delay: 500 })

// PromisE usage
new PromisE()
await PromisE.delay(1000)
```

The `@superutils/fetch` browser build includes `PromisE` most (if not all) of it is used internally.
Loading `@superutils/promise` separately will take precedence and override it.

### Defaults

The `fetch.defaults` object allows you to configure global default options, such as headers, interceptors, and timeouts.

#### Timeout

By default, all requests include a 60-second timeout to abort requests that take too long to complete. You can override this per request or globally by setting `fetch.defaults.timeout`:

```javascript
import fetch, { TIMEOUT_FALLBACK, TIMEOUT_MAX } from '@superutils/fetch'

// Set the maximum allowed duration by `setTimeout` (approx 28 days)
fetch.defaults.timeout = TIMEOUT_MAX
```

- Setting `0`, `Infinity`, negative or an invalid number will fallback to `TIMEOUT_FALLBACK` (10 seconds).
- Setting a number higher than `TIMEOUT_MAX` will fallback to `TIMEOUT_MAX`.

<div id="content-type"></div>

#### Content Type

By defualt `fetch()` does not have any default content type header to match the behavior of the built-in `fetch`.

All functions derived from `createPostClient` (eg: `fetch.post()`, `fetch.put()`) will use the default content-type header `application/json`.

<div id="fetch-as"></div>

#### Response Parsing

By default, `fetch()` returns a `Response` object, making it a drop-in replacement for the built-in `fetch`.

All other functions (e.g., `createClient`, `createPostClient`, `fetch.get`...) automatically parse and return the result as JSON by default.

To retrieve the response in a different format (e.g., as text, a blob, or the raw `Response` object), set the `as` option to one of the following `FetchAs` enum values corresponding to the relevant `Response` method:

- `FetchAs.json`
- `FetchAs.text`
- `FetchAs.blob`
- `FetchAs.arrayBuffer`
- `FetchAs.formData`
- `FetchAs.bytes`
- `FetchAs.response`

```javascript
import fetch, { FetchAs } from '@superutils/fetch'

fetch
	.get('[DUMMYJSON-DOT-COM]/products/1', { as: FetchAs.text })
	.then(console.log)
```

> **Note:** To ensure type safety, the `as` property is excluded from `fetch.defaults` in TypeScript. Since this option determines the function's return type, setting it globally would prevent accurate type inference for individual requests.

## Usage

<div id="fetch"></div>

### `fetch(url, options)`

Use as a drop-in replacement to built-in `fetch()`.

```javascript
import fetch from '@superutils/fetch'

fetch('[DUMMYJSON-DOT-COM]/products/1')
	.then(response => response.json())
	.then(console.log)
```

<div id="promise-features"></div>

### `TimeoutPromise` Instance (extends `PromisE`): finer control over the request

All fetch calls return a `TimeoutPromise` instance from (`@superutils/promise`) which means they come with additional features:

1. Status tracking: all instances come additional properties that indicate the current state of the promise and request.

```javascript
import fetch from '@superutils/fetch'

const request = fetch('[DUMMYJSON-DOT-COM]/products/1')

console.log(request.pending) // true

request.then(() => {
	console.log(request.resolved) // true
	console.log(request.pending) // false
	console.log(request.rejected) // false
	console.log(request.aborted) // false
	console.log(request.timedout) // false
})
```

2. Early finalization: all `PromisE` instances expose `.resolve()` and `.reject()` methods that allow early finalization and `.onEarlyFinalize` array that allows adding callbacks to be executed when the promise is finalized externally using these methods. Fetch promises utilize this to abort the request when appropriate.

```javascript
import fetch from '@superutils/fetch'

// Request that will take 5 seconds to resolve
const request = fetch('[DUMMYJSON-DOT-COM]/products?delay=5000')

request.then(result => console.log(result), console.warn)

// Add a callback to do stuff whenever request is aborted externally.
// This will not be invoked if fetch fails or resolves (promise finalized naturally) using the Promise executor.
request.onEarlyFinalize.push((resolved, valueOrReason) =>
	console.log('Aborted externally:', { resolved, valueOrReason }),
)

// resolve/reject before the promise is finalized
request.reject(new Error('No longer needed'))
```

3. `abortCtrl`: an `AbortController` instance either provided in the options or created internally.

4. `cancelAbort()`: function internally stop listening to abort signals. PS: the signal that has been passed to built-in `fetch` cannot be undone.

5. `clearTimeout()`: function to clear timeout, effectively disabling abort on timeout.

6. Promises:

- `data`: the fetch result promise and also an instance of `PromisE`.
- `timeout`: a promise that automatically rejects if request has not completed within provided `options.timeout` duration.

Both of these promises can be externally finalized which will result in the fetch/timeout promise to be resolved or rejected and `abortCtrl` aborted.

7. `options`: all options provided to the fetch function

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

All method specific functions by default return result parsed as JSON. No need for `response.json()` or "result.data.data" drilling.

<div id="fetch-get"></div>

### `fetch.get(url, options)`

Performs a GET request and returns the result parsed as JSON by default.

Equivalent to `fetch(url, { method: 'get', as: 'json' })`.

```javascript
import fetch from '@superutils/fetch'

fetch
	.get('[DUMMYJSON-DOT-COM]/products/1')
	.then(product => console.log({ product }))
```

<div id="fetch-deferred"></div>

### `fetch.get.deferred(deferOptions, defaultUrl, defaultOptions)`

A practical utility that combines `PromisE.deferred()` from the `@superutils/promise` package with `fetch()`. It's perfect for implementing cancellable, debounced, or throttled search inputs.

```javascript
import fetch from '@superutils/fetch'

// Create a debounced search function with a 300ms delay.
const searchProducts = fetch.get.deferred({
	delay: 300, // Debounce delay
	resolveIgnored: 'WITH_UNDEFINED', // Ignored (aborted) promises will resolve with `undefined`
})

// User types 'iphone'
searchProducts('[DUMMYJSON-DOT-COM]/products/search?q=iphone').then(result => {
	console.log('Result for "iphone":', result)
})

// Before 300ms has passed, the user continues typing 'iphone 12'
setTimeout(() => {
	searchProducts('[DUMMYJSON-DOT-COM]/products/search?q=iphone 12').then(
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
- **`delay: 0`**: Disables debouncing and throttling, enabling sequential/queue mode. Both requests ("iphone"
  and "iphone 12") would execute, but one after the other, never simultaneously.
- **`resolveIgnored` (enum)**: Controls how the promise for an aborted request (like the first "iphone" call) resolves.
    1. `ResolveIgnored.WITH_UNDEFINED` (used in the example): The promise for the aborted "iphone"
       request resolves with `undefined`.
    2. `ResolveIgnored.WITH_LAST`: The promise for the aborted "iphone" request waits and resolves with the result
       of the final "iphone 12" request. Both promises resolve to the same value.
    3. `ResolveIgnored.NEVER`: The promise for the aborted "iphone" request is neither resolved nor rejected.
       It will remain pending indefinitely.
- **`resolveError` (enum)**: Controls how failed requests are handled.
    1.  `ResolveError.NEVER`: The promise for a failed request will neither resolve nor reject, causing it to remain pending indefinitely.
        > **Warning:** Use with caution, as this may lead to memory leaks if not handled properly.
    2.  `ResolveError.WITH_ERROR`: The promise resolves with the `FetchError` object instead of being rejected.
    3.  `ResolveError.WITH_UNDEFINED`: The promise resolves with an `undefined` value upon failure.
    4.  `ResolveError.REJECT`: (Default) The promise is rejected with a `FetchError`, adhering to standard promise behavior.

<!-- #### Using defaults to reduce redundancy

```javascript
import fetch from '@superutils/fetch'

// Create a throttled function to fetch a random quote.
// The URL and a 3-second timeout are set as defaults, creating a reusable client.
const getRandomQuote = fetch.get.deferred(
	{
		delay: 300, // Throttle window
		throttle: true,
		// Ignored calls will resolve with the result of the last successful call.
		resolveIgnored: 'WITH_LAST',
	},
	'[DUMMYJSON-DOT-COM]/quotes/random', // Default URL
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
``` -->

<div id="post"></div>

### `fetch.post(url, options)`

Send a POST request to create a new product and receive the parsed JSON response.

```javascript
import fetch from '@superutils/fetch'

const newProduct = { title: 'Perfume Oil' }

fetch.post('[DUMMYJSON-DOT-COM]/products/add', newProduct).then(
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
		delay: 1000, // Throttle window of 1 second
		throttle: true,
		trailing: true, // Ensures the very last update is always saved
		onResult: product => console.log(`[Saved] Product: ${product.title}`),
	},
	'[DUMMYJSON-DOT-COM]/products/add', // Default URL
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
		delay: 300, // debounce delay
		onResult: ({ refreshToken = '' }) => {
			console.log(
				`Auth token successfully refreshed at ${new Date().toISOString()}`,
			)
			currentRefreshToken = refreshToken
		},
	},
	'[DUMMYJSON-DOT-COM]/auth/refresh', // Default URL
	() => ({
		refreshToken: currentRefreshToken,
		expiresInMins: 30,
	}),
)

// First authenticate user to get the initial refresh token and then request new referesh tokens
// First authenticate user to get the initial refresh token and then request new refresh tokens
fetch
	.post<{ refreshToken: string }>(
		'[DUMMYJSON-DOT-COM]/auth/login',
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

<div id="interceptors"></div>

### Interceptors: intercept and/or transform request & result

The following interceptor callbacks allow intercepting and/or transforming at different stages of the request.

#### Interceptor types (executed in sequence):

1. `request`: Request interceptors are executed before a HTTP request is made.
    - To transform the URL simply return a new or modified URL.
    - To transform `fetch` options simply modify the options parameter
2. `response`: Response interceptors are executed after receiving a `fetch` Response regardless of the HTTP status code.
3. `result`: Result interceptors are executed before returning the result. To transform the result simply return a new value.
   PS: if the value of `options.as` is `FetchAs.response` (`"response"`), the value received in result will be a `Response` object.
4. `error`: Error interceptors are executed when the request fails. Error can be transformed by returning a modified/new `FetchError`.

#### Notes:

- All interceptors can be either asynchronous or synchronous functions.
- If an exception is raised while executing the interceptors, it will be gracefully ignored.
- Value returned (transformed) by an interceptor will be carried over to the subsequent interceptor of the same type.
- There are 2 category of interceptors:
    - Local: interceptors provided when making a request.
    - Global: interceptors that are executed application-wide on every request. Global interceptors can be added/accessed at `fetch.defaults.interceptors`. Global interceptors are always executed before local interceptors.

**Example: Interceptor usage**

```javascript
import fetch, { FetchError } from '@superutils/fetch'

const interceptors = {
	error: [
		(err, url, options) => {
			console.log('Request failed', err, url, options)
			// return nothing/undefined to keep the error unchanged
			// or return modified/new error
			err.message = 'My custom error message!'
			// or create a new FetchError by cloning it (make sure all the required properties are set correctly)
			return err.clone('My custom error message!')
		},
	],
	request: [
		(url, options) => {
			// add extra headers or modify request options here
			options.headers.append('x-custom-header', 'some value')

			// transform the URL by returning a modified URL
			return url + '?param=value'
		},
	],
	response: [
		(response, url, options) => {
			if (response.ok) return
			console.log('request was successful', { url, options })

			// You can transform the response by returning different `Response` object or even make a completely new HTTP reuqest.
			// You can transform the response by returning different `Response` object or even make a completely new HTTP request.
			// The subsequent response interceptors will receive the returned response
			return fetch('[DUMMYJSON-DOT-COM]/products/1') // promise will be resolved automatically
		},
	],
	result: [
		(result, url, options) => {
			const productId = Number(
				new URL(url).pathname.split('/products/')[1],
			)
			if (options.method === 'get' && !Number.isNaN(productId)) {
				result.title ??= 'Unknown title'
			}
			return result
		},
	],
}
fetch
	.get('[DUMMYJSON-DOT-COM]/products/1', { interceptors })
	.then(product => console.log({ product }))
```

**Example: Add global request and error interceptors**

```javascript
import fetch from '@superutils/fetch'

const { interceptors } = fetch.defaults

interceptors.request.push((url, options) => {
	// a headers to all requests make by the application
	// add headers to all requests made by the application
	options.headers.append('x-auth', 'token')
})

interceptors.error.push((err, url, options) => {
	// log whenever a request fails
	console.log('Error interceptor', err)
})

// Each time a requst is made using @superutils/fetch, the above interceptors will be executed when appropriate
fetch('[DUMMYJSON-DOT-COM]/products/1').then(console.log, console.warn)
```

<div id="retry"></div>

### Retry

The `retry` option provides a robust mechanism to automatically re-attempt failed requests, with support for both linear and exponential backoff strategies to gracefully handle transient network issues.

```javascript
import fetch from '@superutils/fetch'

fetch
	.get('[DUMMYJSON-DOT-COM]/products/1', {
		retry: 3, // If request fails, retry up to three more times
		// Additionally, you can control the retry strategy by using a function
		retryIf: async (response, retryCount, error) => {
			if (!!error) return true

			// make sure to clone the response if result stream must be consumed here.
			const result = await response.clone().json()
			return result !== 'expected value'
		},
	})
	.then(console.log)
```

<div id="create-client"></div>

### `createClient(fixedOptions, commonOptions, commonDeferOptions)`

The `createClient` utility streamlines the creation of dedicated API clients by generating pre-configured fetch functions. These functions can be equipped with default options like headers, timeouts, or a specific HTTP method, which minimizes code repetition across your application. If a method is not specified during creation, the client will default to `GET`.

The returned client also includes a `.deferred()` method, providing the same debounce, throttle, and sequential execution capabilities found in functions like `fetch.get.deferred()`.

```javascript
import { createClient } from '@superutils/fetch'

// Create a "GET" client with default headers and a 5-second timeout
const apiClient = createClient(
	{
		// fixed options (cannot be overridden)
		method: 'get',
	},
	{
		// common options (can be overridden)
		headers: {
			Authorization: 'Bearer my-secret-token',
			'Content-Type': 'application/json',
		},
		timeout: 5000,
	},
	{
		// defer options (can be overridden)
		delay: 300,
		retry: 2, // If request fails, retry up to two more times
	},
)

// Use it just like the standard fetch
apiClient('[DUMMYJSON-DOT-COM]/products/1', {
	// The 'method' property cannot be overridden as it is used in the fixed options when creating the client.
	// In TypeScript, the compiler will not allow this property.
	// In Javascript, it will simply be ignored.
	// method: 'post',
	timeout: 3000, // The 'timeout' property can be overridden
}).then(console.log, console.warn)

// create a deferred client using "apiClient"
const deferredClient = apiClient.deferred(
	{ retry: 0 }, // disable retrying by overriding the `retry` defer option
	'[DUMMYJSON-DOT-COM]/products/1',
	{ timeout: 3000 },
)
deferredClient({ timeout: 10000 }) // timeout is overridden by individual request
	.then(console.log, console.warn)
```

<div id="create-post-client"></div>

### `createPostClient(fixedOptions, commonOptions, commonDeferOptions)`

While `createClient()` is versatile enough for any HTTP method, `createPostClient()` is specifically designed for methods that require a request body, such as `DELETE`, `PATCH`, `POST`, and `PUT`. If a method is not provided, it defaults to `POST`. The generated client accepts an additional second parameter (`data`) for the request payload.

Similar to `createClient`, the returned function comes equipped with a `.deferred()` method, enabling debounced, throttled, or sequential execution.

```javascript
import { createPostClient } from '@superutils/fetch'

// Create a POST client with 10-second as the default timeout
const postClient = createPostClient(
	{
		headers: { 'content-type': 'application/json' },
	},
	{
		method: 'post',
		timeout: 10000,
	},
)

// Invoking `postClient()` automatically applies the pre-configured options
postClient(
	'[DUMMYJSON-DOT-COM]/products/add',
	{ title: 'New Product' }, // data/body
	{}, // other options
).then(result => console.log('Product created:', result))

// create a deferred client using "postClient"
const deferredPatchClient = postClient.deferred(
	{
		delay: 300,
		// prints only successful results
		onResult: result =>
			console.log('Product updated using deferred funciton:', result),
	},
	'[DUMMYJSON-DOT-COM]/products/add',
	undefined, // data to be provided later
	{
		method: 'patch', // default method for deferredPatchClient
		timeout: 3000,
	},
)
deferredPatchClient({ title: 'New title 1' }) // ignored by debounce
deferredPatchClient({ title: 'New title 2' }) // executed
```
