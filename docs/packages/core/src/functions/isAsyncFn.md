# Function: isAsyncFn()

> **isAsyncFn**\<`TData`, `TArgs`\>(`x`): `x is AsyncFn<TData, TArgs>`

Defined in: [packages/core/src/is.ts:19](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/is.ts#L19)

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
