# [@superutils/promise](https://www.npmjs.com/package/@superutils/promise)

An extended `Promise` implementation, named `PromisE`, that provides additional features and utilities for easier asynchronous flow control in JavaScript and TypeScript applications.

This package offers a drop-in replacement for the native `Promise` that includes status tracking (`.pending`, `.resolved`, `.rejected`) and a suite of practical static methods for common asynchronous patterns like deferred execution, throttling, and cancellable fetches.

<div v-if="false">

For full API reference check out the [docs page](https://alien45.github.io/superutils/packages/@superutils/promise/).

</div>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
    - [`new PromisE(executor)`](#promise-executor): Drop-in replacement for `Promise`
    - [`new PromisE(promise)`](#promise-status): Check promise status
    - [`PromisE.try()`](#static-methods): Static methods
    - [`PromisE.delay()`](#delay): Async delay
    - [`PromisE.deferred()`](#deferred): Async debounced/throttled callback
    - [`PromisE.timeout()`](#timeout): Reject after timeout

## Features

- **Promise Status**: Easily check if a promise is `pending`, `resolved`, or `rejected`.
- **Deferred Execution**: Defer or throttle promise-based function calls with `PromisE.deferred()`.
- **Auto-cancellable Fetch**: Automatically abort pending requests when subsequent requests are made using `PromisE.deferredFetch()` and `PromisE.deferredPost()`.
- **Auto-cancellable Fetch**: The `PromisE.deferredFetch` and `PromisE.deferredPost` utilities automatically abort pending requests when a new deferred/throttled call is made.
- **Timeouts**: Wrap any promise with a timeout using `PromisE.timeout()`.
- **Rich Utilities**: A collection of static methods like `.all()`, `.race()`, `.delay()`, and more, all returning `PromisE` instances.

## Installation

```bash
npm install @superutils/core @superutils/promise
```

## Usage

<div id="promise-executor"></div>

### `new PromisE(executor)`: Drop-in replacement for `Promise`

The `PromisE` class can be used just like the native `Promise`. The key difference is the addition of status properties:

```typescript
import { PromisE } from '@superutils/promise'

const p = new PromisE(resolve => setTimeout(() => resolve('done'), 1000))

console.log(p.pending) // true

p.then(result => {
	console.log(result) // 'done'
	console.log(p.resolved) // true
	console.log(p.pending) // false
})
```

and the ability to early finalize a promise:

```typescript
import { PromisE } from '@superutils/promise'
const p = new PromisE(resolve => setTimeout(() => resolve('done'), 10000))
p.then(result => console.log(result))
// resolve the promise early
setTimeout(() => p.resolve('finished early'), 500)
```

<div id="static-methods"></div>

### `PromisE.try(fn)`: Static methods

Drop-in replacement for all `Promise` static methods such as `.all()`, `.race()`, `.reject`, `.resolve`, `.try()`, `.withResolvers()`....

```typescript
import { PromisE } from '@superutils/promise'

const p = PromisE.try(() => {
	throw new Error('Something went wrong')
})

p.catch(error => {
	console.error(error.message) // 'Something went wrong'
	console.log(p.rejected) // true
})
```

<div id="promise-status"></div>

### `new PromisE(promise)`

Check status of an existing promise.

```typescript
import { PromisE } from '@superutils/promise'
const x = Promise.resolve(1)
const p = new PromisE(x)
console.log(p.pending) // false
console.log(p.resolved) // true
console.log(p.rejected) // false
```

<div id="delay"></div>

### `PromisE.delay(duration)`: Async delay

Creates a promise that resolves after a specified duration, essentially a promise-based `setTimeout`.

```typescript
import PromisE from '@superutils/promise'
// Wait until `appReady` becomes truthy but
while (!appReady) {
	await PromisE.delay(100)
}
```

#### `PromisE.delay(duration, callback)`: execute after delay

Creates a promise that executes a function after a specified duration and returns the value the function returns.

If callback returns undefined, default value will be the duration.

```typescript
import PromisE from '@superutils/promise'

const callback = () => {
	/* do stuff here */
}
await PromisE.delay(100, callback)
```

<div id="deferred"></div>

### `PromisE.deferred(options)`: async debounced/throttled execution

Create a function that debounces or throttles promise-returning function calls. This is useful for scenarios like auto-saving user input or preventing multiple rapid API calls.

```typescript
import PromisE, { ResolveIgnored } from '@superutils/promise'

// Create a deferred function that waits 300ms after the last call
const deferredSave = PromisE.deferred({
	defer: 300,
	/** ignored promises will resolve with `undefined` */
	resolveIgnored: ResolveIgnored.WITH_UNDEFINED,

	/** ignored promises will NEVER be resolved/rejected
	 * USE WITH CAUTION!
	 */
	resolveIgnored: ResolveIgnored.NEVER,

	// ignored promises will resolve with the result of the last call
	resolveIgnored: ResolveIgnored.WITH_LAST, // (default)
})

// Simulate rapid calls
deferredSave(() => api.save({ text: 'first' }))
deferredSave(() => api.save({ text: 'second' }))
// Only the 3rd call is executed.
// But all of them are resolved with the result of the 3rd call when `resolveIgnored` is `ResolveIgnored.WITH_LAST`
deferredSave(() => api.save({ text: 'third' })).then(response =>
	console.log('Saved!', response),
)
```

<div id="deferredCallback"></div>

### `PromisE.deferredCallback(callback, options)`: async debounced/throttled callbacks

Same as `PromisE.deferred` but for event handlers etc.

```typescript
import PromisE from '@superutils/promise'

// Input change handler
const handleChange = (e: { target: { value: number } }) =>
	console.log(e.target.value)
// Change handler with `PromisE.deferred()`
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
	delayMs: 300,
	throttle: false,
})
// Simulate input change events after prespecified delays
const delays = [100, 150, 200, 550, 580, 600, 1000, 1100]
delays.forEach(timeout =>
	setTimeout(
		() => handleChangeDeferred({ target: { value: timeout } }),
		timeout,
	),
)
// Prints:
// 200, 600, 1100
```

<div id="timeout"></div>

### `PromisE.timeout(duration, ...promises)`: Reject after timeout

#### Reject stuck or unexpectedly lenghthy promise(s) after a specified timeout:

```typescript
import { PromisE } from '@superutils/promise'

PromisE.timeout(
	5000, // timeout after 5000ms
	api.save({ text: 'takes longer than 5s to finish' }),
).catch(console.log)
// Error: Error('Timed out after 5000ms')
```

#### Show a message when loading is too long:

```typescript
import { PromisE } from '@superutils/promise'

const loadUserNProducts = () => {
	const promise = PromisE.timeout(
		5000, // timeout after 5000ms
		api.getUser(),
		api.getProducts(),
	)
	const [user, products] = await promise.catch(err => {
		// promise did not time out, but was rejected
		// because one of the data promises rejected
		if (!promise.timedout) return Promise.reject(err)

		// promise timed out >> print/update UI
		console.log('Request is taking longer than expected......')
		// now return the "data promise", the promise(s) provided in the PromisE.timeout()
		// If more than one promises provided, then `promise.data` will be the combination of them all: `PromisE.all(...promises)`
		return promise.data
	})
	return [user, products]
}
loadUserNProducts()
```
