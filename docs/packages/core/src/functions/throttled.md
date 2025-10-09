# Function: throttled()

> **throttled**\<`TArgs`, `ThisArg`\>(`callback`, `delay`, `config`): (...`args`) => `void`

Defined in: [packages/core/src/throttled.ts:23](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/throttled.ts#L23)

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
