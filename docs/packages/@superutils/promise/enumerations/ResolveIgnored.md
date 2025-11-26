# Enumeration: ResolveIgnored

Defined in: [packages/promise/src/types/deferred.ts:65](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/types/deferred.ts#L65)

Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized.

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:67](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/types/deferred.ts#L67)

Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks.

***

### WITH\_LAST

> **WITH\_LAST**: `"WITH_LAST"`

Defined in: [packages/promise/src/types/deferred.ts:69](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/types/deferred.ts#L69)

(default) resolve with active promise result, the one that caused the current promise/callback to be ignored).

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"WITH_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:71](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/types/deferred.ts#L71)

resolve with `undefined` value
