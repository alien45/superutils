# Enumeration: ResolveError

Defined in: [packages/promise/src/types/deferred.ts:45](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L45)

Options for what to do when deferred promise/function fails

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:47](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L47)

Neither resolve nor reject the failed

***

### REJECT

> **REJECT**: `"REJECT"`

Defined in: [packages/promise/src/types/deferred.ts:49](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L49)

(default) Reject the failed as usual

***

### WITH\_ERROR

> **WITH\_ERROR**: `"RESOLVE_ERROR"`

Defined in: [packages/promise/src/types/deferred.ts:51](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L51)

Resolve (not reject) with the error/reason

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"RESOLVE_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:53](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L53)

Resolve with undefined
