# Interface: DefaultFetch()

Defined in: [packages/fetch/src/index.ts:23](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/index.ts#L23)

## Extends

- `Record`\<`string`, [`MethodFunc`](../type-aliases/MethodFunc.md)\>

> **DefaultFetch**\<`T`, `O`\>(...`params`): `IPromisE`\<`O`\[`"as"`\] *extends* [`FetchAs`](../enumerations/FetchAs.md) ? [`FetchResult`](FetchResult.md)\<`T`\>\[`any`\[`any`\]\] : `T`\>

Defined in: [packages/fetch/src/index.ts:24](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/index.ts#L24)

## Type Parameters

### T

`T`

### O

`O` *extends* [`FetchOptions`](../type-aliases/FetchOptions.md)

## Parameters

### params

...\[`string` \| `URL`, `O`\]

## Returns

`IPromisE`\<`O`\[`"as"`\] *extends* [`FetchAs`](../enumerations/FetchAs.md) ? [`FetchResult`](FetchResult.md)\<`T`\>\[`any`\[`any`\]\] : `T`\>

## Indexable

\[`key`: `string`\]: [`MethodFunc`](../type-aliases/MethodFunc.md)
