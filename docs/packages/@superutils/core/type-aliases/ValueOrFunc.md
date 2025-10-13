# Type Alias: ValueOrFunc\<Value, Args\>

> **ValueOrFunc**\<`Value`, `Args`\> = `Value` \| (...`args`) => `Value`

Defined in: [types.ts:281](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L281)

Accept value or a function that returns the value

Examples:
---

## Type Parameters

### Value

`Value`

### Args

`Args` *extends* `unknown`[]

## Example

```typescript
import { isFn, ValueOrFunc } from '@superutils/core'
const print = (value: ValueOrFunc<string>) => isFn(value)
 ? value()
 : value
print('Print me!')
print(() => 'Print me too!')
```
