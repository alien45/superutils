# Enumeration: ResolveError

Defined in: packages/promise/dist/index.d.ts:119

Options for what to do when deferred promise/function fails

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: packages/promise/dist/index.d.ts:121

Neither resolve nor reject the failed

***

### REJECT

> **REJECT**: `"REJECT"`

Defined in: packages/promise/dist/index.d.ts:123

(default) Reject the failed as usual

***

### WITH\_ERROR

> **WITH\_ERROR**: `"RESOLVE_ERROR"`

Defined in: packages/promise/dist/index.d.ts:125

Resolve (not reject) with the error/reason

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"RESOLVE_UNDEFINED"`

Defined in: packages/promise/dist/index.d.ts:127

Resolve with undefined
