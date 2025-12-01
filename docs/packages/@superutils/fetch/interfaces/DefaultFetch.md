# Interface: DefaultFetch()

Defined in: [packages/fetch/src/index.ts:23](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/index.ts#L23)

## Extends

- `Record`\<`string`, [`MethodFunc`](../type-aliases/MethodFunc.md)\>

> **DefaultFetch**\<`T`, `O`\>(...`params`): `IPromisE`\<`O`\[`"as"`\] *extends* [`FetchAs`](../enumerations/FetchAs.md) ? [`FetchResult`](FetchResult.md)\<`T`\>\[`any`\[`any`\]\] : `T`\>

Defined in: [packages/fetch/src/index.ts:24](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/index.ts#L24)

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
