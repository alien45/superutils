# Function: throttled()

> **throttled**\<`TArgs`, `ThisArg`\>(`callback`, `delay`, `config`): (...`args`) => `void`

Defined in: [packages/core/src/throttled.ts:22](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/throttled.ts#L22)

throttle

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

(optional) interval duration in milliseconds. Default: 50

### config

[`ThrottleConfig`](../type-aliases/ThrottleConfig.md)\<`ThisArg`\> = `{}`

## Returns

> (...`args`): `void`

### Parameters

#### args

...`TArgs`

### Returns

`void`
