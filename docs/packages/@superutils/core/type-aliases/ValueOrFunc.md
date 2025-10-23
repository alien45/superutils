# Type Alias: ValueOrFunc\<Value, Args\>

> **ValueOrFunc**\<`Value`, `Args`\> = `Value` \| (...`args`) => `Value`

Defined in: [types.ts:281](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/types.ts#L281)

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
