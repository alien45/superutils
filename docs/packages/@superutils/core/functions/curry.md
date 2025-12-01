# Function: curry()

> **curry**\<`TData`, `TArgs`, `TArgsIsFinite`, `TArity`\>(`func`, ...`__namedParameters`): [`Curry`](../type-aliases/Curry.md)\<`TData`, [`CurriedArgs`](../type-aliases/CurriedArgs.md)\<`TArgs`, `TArgsIsFinite`, (...`args`) => `TData`, `TArity`\>\>

Defined in: [packages/core/src/curry.ts:71](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/curry.ts#L71)

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

### func

(...`args`) => `TData`

The function to curry.

### \_\_namedParameters

...`TArgsIsFinite` *extends* `true` ? \[`TArity`\] : \[`TArity`\]

## Returns

[`Curry`](../type-aliases/Curry.md)\<`TData`, [`CurriedArgs`](../type-aliases/CurriedArgs.md)\<`TArgs`, `TArgsIsFinite`, (...`args`) => `TData`, `TArity`\>\>

A new, curried function that is fully type-safe.

## Examples

```typescript
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
```

```typescript
// Provide as many arguments as you wish. Upto the limit of the original function.
// Returns a function expecting only the remaining argument(s)
const fnWith3 = curriedFunc('first', 2, false)
// All args provided, returns the result
const result = fnWith3('last')
```

Useful when a function has
 - non-finite arguments (eg: number[])
 - optional arguments and you do not want to avoid one or more optional arguments
```typescript
const curriedWArity3 = curry(func, 3)
const result = curriedWArity3('first', 2, false)
```
