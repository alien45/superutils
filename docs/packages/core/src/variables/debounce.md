# Variable: debounce

> `const` **debounce**: \{\<`TArgs`, `ThisArg`\>(`callback`, `delay`, `config`): (...`args`) => `void`; `defaults`: `object`; \} = `deferred`

Defined in: [packages/core/src/debounce.ts:3](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/debounce.ts#L3)

## Type Declaration

**`Function`**

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

### defaults

> **defaults**: `object`

#### defaults.leading

> **leading**: `false` = `false`

Set the default value of argument `leading` for the `deferred` function.
This change is applicable application-wide and only applies to any new invocation of `deferred()`.

#### defaults.onError

> **onError**: `undefined` = `undefined`

Set the default value of argument `onError` for the `deferred` function.
This change is applicable application-wide and only applies to any new invocation of `deferred()`.
