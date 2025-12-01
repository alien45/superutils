# Function: copyToClipboard()

> **copyToClipboard**(`str`): `Promise`\<`0` \| `1` \| `2`\>

Defined in: [packages/core/src/str/copyToClipboard.ts:20](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/str/copyToClipboard.ts#L20)

## Parameters

### str

`string`

## Returns

`Promise`\<`0` \| `1` \| `2`\>

number
`0`: copy failed (both methods attempted)
`1`: modern API success
`2`: fallback success
