# Enumeration: ResolveError

Defined in: [packages/promise/src/types/deferred.ts:41](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/deferred.ts#L41)

Options for what to do when deferred promise/function fails

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:43](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/deferred.ts#L43)

Neither resolve nor reject the failed

***

### REJECT

> **REJECT**: `"REJECT"`

Defined in: [packages/promise/src/types/deferred.ts:45](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/deferred.ts#L45)

(default) Reject the failed as usual

***

### WITH\_ERROR

> **WITH\_ERROR**: `"RESOLVE_ERROR"`

Defined in: [packages/promise/src/types/deferred.ts:47](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/deferred.ts#L47)

Resolve (not reject) with the error/reason

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"RESOLVE_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:49](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/deferred.ts#L49)

Resolve with undefined
