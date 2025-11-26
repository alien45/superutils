# Function: copyToClipboard()

> **copyToClipboard**(`str`): `Promise`\<`0` \| `1` \| `2`\>

Defined in: [packages/core/src/str/copyToClipboard.ts:20](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/str/copyToClipboard.ts#L20)

## Parameters

### str

`string`

## Returns

`Promise`\<`0` \| `1` \| `2`\>

number
`0`: copy failed (both methods attempted)
`1`: modern API success
`2`: fallback success
