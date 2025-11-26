# Type Alias: ValueOrFunc\<Value, Args\>

> **ValueOrFunc**\<`Value`, `Args`\> = `Value` \| (...`args`) => `Value`

Defined in: [packages/core/src/types.ts:281](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/types.ts#L281)

Accept value or a function that returns the value

Examples:
---

## Type Parameters

### Value

`Value`

### Args

`Args` *extends* `unknown`[] = \[\]

## Example

```typescript
import { isFn, ValueOrFunc } from '@superutils/core'
const print = (value: ValueOrFunc<string>) => isFn(value)
 ? value()
 : value
print('Print me!')
print(() => 'Print me too!')
```
