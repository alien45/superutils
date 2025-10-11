# Function: isAsyncFn()

> **isAsyncFn**\<`TData`, `TArgs`\>(`x`): `x is AsyncFn<TData, TArgs>`

Defined in: [is.ts:19](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/is.ts#L19)

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
