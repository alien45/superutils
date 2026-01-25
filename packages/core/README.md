# @superutils/core

A collection of lightweight, dependency-free utility functions and types.

<div v-if="false">

For full API reference check out the [docs page](https://alien45.github.io/superutils/packages/@superutils/core/).

</div>

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [`is`](#is): Type checkers
    - [`debounce()`](#debounce): Debounce callbacks
    - [`throttle()`](#throttle): Throttle callbacks
    - [`deferred()`](#deferred): Debounce/Throttle callbacks
    - [`fallbackIfFails()`](#fallback-if-fails): Gracefully invoke functions or promises with a fallback
    - [`objCopy()`](#obj-copy): Deep-copy objects
    - [`search()`](#search): Search iterable collections
        - [Advanced search options](#search-advanced)
        - [`Ranked search`](#search-ranked): sort results by relevance
        - [Combine `search()` with `deferred()`](#search-deferred): simulate a search input with debounce mechanism
    - [`curry()`](#curry): Convert any function into a curried function

## Installation

```bash
npm install @superutils/core
```

## Usage

<div id="is"></div>

### `is`: type checkers

The `is` object provides a comprehensive set of type-checking functions.

```javascript
import { is } from '@superutils/core'

is.fn(() => {}) // true
is.asyncFn(async () => {}) // true
is.arr([]) // true
is.arrLike([]) // true
is.arrLike(new Map()) // true
is.arrLike(new Set()) // true
is.date(new Date()) // true
is.date(new Date(undefined)) // false
is.empty(' ') // true
is.empty([]) // true
is.empty(new Map()) // true
is.empty(null) // true
is.empty(undefined) // true
is.map(new Map()) // true
is.number(123) // true
is.number(NaN) // false
is.url('https://google.com') // true
//...
```

All these functions can also be imported independantly.
Simply remove the dot (".") and uppercase the first letter of the function name.

```javascript
import {
	isArr,
	isFn,
	isArrLike,
	isDate,
	isEmpty,
	isMap,
	isNumber,
	isUrl,
} from '@superutils/core'
```

<div id="debouce"></div>

### `debouce(fn, delay, options)`: debounce callbacks

```javascript
import { debouce } from '@superutils/core'

const handleChange = debouce(
	event => console.log(event.target.value),
	300, // debounce delay in milliseconds
	{
		leading: false, // default
	},
)
handleChange({ target: { value: 1 } }) // will be ignored, unless `leading = true`
handleChange({ target: { value: 2 } }) // will be ignored
handleChange({ target: { value: 3 } }) // will be ignored
handleChange({ target: { value: 4 } }) // will be executed
```

<div id="throttle"></div>

### `throttle(fn, delay, options)`: throttle callbacks

```javascript
import { throttle } from '@superutils/core'

const handleChange = throttle(
	event => console.log(event.target.value),
	300, // throttle duration in milliseconds
	{
		trailing: false, // default
	},
)
handleChange({ target: { value: 1 } }) // will be executed
handleChange({ target: { value: 2 } }) // will be ignored
handleChange({ target: { value: 3 } }) // will be ignored
handleChange({ target: { value: 4 } }) // will be ignored, unless `trailing = true`
```

<div id="deferred"></div>

### `deferred(fn, delay, options)`: debounce/throttle callbacks

Create debounced/throttled functions using the `throttle` switch.

```javascript
import { deferred } from '@superutils/core'

const handleChange = deferred(
	event => console.log(event.target.value),
	300, // delay in milliseconds
	{ throttle: false }, // determines whether to create a debounced or throttled function
)
handleChange({ target: { value: 1 } }) // will be ignored
handleChange({ target: { value: 2 } }) // will be ignored
handleChange({ target: { value: 3 } }) // will be executed
```

<div id="fallback-if-fails"></div>

### `fallbackIfFails(target, args, fallback)`: Gracefully invoke functions or promises with a fallback

The `fallbackIfFails` function can wrap a standard function, a promise-returning function, or a promise directly. It automatically handles both synchronous execution and asynchronous resolution, providing a fallback value if the function throws an error or the promise is rejected.

#### Sync operations:

```javascript
import { fallbackIfFails } from '@superutils/core'

const allProducts = []
// an example sync function that may fail
const getProducts = () => {
	if (!allProducts?.length) throw new Error('No products available')
	return allProducts
}
const result = fallbackIfFails(
	getProducts, // function to invoke
	[], // Parameters to be provided to the function. A function can also be used here that returns an array
	[], // Fallback value to be returned when function throws an error.
)
console.log({ result })
// Result: []
```

#### Async operations:

```javascript
import { fallbackIfFails } from '@superutils/core'

const allProducts = []
// an example sync function that may fail
const getProducts = () =>
	fetch('https://dummyjson.com/products').then(r => r.json())
fallbackIfFails(
	getProducts, // function to invoke
	[], // Parameters to be provided to the function. A function can also be used here that returns an array
	{ products: [] }, // Fallback value to be returned when function throws an error.
).then(console.log)
// Prints the result when request is successful or fallback value when request fails

// use a promise
fallbackIfFails(
	Promise.reject('error'),
	[], //
)
```

<div id="obj-copy"></div>

### `objCopy(source, dest, ignoreKeys, override)`: deep-copy objects

```javascript
import { objCopy } from '@superutils/core'

const source = {
	a: 1,
	b: 2,
	c: 3,
}
const dest = {
	d: 4,
	e: 5,
}
const copied = objCopy(
	source,
	dest,
	['a'], // exclude source property
	'empty', // only override if dest doesn't have the property or value is "empty" (check `is.emtpy()`)
)
// Result:
// {
//     b: 2,
//     c: 33,
//     d: 4,
//     e: 5,
// }
console.log(dest === copied) // true (dest is returned)
```

<div id="search"></div>

### `search(data, options)`: search iterable collections (Array/Map/Set)

```javascript
import { search } from '@superutils/core'

// sample colletion
const data = new Map([
	[1, { age: 30, name: 'Alice' }],
	[2, { age: 25, name: 'Bob' }],
	[3, { age: 35, name: 'Charlie' }],
	[4, { age: 28, name: 'Dave' }],
	[5, { age: 22, name: 'Eve' }],
])

// Case-insensitive search by name
search(data, { query: { name: 've' } })
search(data, { query: { name: /ve/i } }) // Using regular expression
// Result:
// new Map([
//     [4, { age: 28, name: 'Dave' }],
//     [5, { age: 22, name: 'Eve' }],
// ])

// Return result as Array
search(data, { asMap: false, query: { name: 've' } })
// Result: [
//     { age: 28, name: 'Dave' },
//     { age: 22, name: 'Eve' }
// ]

// Search multiple properties
search(data, { query: { age: 28, name: 've' } })
// Result:
// new Map([
//     [4, { age: 28, name: 'Dave' }],
// ])

// Search across all properties
search(data, { query: 'li' })
search(data, { query: /li/i }) // Using regular expression
// Result:
// new Map([
//     [1, { age: 30, name: 'Alice' }],
//     [3, { age: 35, name: 'Charlie' }],
// ])
```

<div id="search-advanced"></div>

#### Advanced Search Options:

```javascript
import { search } from '@superutils/core'

// Sample colletion
const data = new Map([
	[1, { age: 30, name: 'Alice' }],
	[2, { age: 25, name: 'Bob' }],
	[3, { age: 35, name: 'Charlie' }],
	[4, { age: 28, name: 'Dave' }],
	[5, { age: 22, name: 'Eve' }],
])
search(data, {
	asMap: false, // Result type: true => Map (default, keys preserved), false => Array
	ignoreCase: false, // For text case-sensitivity
	limit: 10, // Number of items returned. Default: no limit
	matchExact: true, // true: match exact value. false (default): partial matching
	matchAll: true, // if true, item will be matched only when all of the query properties match
	query: {
		age: /(2[5-9])|(3[0-5])/, // match ages 25-35
		name: /ali|ob|ve/i,
	},
	// transform the property values (or item itself when searching all properties in global search mode using `query: string | RegExp`)
	transform: (item, value, property) => {
		// exclude items by returning undefined or emptry string
		if (item.age < 18) return ''

		// return value as string to search continue search as per criteria
		return `${value}`
	},
})
// Result:
// [
//   { age: 30, name: 'Alice' },
//   { age: 25, name: 'Bob' },
//   { age: 28, name: 'Dave' }
// ]
```

<div id="search-ranked"></div>

#### Search Ranked: sort results by relevance

When `ranked` is set to `true`, results are sorted by relevance. In this example, "Alice" is ranked higher than "Charlie" because the match "li" appears earlier in the string.

```javascript
import { search } from '@superutils/core'

// Sample colletion
const data = new Map([
	[2, { age: 25, name: 'Bob' }],
	[3, { age: 35, name: 'Charlie' }],
	[4, { age: 28, name: 'Dave' }],
	[5, { age: 22, name: 'Eve' }],
	[1, { age: 30, name: 'Alice' }],
])
const result = search(data, {
	asMap: false, // Result type: true => Map (default, keys preserved), false => Array
	limit: 10, // Number of items returned. Default: no limit
	query: /li/i,
	ranked: true,
})
console.log(result)
// [ { age: 30, name: 'Alice' }, { age: 35, name: 'Charlie' } ]
```

<div id="search-deferred"></div>

#### Combine `search()` with `deferred()`: simulate a search input with debounce mechanism

```javascript
import { deferred, search } from '@superutils/core'

// sample colletion
const data = new Map([
	[1, { age: 30, name: 'Alice' }],
	[2, { age: 25, name: 'Bob' }],
	[3, { age: 35, name: 'Charlie' }],
	[4, { age: 28, name: 'Dave' }],
	[5, { age: 22, name: 'Eve' }],
])

const searchDeferred = deferred(
	event => {
		const result = search(data, {
			query: {
				name: new RegExp(event?.target?.value, 'i'),
			},
		})
		// print result to console
		console.log(result)
	},
	300, // debounce duration in milliseconds
	{ leading: false }, // optional defer options
)

// ignored
searchDeferred({ target: { value: 'l' } })
// ignored
setTimeout(() => searchDeferred({ target: { value: 'li' } }), 50)
// executed: prints `Map(1) { 3 => { age: 35, name: 'Charlie' } }`
setTimeout(() => searchDeferred({ target: { value: 'lie' } }), 200)
// executed: prints `Map(1) { 1 => { age: 30, name: 'Alice' } }`
setTimeout(() => searchDeferred({ target: { value: 'lic' } }), 510)
```

<div id="curry"></div>

### `curry(fn, arity)`: Convert any function into a curried function

```typescript
const func = (
	first: string,
	second: number,
	third?: boolean,
	fourth?: string,
) => `${first}-${second}-${third}-${fourth}`
// We create a new function from the `func()` function that acts like a type-safe curry function
// while also being flexible with the number of arguments supplied.
const curriedFunc = curry(func)

// Example 1: usage like a regular curry function and provide one argument at a time.
// Returns a function expecting args: second, third, fourth
const fnWith1 = curriedFunc('first')
// Returns a function expecting args: third, fourth
const fnWith2 = fnWith1(2)
// returns a function epecting only fourth arg
const fnWith3 = fnWith2(false)
// All args are now provided, the original function is called and result is returned.
const result = fnWith3('last')
```
