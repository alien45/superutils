# Function: deferred()

> **deferred**\<`TArgs`, `ThisArg`\>(`callback`, `delay`, `config`): (...`args`) => `void`

Defined in: [deferred.ts:32](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/core/src/deferred.ts#L32)

deferred AKA debounce

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### ThisArg

`ThisArg`

## Parameters

### callback

(`this`, ...`args`) => `unknown`

function to be invoked after timeout

### delay

`number` = `50`

(optional) timeout duration in milliseconds. Default: 50

### config

[`DeferredConfig`](../interfaces/DeferredConfig.md)\<`ThisArg`\> = `{}`

## Returns

> (...`args`): `void`

### Parameters

#### args

...`TArgs`

### Returns

`void`

## Example

```typescript
import { deferred } from '@superutils/core'

const handleChange = deferred(
    event => console.log(event.target.value),
    300 // debounce delay in milliseconds
)

handleChange({ target: { value 1 } }) // will be ignored
handleChange({ target: { value 2 } }) // will be ingored
handleChange({ target: { value 3 } }) // will be invoked
```
