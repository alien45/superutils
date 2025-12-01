# Function: clearClutter()

> **clearClutter**(`text`, `lineSeparator`): `string`

Defined in: [packages/core/src/str/clearClutter.ts:13](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/str/clearClutter.ts#L13)

Clears clutter from strings

- removes trailing & leading whitespaces
- removes empty/whitespace-only lines
- converts multiline strings to single line

## Parameters

### text

`string`

string to clear clutter from

### lineSeparator

`string` = `' '`

(optional) string to use as line separator. Default: single space `' '`

## Returns

`string`

cleaned string
