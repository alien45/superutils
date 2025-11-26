# Function: isUrlValid()

> **isUrlValid**(`x`, `strict`, `tldExceptions`): `boolean`

Defined in: [packages/core/src/is/isUrl.ts:18](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/is/isUrl.ts#L18)

Check if a value is a valid URL/string-URL.

## Parameters

### x

`unknown`

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
