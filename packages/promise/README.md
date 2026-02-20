# [@superutils/promise](https://www.npmjs.com/package/@superutils/promise)

An extended `Promise` implementation, named `PromisE`, that provides additional features and utilities for easier asynchronous flow control in JavaScript and TypeScript applications.

This package offers a drop-in replacement for the native `Promise` that includes status tracking (`.pending`, `.resolved`, `.rejected`) and a suite of practical static methods for common asynchronous patterns like deferred execution, throttling, auto-retry and timeout.

<div v-if="false">

For full API reference check out the [docs page](https://alien45.github.io/superutils/packages/@superutils/promise/).

</div>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
    - [NPM](#npm)
    - [CDN/Browser](#cdn--browser)
- [Usage](#usage)
    - [`new PromisE(executor)`](#promise-executor): Drop-in replacement for `Promise`
        - [Status tracking](#status-tracking)
        - [Early Finalization](#early-finalization)
    - [`new PromisE(promise)`](#promise-status): Check status of an existing promise.
    - [`PromisE.try()`](#static-methods): Static methods
    - [`PromisE.delay()`](#delay): Async delay
    - [`PromisE.deferred()`](#deferred): Async debounced/throttled callback
        - [Debounce Example](#debounce-example)
        - [Throttle Example](#throttle-example)
        - [Behavior with different `options`](#behavior-with-different-options)
    - [`PromisE.timeout()`](#timeout): Reject after timeout

## Features

- **Promise Status**: Easily check if a promise is `pending`, `resolved`, or `rejected`.
- **Deferred Execution**: Defer or throttle promise-based function calls with `PromisE.deferred()`.
- **Timeouts**: Wrap any promise with a timeout using `PromisE.timeout()`.
- **Rich Utilities**: A collection of static methods like `.all()`, `.race()`, `.delay()`, and more, all returning `PromisE` instances.

## Installation

### NPM

Install using your favorite package manager (e.g., `npm`, `yarn`, `pnpm`, `bun`, etc.):

```bash
npm install @superutils/promise
```

Dependency: `@superutils/core` will be automatically installed by NPM

### CDN / Browser

If you are not using a bundler, you can include the minified browser build directly:

```xml
<script src="https://unpkg.com/@superutils/promise@latest/dist/browser/index.min.js"></script>
```

OR,

```xml
<script src="https://cdn.jsdelivr.net/npm/@superutils/promise/dist/browser/index.min.js"></script>
```

This will expose a global namespace `superutils` with the following:

```java
// Namespace: default export (class) from '@superutils/promise' and all the exports as properties
superutils.PromisE

const { PromisE } = superutils

new PromisE()
await PromisE.delay(1000)
const handleChange = PromisE.deferredCallback(
	event => console.log({ value: event.target.value }),
	{ delay: 300 },
)
```

## Usage

<div id="promise-executor"></div>

### `new PromisE(executor)`: Drop-in replacement for `Promise`

The `PromisE` class is an extension of the built-in `Promise` class and can be used as a drop-in replacement. It is fully compatible with async/await and `Promise` static methods.

A `PromisE` instance has the following additional features in comparison to `Promise`:

#### Status tracking:

All instances come with `.pending`, `.resolved` and `.rejected` read-only properties that indicate the current state of the promise.

```javascript
import Promise from '@superutils/promise'

// Importing `PromisE` as "Promise" allows it to be used as a drop-in replacement without changing existing code

const p = new Promise(resolve => setTimeout(() => resolve('done'), 1000))

console.log(p.pending) // true

p.then(result => {
	console.log(result) // 'done'
	console.log(p.resolved) // true
	console.log(p.pending) // false
})
```

#### Early finalization:

All `PromisE` instances expose `.resolve()` and `.reject()` methods that allow early finalization and `.onEarlyFinalize` array that allows adding callbacks to be executed when the promise is finalized externally using these methods.

```javascript
import PromisE from '@superutils/promise'

const p = new PromisE(resolve => setTimeout(() => resolve('done'), 10000))
p.then(result => console.log(result))
// resolve the promise early
setTimeout(() => p.resolve('finished early'), 500)

// Add a callback to do stuff whenever promise is finalized externally.
// This will not be invoked if promise finalized naturally using the Promise executor.
p.onEarlyFinalize.push(((resolved, valueOrReason) =>
	console.log('Promise finalized externally:', { resolved, valueOrReason }),
))
```

<div id="static-methods"></div>

### Static methods

Drop-in replacement for all `Promise` static methods such as `.all()`, `.race()`, `.reject`, `.resolve`, `.try()`, `.withResolvers()`....

```javascript
import PromisE from '@superutils/promise'

const p = PromisE.try(() => {
	throw new Error('Something went wrong')
})

p.catch(error => {
	console.error(error.message) // 'Something went wrong'
	console.log(p.rejected) // true
})
```

<div id="promise-status"></div>

### `new PromisE(promise)`: Check status of an existing promise.

```javascript
import PromisE from '@superutils/promise'

const x = Promise.resolve(1)
const p = new PromisE(x)
console.log(p.pending) // false
console.log(p.resolved) // true
console.log(p.rejected) // false
```

<div id="delay"></div>

### `PromisE.delay(duration)`: Async delay

Creates a promise that resolves after a specified duration, essentially a promise-based `setTimeout`.

```javascript
import PromisE from '@superutils/promise'

// Wait until `appReady` becomes truthy but
while (!appReady) {
	await PromisE.delay(100)
}
```

#### `PromisE.delay(duration, callback, asRejected)`: execute after delay

Creates a promise that executes a function after a specified duration and returns the value the function returns.

If callback returns undefined, default value will be the duration.

```javascript
import PromisE from '@superutils/promise'

console.log('Waiting for app initialization or something else to be ready')
const onReady = () => console.log('App ready')

PromisE.delay(3000, onReady)
```

<div id="deferred"></div>

### `PromisE.deferred(options)`: async debounced/throttled execution

Create a function that debounces or throttles promise-returning function calls. This is useful for scenarios like auto-saving user input or preventing multiple rapid API calls.

#### Debounce example:

```typescript
import PromisE from '@superutils/promise'

const example = async (options = {}) => {
	const df = PromisE.deferred({
		delay: 100,
		resolveIgnored: ResolveIgnored.NEVER, // never resolve ignored calls
		...options,
	})
	df(() => PromisE.delay(500)).then(console.log)
	df(() => PromisE.delay(1000)).then(console.log)
	df(() => PromisE.delay(5000)).then(console.log)
	// delay 2 seconds and invoke df() again
	await PromisE.delay(2000)
	df(() => PromisE.delay(200)).then(console.log)
}
example({ ignoreStale: false, throttle: false })
// `200` and `1000` will be printed in the console
example({ ignoreStale: true, throttle: false })
// `200` will be printed in the console
```

#### Throttle example:

```javascript
import PromisE from '@superutils/promise'

// Simulate an example scenario
const example = async (options = {}) => {
	const df = PromisE.deferred({
		delay: 100,
		resolveIgnored: ResolveIgnored.NEVER, // never resolve ignored calls
		...options,
	})
	df(() => PromisE.delay(5000)).then(console.log)
	df(() => PromisE.delay(500)).then(console.log)
	df(() => PromisE.delay(1000)).then(console.log)
	// delay 2 seconds and invoke df() again
	await PromisE.delay(2000)
	df(() => PromisE.delay(200)).then(console.log)
}
example({ ignoreStale: true, throttle: true })
// `200` will be printed in the console
example({ ignoreStale: false, throttle: true })
// `200` and `5000` will be printed in the console
```

#### Behavior with different `options`:

- **`delay: PositiveNumber, throttle: false`**: (default) Debounce mode.
- **`throttle: true`**: Switches from debounce to throttle mode.
- **`delay: 0`**: Disables debouncing and throttling, enabling sequential/queue mode. Requests are executed one after the other. Any failed promise does not affect subsequent promises.
- **`resolveIgnored` (enum)**: Controls how an ignored promises is handled.
    1. `ResolveIgnored.WITH_UNDEFINED`: The promise for the ignored request resolves with `undefined`.
    2. `ResolveIgnored.WITH_LAST`: The promise for the ignored request waits (if needed) and resolves with the last/most-recent finalized promise.
    3. `ResolveIgnored.NEVER`: The promise for the ignored request is neither resolved nor rejected. It will remain pending indefinitely.
        > **Warning:** Use with caution, as this may lead to memory leaks if not handled properly.
- **`resolveError` (enum)**: Controls how failed requests are handled.
    1.  `ResolveError.NEVER`: The promise for a failed request will neither resolve nor reject, causing it to remain pending indefinitely.
        > **Warning:** Use with caution, as this may lead to memory leaks if not handled properly.
    2.  `ResolveError.WITH_ERROR`: The promise resolves with the error object instead of being rejected.
    3.  `ResolveError.WITH_UNDEFINED`: The promise resolves with an `undefined` value upon failure.

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
	delay: 300,
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
import PromisE from '@superutils/promise'

PromisE.timeout(
	5000, // timeout after 5000ms
	api.save({ text: 'takes longer than 5s to finish' }),
).catch(console.log)
// Error: Error('Timed out after 5000ms')
```

#### Show a message when loading is too long:

```typescript
import PromisE from '@superutils/promise'

const loadUserNProducts = async () => {
	const promise = PromisE.timeout(
		5000, // timeout after 5000ms
		fetch('[DUMMYJSON-DOT-COM]/users/1'), // fetch user
		fetch('[DUMMYJSON-DOT-COM]/products'), // fetch products
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
loadUserNProducts().catch(console.warn)
```
