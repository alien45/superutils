# @superutils/core

A collection of lightweight, dependency-free utility functions and types.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
    - [`is`](#is): Type checkers
    - [`deferred()`](#deferred): Debounce callbacks
    - [`throttle()`](#throttle): Throttle callbacks
    - [`fallbackIfFails()`](#fallbackIfFails): Gracefully invoke functions
    - [`objCopy()`](#objCopy): Deep-copy objects
    - [`search()`](#search): Search iterable collections

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
...

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

<div id="deferred"></div>

### `deferred(fn)`: debounce callbacks

`debounce()`, a sugar for `deferred()`, is also available.

```javascript

import { deferred } from '@superutils/core'

const handleChange = deferred(
    event => console.log(event.target.value),
    300 // debounce delay in milliseconds
)
handleChange({ target: { value 1 } }) // will be ignored
handleChange({ target: { value 2 } }) // will be ignored
handleChange({ target: { value 3 } }) // will be executed
```

<div id="throttle"></div>

### `throttle(fn)`: throttle callbacks

```javascript
import { throttle } from '@superutils/core'

const handleChange = throttle(
    event => console.log(event.target.value),
    300 // throttle duration in milliseconds
)
handleChange({ target: { value 1 } }) // will be executed
handleChange({ target: { value 2 } }) // will be ignored
handleChange({ target: { value 3 } }) // will be ignored
```

<div id="fallbackIfFails"></div>

### `fallbackIfFails(fn, args, fallback)`: gracefully invoke functions

Based on the function provided `fallbackIfFails` will either execute synchronously or asynchronously.

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
```

<div id="objCopy"></div>

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

// Fuzzy search accross all properties
search(data, { query: 'li' })
search(data, { query: /li/i }) // Using regular expression
// Result:
// new Map([
//     [1, { age: 30, name: 'Alice' }],
//     [3, { age: 35, name: 'Charlie' }],
// ])
```

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
	matchExact: true, // true: full text search. false (default): partial matching
	matchAll: true, // if true, item will be matched only when all of the query properties match
	query: {
		age: /(2[5-9])|(3[0-5])/, // match ages 25-35
		name: /ali|ob|ve/i,
	},
	// transform the property values (or item itself when in fuzzy search mode)
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
