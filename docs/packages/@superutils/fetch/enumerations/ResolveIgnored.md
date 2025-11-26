# Enumeration: ResolveIgnored

Defined in: packages/promise/dist/types/deferred.d.ts:50

Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized.

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: packages/promise/dist/types/deferred.d.ts:52

Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks.

***

### WITH\_LAST

> **WITH\_LAST**: `"WITH_LAST"`

Defined in: packages/promise/dist/types/deferred.d.ts:54

(default) resolve with active promise result, the one that caused the current promise/callback to be ignored).

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"WITH_UNDEFINED"`

Defined in: packages/promise/dist/types/deferred.d.ts:56

resolve with `undefined` value
