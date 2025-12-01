# Function: isArrLikeSafe()

> **isArrLikeSafe**\<`T`, `MapKey`\>(`x`): x is Set\<T\> \| Map\<MapKey, T\> \| T\[\]

Defined in: [packages/core/src/is/isArr.ts:37](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/is/isArr.ts#L37)

Check if value is convertible to an array by using `Array.from(x)` even if it comes from a different realm
(eg: iframe, iframes, worker contexts, node vm contexts, browser extensions).

Caution: much slower than [()](isArrLike.md) due to use of `Object.prototype.toString.call()`

## Type Parameters

### T

`T` = `unknown`

### MapKey

`MapKey` = `unknown`

## Parameters

### x

`unknown`

## Returns

x is Set\<T\> \| Map\<MapKey, T\> \| T\[\]
