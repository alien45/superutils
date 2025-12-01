# Function: isSubjectLike()

> **isSubjectLike**\<`T`\>(`x`, `withValue`): `x is SubjectLike<T>`

Defined in: [packages/rx/src/isSubjectLike.ts:12](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/rx/src/isSubjectLike.ts#L12)

Check if value is similar to a RxJS subject with .subscribe & .next functions

## Type Parameters

### T

`T`

## Parameters

### x

`unknown`

The value to check

### withValue

`boolean` = `false`

When `true`, also checks if `value` property exists in `x`

## Returns

`x is SubjectLike<T>`

`true` if the value is subject-like, `false` otherwise.
