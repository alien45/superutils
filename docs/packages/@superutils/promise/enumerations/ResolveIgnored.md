# Enumeration: ResolveIgnored

Defined in: [packages/promise/src/types/deferred.ts:57](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L57)

Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized.

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:59](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L59)

Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks.

***

### WITH\_LAST

> **WITH\_LAST**: `"WITH_LAST"`

Defined in: [packages/promise/src/types/deferred.ts:61](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L61)

(default) resolve with active promise result, the one that caused the current promise/callback to be ignored).

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"WITH_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:63](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/deferred.ts#L63)

resolve with `undefined` value
