# Function: getUrlParam()

> **getUrlParam**\<`TName`, `TAsArray`, `TResult`\>(`name?`, `url?`, `asArray?`): `TResult`

Defined in: [packages/core/src/str/getUrlParam.ts:16](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/str/getUrlParam.ts#L16)

Read parameters of a given URL

## Type Parameters

### TName

`TName` *extends* `undefined` \| `string`

### TAsArray

`TAsArray` *extends* `undefined` \| `true` \| `string`[]

### TResult

`TResult` = `TName` *extends* `undefined` ? `Record`\<`string`, `string`\> : `string` \| `string`[]

## Parameters

### name?

`TName`

(optional) name of a specific parameter to get value of.
If not provided, will return an object containing all the URL parameters with respective values.

### url?

(optional) default: `window.location.href`

`string` | `URL`

### asArray?

`TAsArray`

(optional) parameter names that should be returned as Array.
By default if a parameter contains multiple values it will be returned as unique Array.

## Returns

`TResult`
