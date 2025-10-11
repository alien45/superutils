# Function: curry()

> **curry**\<`TData`, `TArgs`, `TArgsIsFinite`, `TArity`\>(`fn`, ...`__namedParameters`): [`Curry`](../type-aliases/Curry.md)\<`TData`, `TCurriedArgs`\>

Defined in: [curry.ts:66](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/curry.ts#L66)

Creates a curried version of a function. The curried function can be
called with one or more or all arguments at a time. Once all arguments have been
supplied, the original function is executed.

---

PS:
---
To get around Typescript's limitations, all optional parameters to will be
turned required and unioned with `undefined`.

---

## Type Parameters

### TData

`TData`

### TArgs

`TArgs` *extends* `unknown`[]

### TArgsIsFinite

`TArgsIsFinite` *extends* `boolean` = [`IsFiniteTuple`](../type-aliases/IsFiniteTuple.md)\<`TArgs`\>

### TArity

`TArity` *extends* `number` = `TArgsIsFinite` *extends* `true` ? [`TupleMaxLength`](../type-aliases/TupleMaxLength.md)\<`TArgs`\> : `number`

## Parameters

### fn

(...`args`) => `TData`

The function to curry.

### \_\_namedParameters

...`TArgsIsFinite` *extends* `true` ? \[`TArity`\] : \[`TArity`\]

## Returns

[`Curry`](../type-aliases/Curry.md)\<`TData`, `TCurriedArgs`\>

A new, curried function that is fully type-safe.

## Example

```ts
```typescript

// Example usages of the `curry()` function.

// A regular function
const func = (
    first: string,
    second: number,
    third?: boolean,
    fourth?: string
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

// Example 2: flexible curry.
// Provide as many arguments as you wish. Upto the limit of the original function.
// Returns a function expecting only the last remaining argument
const fnWith3 = curriedFunc('first', 2, false)
// All args provided, returns the result
const result = fnWith3('last')

// Example 3: early invokation using `arity`
const curriedWArity3 = curry(func, 3)
const result = curriedWArity3('first', 2, false)
```
```
