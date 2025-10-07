# @utiils/promise

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
npm install @utiils/promise @utiils/core
```

## Basic Usage

### `new PromisE(executor)`

The `PromisE` class can be used just like the native `Promise`. The key difference is the addition of status properties:

```typescript
import { PromisE } from '@utiils/promise'

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
import { PromisE } from '@utiils/promise'
const p = new PromisE(resolve => setTimeout(() => resolve('done'), 10000))
p.then(result => console.log(result))
// resolve the promise early
setTimeout(() => p.resolve('finished early'), 500)
```

### `new PromisE(promise)`

Check status of an existing promise.

```typescript
import { PromisE } from '@utiils/promise'
const x = Promise.resolve(1)
const p = new PromisE(x)
console.log(p.pending) // false
console.log(p.resolved) // true
console.log(p.rejected) // false
```

### `PromisE.try(fn)`

Safely execute a function that might throw an error and wrap it in a `PromisE`.

```typescript
import { PromisE } from '@utiils/promise'

const p = PromisE.try(() => {
	throw new Error('Something went wrong')
})

p.catch(error => {
	console.error(error.message) // 'Something went wrong'
	console.log(p.rejected) // true
})
```

### `PromisE.delay(duration)`

Creates a promise that resolves after a specified duration, essentially a promise-based `setTimeout`.

```typescript
import PromisE from '@utiils/promise'
// Wait until `appReady` becomes truthy but
while (!appReady) {
	await PromisE.delay(100)
}
```

## Advanced Utilities

### `PromisE.deferred(options)`

Create a function that debounces or throttles promise-returning function calls. This is useful for scenarios like auto-saving user input or preventing multiple rapid API calls.

```typescript
import PromisE, { ResolveIgnored } from '@utiils/promise'

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

### `PromisE.deferredFetch(options, ...defaultFetchArgs)`

A powerful utility that combines `deferred` execution with `fetch`. It's perfect for implementing cancellable, debounced search inputs.

```typescript
import { PromisE, ResolveIgnored } from '@utiils/promise'

const searchProducts = PromisE.deferredFetch({
	defer: 300, // Debounce for 300ms
	throttle: true, // In throttle mode, the first call in a series is executed
	resolveIgnored: ResolveIgnored.WITH_UNDEFINED, // Ignored (cancelled) requests will resolve with `undefined`
})

// User types 'apple'
searchProducts('https://api.example.com/products?q=apple').then(console.log)

// User quickly types 'applesauce'
searchProducts('https://api.example.com/products?q=applesauce').then(
	console.log,
)

// The first request for 'apple' will be aborted, and its promise will resolve with `undefined`.
// The second request for 'applesauce' will be executed.
```

### `PromisE.timeout(timeoutDuration, ...promises)`

#### Reject stuck or unexpectedly lenghthy promise(s) after a specified timeout:

```typescript
import { PromisE } from '@utiils/promise'

PromisE.timeout(
	5000, // timeout after 5000ms
	api.save({ text: 'takes longer than 5s to finish' }),
).catch(console.log)
// Error: Error('Timed out after 5000ms')
```

#### Show a message when loading is too long:

```typescript
import { PromisE } from '@utiils/promise'
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
