# Function: fallbackIfFails()

> **fallbackIfFails**\<`T`, `TArgs`\>(`target`, `args`, `fallbackValue`): `T`

Defined in: [fallbackIfFails.ts:82](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/fallbackIfFails.ts#L82)

fallbackIfFails

## Type Parameters

### T

`T`

### TArgs

`TArgs` *extends* `any`[] = `any`[]

## Parameters

### target

promise or function to execute

`T` | (...`args`) => `T`

### args

arguments to be supplied to `func` fuction

`TArgs` | () => `TArgs`

### fallbackValue

alternative value to be used when target throws error.

[`IfPromiseAddValue`](../type-aliases/IfPromiseAddValue.md)\<`T`\> | (`reason`) => [`IfPromiseAddValue`](../type-aliases/IfPromiseAddValue.md)\<`T`\>

## Returns

`T`

if func is a promise the return a promise

Examples:
---

## Examples

Working with async functions or functions that returns a promise
```typescript
const args = ['some value', true] as const
const ensureValue = async (value: string, criteria?: boolean) => {
    if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
    return value
}
// This makes sure there's always a value without having to manually write try-catch block.
const value = await fallbackIfFails(
    ensureValue,
    () => args,
    async () => 'fallback value'
)
```

Working synchronous function that returns value synchronously
```typescript
const args = ['some value', true] as const
const ensureValue = (value: string, criteria?: boolean) => {
    if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
    return value
}
// this makes sure there's always a value without having to manually write try-catch block.
const value = fallbackIfFails(
    ensureValue,
    () => args,
    () => 'fallback value'
)
```

Working with function that returns value sync/async circumstantially
```typescript
const getData = (useCache = true, cacheKey = 'data-cache') => {
    if (useCache && localStorage[cacheKey]) return localStorage[cacheKey]
    return fetch('https://my.domain.com/api')
        .then(r => r.json())
        .then(data => {
		       if(cacheKey) localStorage[cacheKey] = data
            return data
        })
}
// First call: no cache, will execute fetch and return a promise
const first = await fallbackIfFails(getData, [false], {})
// Second call: cache available and will return data synchronously
const second = fallbackIfFails(getData, [true], {})
```
