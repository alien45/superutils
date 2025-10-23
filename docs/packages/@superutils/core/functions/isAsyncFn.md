# Function: isAsyncFn()

> **isAsyncFn**\<`TData`, `TArgs`\>(`x`): `x is AsyncFn<TData, TArgs>`

Defined in: [is.ts:25](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/is.ts#L25)

isAsyncFn
Check if `x` is an Async function.
Caution: May not work at runtime when Babel/Webpack is used due to code compilation.

---

## Type Parameters

### TData

`TData` = `unknown`

### TArgs

`TArgs` *extends* `any`[] = `unknown`[]

## Parameters

### x

`any`

## Returns

`x is AsyncFn<TData, TArgs>`

## Example

```typescript
isAsyncFn(async () => {}) // result: true
isAsyncFn(() => {}) // result: false
```
