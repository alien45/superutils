# Function: isValidURL()

> **isValidURL**(`x`, `strict`, `tldExceptions`): `boolean`

Defined in: [is.ts:91](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/core/src/is.ts#L91)

Checks if a value is a valid URL.

## Parameters

### x

`any`

The value to check.

### strict

`boolean` = `true`

If true:
- requires a domain name with a TLDs etc.
- and x is string, catches any auto-correction (eg: trailing spaces being removed, spaces being replaced by `%20`)
by `new URL()` to ensure string URL is valid
Defaults to `true`.

### tldExceptions

`string`[] = `...`

when in strict mode, treat these hosts as valid despite no domain name extensions
Defaults to `['localhost']`

## Returns

`boolean`

`true` if the value is a valid URL, `false` otherwise.
