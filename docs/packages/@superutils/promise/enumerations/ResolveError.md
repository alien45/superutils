# Enumeration: ResolveError

Defined in: [packages/promise/src/types/deferred.ts:57](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/types/deferred.ts#L57)

Options for what to do when deferred promise/function fails

## Enumeration Members

### NEVER

> **NEVER**: `"NEVER"`

Defined in: [packages/promise/src/types/deferred.ts:59](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/types/deferred.ts#L59)

Neither resolve nor reject the failed

***

### REJECT

> **REJECT**: `"REJECT"`

Defined in: [packages/promise/src/types/deferred.ts:61](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/types/deferred.ts#L61)

(default) Reject the failed as usual

***

### WITH\_ERROR

> **WITH\_ERROR**: `"RESOLVE_ERROR"`

Defined in: [packages/promise/src/types/deferred.ts:63](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/types/deferred.ts#L63)

Resolve (not reject) with the error/reason

***

### WITH\_UNDEFINED

> **WITH\_UNDEFINED**: `"RESOLVE_UNDEFINED"`

Defined in: [packages/promise/src/types/deferred.ts:65](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/types/deferred.ts#L65)

Resolve with undefined
