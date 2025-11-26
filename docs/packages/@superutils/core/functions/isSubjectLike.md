# Function: isSubjectLike()

> **isSubjectLike**(`x`, `withValue`): `boolean`

Defined in: [packages/core/src/is/index.ts:65](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/is/index.ts#L65)

Check if value is similar to a RxJS subject with .subscribe & .next functions

## Parameters

### x

`unknown`

The value to check

### withValue

`boolean` = `false`

When `true`, also checks if `value` property exists in `x`

## Returns

`boolean`

`true` if the value is subject-like, `false` otherwise.
