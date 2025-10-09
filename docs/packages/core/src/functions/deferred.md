# Function: deferred()

> **deferred**\<`TArgs`, `ThisArg`\>(`callback`, `delay`, `config`): (...`args`) => `void`

Defined in: [packages/core/src/deferred.ts:24](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/deferred.ts#L24)

deferred AKA debounce

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### ThisArg

`ThisArg`

## Parameters

### callback

(`this`, ...`args`) => `any`

function to be invoked after timeout

### delay

`number` = `50`

(optional) timeout duration in milliseconds. Default: 50

### config

[`DeferredConfig`](../type-aliases/DeferredConfig.md)\<`ThisArg`\> = `{}`

## Returns

> (...`args`): `void`

### Parameters

#### args

...`TArgs`

### Returns

`void`
