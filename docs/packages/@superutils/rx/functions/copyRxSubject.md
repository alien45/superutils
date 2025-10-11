# Function: copyRxSubject()

## Call Signature

> **copyRxSubject**\<`TCopy`, `TRxSource`, `T`\>(`rxSource`, `rxCopy?`, `valueModifier?`, `defer?`): [`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

Defined in: [packages/rx/src/copyRxSubject.ts:126](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/rx/src/copyRxSubject.ts#L126)

### Type Parameters

#### TCopy

`TCopy`

#### TRxSource

`TRxSource` = `RxSourceType`

#### T

`T` = `UnwrapRxSourceValue`\<`TRxSource`\>

### Parameters

#### rxSource

`TRxSource`

RxJS source subject(s). If Array provied, value of `rxCopy` will also be an Array by default,
     unless a different type is provided by `rxCopy` or `valueModifier`.

#### rxCopy?

[`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

(optional) RxJS copy/destination subject.
     If `undefined`, a new subject will be created.
     Value type will be inferred automatically based on `rxCopy`, `valueModifier` and `rxSource`.
     Default: `new BehaviorSubject()`

#### valueModifier?

`ValueModifier`\<`T`, `TCopy`\>

(optional) callback to modify the value (an thus type) before copying from `rxSource`.
     Accepts async functions. Function invocation errors will be gracefully ignored.
     PS: If the very first invokation returns `IGNORE_UPDATE_SYMBOL`, the value of `rxCopy.value` will be undefined.
     Args: `newValue, previousValue, rxCopy`

#### defer?

`number`

(optional) delay in milliseconds.
     Default: `100` if rxSource is an array, otherwise, `0`.

### Returns

[`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

rxCopy

----------------------------------------------

### Name

copyRxSubject

### Description

The the changes are applied unidirectionally from the source subject to the destination subject.
Changes on the destination subject is NOT applied back into the source subject.

### Examples

----------------------------------------------

----------------------------------------------

----------------------------------------------

## Call Signature

> **copyRxSubject**\<`TCopy`, `TRxSource`, `T`\>(`rxSource`, `rxCopy`, `valueModifier`, `defer?`): [`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

Defined in: [packages/rx/src/copyRxSubject.ts:140](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/rx/src/copyRxSubject.ts#L140)

Overload for when TCopy doesn't extend T (modifier required)

### Type Parameters

#### TCopy

`TCopy`

#### TRxSource

`TRxSource` = `RxSourceType`

#### T

`T` = `UnwrapRxSourceValue`\<`TRxSource`\>

### Parameters

#### rxSource

`TRxSource`

#### rxCopy

`undefined` | [`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

#### valueModifier

`ValueModifier`\<`T`, `TCopy`\>

Value of rxSource (T) and value of rxCopy (TCopy) are not the same,
therefore, `valueModifier` is required to transform the value(s) of
rxSource into value of rxCopy.

#### defer?

`number`

### Returns

[`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>
