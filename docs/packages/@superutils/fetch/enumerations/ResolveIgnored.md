# Enumeration: ResolveIgnored

Defined in: packages/promise/dist/index.d.ts:130

Options for what to do when a promise/callback is ignored, either because of being deferred, throttled or another been prioritized.

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: packages/promise/dist/index.d.ts:132

Never resolve ignored promises. Caution: make sure this doesn't cause any memory leaks.

***

### WITH\_LAST

> **WITH\_LAST**: `"WITH_LAST"`

Defined in: packages/promise/dist/index.d.ts:134

(default) resolve with active promise result, the one that caused the current promise/callback to be ignored).

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"WITH_UNDEFINED"`

Defined in: packages/promise/dist/index.d.ts:136

resolve with `undefined` value
