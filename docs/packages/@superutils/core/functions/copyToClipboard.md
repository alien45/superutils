# Function: copyToClipboard()

> **copyToClipboard**(`str`): `Promise`\<`0` \| `1` \| `2`\>

Defined in: [packages/core/src/str/copyToClipboard.ts:20](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/str/copyToClipboard.ts#L20)

## Parameters

### str

`string`

## Returns

`Promise`\<`0` \| `1` \| `2`\>

number
`0`: copy failed (both methods attempted)
`1`: modern API success
`2`: fallback success
