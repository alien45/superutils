# Enumeration: ResolveError

Defined in: packages/promise/dist/types/deferred.d.ts:39

Options for what to do when deferred promise/function fails

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: packages/promise/dist/types/deferred.d.ts:41

Neither resolve nor reject the failed

***

### REJECT

> **REJECT**: `"REJECT"`

Defined in: packages/promise/dist/types/deferred.d.ts:43

(default) Reject the failed as usual

***

### WITH\_ERROR

> **WITH\_ERROR**: `"RESOLVE_ERROR"`

Defined in: packages/promise/dist/types/deferred.d.ts:45

Resolve (not reject) with the error/reason

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"RESOLVE_UNDEFINED"`

Defined in: packages/promise/dist/types/deferred.d.ts:47

Resolve with undefined
