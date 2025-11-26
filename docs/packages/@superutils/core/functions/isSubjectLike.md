# Function: isSubjectLike()

> **isSubjectLike**(`x`, `withValue`): `boolean`

Defined in: [packages/core/src/is/index.ts:65](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/is/index.ts#L65)

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
