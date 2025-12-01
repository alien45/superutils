# Function: copyToClipboard()

> **copyToClipboard**(`str`): `Promise`\<`0` \| `1` \| `2`\>

Defined in: [packages/core/src/str/copyToClipboard.ts:20](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/str/copyToClipboard.ts#L20)

## Parameters

### str

`string`

## Returns

`Promise`\<`0` \| `1` \| `2`\>

number
`0`: copy failed (both methods attempted)
`1`: modern API success
`2`: fallback success
