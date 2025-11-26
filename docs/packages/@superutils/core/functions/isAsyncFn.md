# Function: isAsyncFn()

> **isAsyncFn**\<`TData`, `TArgs`\>(`x`): `x is AsyncFn<TData, TArgs>`

Defined in: [packages/core/src/is/isFn.ts:20](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/is/isFn.ts#L20)

Check if value is an Async function.
Caution: May not work at runtime when Babel/Webpack is used due to code compilation.

---

## Type Parameters

### TData

`TData` = `unknown`

### TArgs

`TArgs` *extends* `unknown`[] = `unknown`[]

## Parameters

### x

`unknown`

## Returns

`x is AsyncFn<TData, TArgs>`

## Example

```typescript
isAsyncFn(async () => {}) // result: true
isAsyncFn(() => {}) // result: false
```
