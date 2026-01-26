# @superutils/fetch

A lightweight `fetch` wrapper for browsers and Node.js, designed to simplify data fetching and reduce boilerplate.

This package enhances the native `fetch` API by providing a streamlined interface and integrating practical & useful features from `@superutils/promise`. It offers built-in support for automatic retries, request timeouts, interceptors, and effortless request cancellation, making complex asynchronous flows simple and manageable.

<div v-if="false">

For full API reference check out the [docs page](https://alien45.github.io/superutils/packages/@superutils/fetch/).

</div>

## Table of Contents

- Features
- Installation
- Usage
    - [`fetch()`](#fetch): drop-in replacement for built-in `fetch()`
    - [`PromisE Features`](#promise-features): status, early finalization etc
    - [`Method Specific Functions`](#methods)
    - [`fetch.get()`](#fetch-get)
    - [`fetch.get.deferred()`](#fetch-deferred): cancellable and debounced or throttled `fetch()`
    - [`fetch.post()`](#post): make post requests
    - [`fetch.post.deferred()`](#post-deferred): cancellable and debounced or throttled `post()`
    - [`Retry`](#retry) Retry on request failure
    - [`Timeout`](#timeout) Abort request on timeout
    - [`Interceptors/Transformers`](#interceptors)
    - [`Reusable Clients`](#reusable-clients)

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

Use as a drop-in replacement to built-in `fetch()`.

```javascript
import fetch from '@superutils/fetch'

fetch('https://dummyjson.com/products/1')
	.then(response => response.json())
	.then(console.log)
```

<div id="promise-features"></div>

### PromisE Instance: status, early cancellation

All fetch calls return a `PromisE` (`@superutils/promise`) instance which means they come with additional features available in `PromisE`:

1. Status tracking: all instances come with `.pending`, `.resolved` and `.rejected` attributes that indicate the current state of the promise.

    ```javascript
    import fetch from '@superutils/fetch'

    const request = fetch('https://dummyjson.com/products/1')

    console.log(request.pending) // true

    request.then(() => {
    	console.log(request.resolved) // true
    	console.log(request.pending) // false
    	console.log(request.rejected) // false
    })
    ```

2. Early finalization: all `PromisE` instances expose `.resolve()` and `.reject()` methods that allow early finalization and `.onEarlyFinalize` array that allows adding callbacks to be executed when the promise is finalized externally using these methods. Fetch promises utilize this to abort the request when appropriate.

    ```javascript
    import fetch from '@superutils/fetch'

    // Request that will take 5 seconds to resolve
    const request = fetch('https://dummyjson.com/products?delay=5000')

    request.then(result => console.log(result), console.warn)

    // Add a callback to do stuff whenever request is aborted externally.
    // This will not be invoked if fetch fails or resolves (promise finalized naturally) using the Promise executor.
    request.onEarlyFinalize.push((resolved, valueOrReason) =>
    	console.log('Aborted externally:', { resolved, valueOrReason }),
    )

    // resolve/reject before the promise is finalized
    request.reject(new Error('No longer needed'))
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

All method specific functions by default return result parsed as JSON. No need for `response.json()` or `result.data.data` drilling.

<div id="fetch-get"></div>

### `fetch.get(url, options)`

Performs a GET request and returns the result parsed as JSON by default.

Equivalent to `fetch(url, { method: 'get', as: 'json' })`.

```javascript
import fetch from '@superutils/fetch'

fetch
	.get('https://dummyjson.com/products/1')
	.then(product => console.log({ product }))
```

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
    1.  `ResolveError.NEVER`: The promise for a failed request will neither resolve nor reject, causing it to remain pending indefinitely.
        > **Warning:** Use with caution, as this may lead to memory leaks if not handled properly.
    2.  `ResolveError.WITH_ERROR`: The promise resolves with the `FetchError` object instead of being rejected.
    3.  `ResolveError.WITH_UNDEFINED`: The promise resolves with an `undefined` value upon failure.
    4.  `ResolveError.REJECT`: (Default) The promise is rejected with a `FetchError`, adhering to standard promise behavior.

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
// First authenticate user to get the initial refresh token and then request new refresh tokens
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
    			return fetch('https://dummyjson.com/products/1') // promise will be resolved automatically
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
    	.get('https://dummyjson.com/products/1', { interceptors })
    	.then(product => console.log({ product }))
    ```

    - Global: interceptors that are executed application-wide on every request. Global interceptors can be added/accessed at `fetch.defaults.interceptors`. Global interceptors are always executed before local interceptors.

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
        fetch('https://dummyjson.com/products/1').then(
        	console.log,
        	console.warn,
        )
        ```

<div id="retry"></div>

### Retry

The `retry` option provides a robust mechanism to automatically re-attempt failed requests, with support for both linear and exponential backoff strategies to gracefully handle transient network issues.

```javascript
import fetch from '@superutils/fetch'

fetch.get('https://dummyjson.com/products/1', {
	retry: 3, // Max number of retries.
	retryBackOff: 'linear', // Backoff strategy: 'linear' or 'exponential'.
	// Delay in milliseconds.
	// - 'linear': Constant delay between each attempt.
	// - 'exponential': Initial delay that doubles with each retry.
	retryDelay: 300,
	retryDelayJitter: true, // Add random delay to avoid thundering herd.
	retryDelayJitterMax: 100, // Max jitter delay (ms).
	retryIf: (response, retryCount, error) => {
		console.log('Attempt #', retryCount + 1)
		// re-attempt if status code not 200
		return response.status !== 200
	},
})
```

<div id="timeout"></div>

### Request Timeout

A request can be automatically cancelled by simply providing a `timeout` duration in milliseconds. Internally, `fetch` uses an `AbortController` to cancel the request if it does not complete within the specified time.

```javascript
import fetch from '@superutils/fetch'

fetch.get('https://dummyjson.com/products/1', {
	timeout: 5000,
})
```

<div id="fetch-as"></div>

### Response Parsing

By default, `fetch()` returns a `Response` object, making it a drop-in replacement for the built-in `fetch`.

However, all method-specific functions (e.g., `fetch.get`, `fetch.post`, `fetch.get.deferred`) automatically parse and return the result as JSON.

To retrieve the response in a different format (e.g., as text, a blob, or the raw `Response` object), set the `as` option to one of the following `FetchAs` values:

- `FetchAs.json`
- `FetchAs.text`
- `FetchAs.blob`
- `FetchAs.arrayBuffer`
- `FetchAs.formData`
- `FetchAs.bytes`
- `FetchAs.response`

> **Note:** When not using TypeScript, you can simply pass the string value (e.g., `'text'`, `'blob'`, `'response'`).

```typescript
import fetch, { FetchAs } from '@superutils/fetch'

fetch.get('https://dummyjson.com/products/1', {
	as: FetchAs.text,
})
```

<div id="reusable-clients"></div>

### `createClient(fixedOptions, commonOptions, commonDeferOptions)`: Reusable Clients

The `createClient` utility streamlines the creation of dedicated API clients by generating pre-configured fetch functions. These functions can be equipped with default options like headers, timeouts, or a specific HTTP method, which minimizes code repetition across your application. If a method is not specified during creation, the client will default to `GET`.

The returned client also includes a `.deferred()` method, providing the same debounce, throttle, and sequential execution capabilities found in functions like `fetch.get.deferred()`.

```javascript
import { createClient } from '@superutils/fetch'

// Create a "GET" client with default headers and a 5-second timeout
const apiClient = createClient(
	{
		// fixed options cannot be overridden
		method: 'get',
	},
	{
		// default options can be overridden
		headers: {
			Authorization: 'Bearer my-secret-token',
			'Content-Type': 'application/json',
		},
		timeout: 5000,
	},
	{
		// default defer options (can be overridden)
		delayMs: 300,
		retry: 2, // If request fails, retry up to two more times
	},
)

// Use it just like the standard fetch
apiClient('https://dummyjson.com/products/1', {
	// The 'method' property cannot be overridden as it is used in the fixed options when creating the client.
	// In TypeScript, the compiler will not allow this property.
	// In Javascript, it will simply be ignored.
	// method: 'post',
	timeout: 3000, // The 'timeout' property can be overridden
}).then(console.log, console.warn)

// create a deferred client using "apiClient"
const deferredClient = apiClient.deferred(
	{ retry: 0 }, // disable retrying by overriding the `retry` defer option
	'https://dummyjson.com/products/1',
	{ timeout: 3000 },
)
deferredClient({ timeout: 10000 }) // timeout is overridden by individual request
	.then(console.log, console.warn)
```

### `createPostClient(mandatoryOptions, commonOptions, commonDeferOptions)`: Reusable Post-like Clients

While `createClient()` is versatile enough for any HTTP method, `createPostClient()` is specifically designed for methods that require a request body, such as `DELETE`, `PATCH`, `POST`, and `PUT`. If a method is not provided, it defaults to `POST`. The generated client accepts an additional second parameter (`data`) for the request payload.

Similar to `createClient`, the returned function comes equipped with a `.deferred()` method, enabling debounced, throttled, or sequential execution.

```javascript
import { createPostClient, FetchAs } from '@superutils/fetch'

// Create a POST client with 10-second as the default timeout
const postClient = createPostClient(
	{
		method: 'post',
		headers: { 'content-type': 'application/json' },
	},
	{ timeout: 10000 },
)

// Invoking `postClient()` automatically applies the pre-configured options
postClient(
	'https://dummyjson.com/products/add',
	{ title: 'New Product' }, // data/body
	{}, // other options
).then(console.log)

// create a deferred client using "postClient"
const updateProduct = postClient.deferred(
	{
		delayMs: 300, // debounce duration
	},
	'https://dummyjson.com/products/1',
	{
		method: 'patch',
		timeout: 3000,
	},
)
updateProduct({ title: 'New title 1' }) // ignored by debounce
updateProduct({ title: 'New title 2' }) // executed
```
