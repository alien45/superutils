# Enumeration: ResolveIgnored

Defined in: [packages/promise/src/types/deferred.ts:69](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/types/deferred.ts#L69)

Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized.

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:71](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/types/deferred.ts#L71)

Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks.

***

### WITH\_LAST

> **WITH\_LAST**: `"WITH_LAST"`

Defined in: [packages/promise/src/types/deferred.ts:73](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/types/deferred.ts#L73)

(default) resolve with active promise result, the one that caused the current promise/callback to be ignored).

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"WITH_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:75](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/types/deferred.ts#L75)

resolve with `undefined` value
