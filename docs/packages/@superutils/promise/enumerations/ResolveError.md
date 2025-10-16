# Enumeration: ResolveError

Defined in: [packages/promise/src/types/deferred.ts:53](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/deferred.ts#L53)

Options for what to do when deferred promise/function fails

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:55](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/deferred.ts#L55)

Neither resolve nor reject the failed

***

### REJECT

> **REJECT**: `"REJECT"`

Defined in: [packages/promise/src/types/deferred.ts:57](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/deferred.ts#L57)

(default) Reject the failed as usual

***

### WITH\_ERROR

> **WITH\_ERROR**: `"RESOLVE_ERROR"`

Defined in: [packages/promise/src/types/deferred.ts:59](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/deferred.ts#L59)

Resolve (not reject) with the error/reason

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"RESOLVE_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:61](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/deferred.ts#L61)

Resolve with undefined
