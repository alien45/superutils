# Function: throttled()

> **throttled**\<`TArgs`, `ThisArg`\>(`callback`, `delay`, `config`): (...`args`) => `void`

Defined in: [throttled.ts:23](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/throttled.ts#L23)

throttle

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
