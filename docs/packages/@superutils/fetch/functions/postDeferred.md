# Function: postDeferred()

> **postDeferred**\<`ThisArg`\>(`deferOptions`, ...`__namedParameters`): \<`TResult`\>(...`args`) => `IPromisE`\<`TResult`\>

Defined in: [packages/fetch/src/postDeferred.ts:66](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/postDeferred.ts#L66)

## Type Parameters

### ThisArg

`ThisArg` = `unknown`

## Parameters

### deferOptions

`DeferredOptions`\<`ThisArg`\> = `{}`

### \_\_namedParameters

...\[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

## Returns

> \<`TResult`\>(...`args`): `IPromisE`\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `unknown`

### Parameters

#### args

...\[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

### Returns

`IPromisE`\<`TResult`\>

## Examples

```typescript
import PromisE from '@superutils/promise'

const refreshAuthToken = PromisE.deferredPost(
	{
		delayMs: 300, // debounce delay
		onResult: () =>
			console.log('Auth token updated at', new Date().toISOString()),
	},
	'https://dummyjson.com/auth/refresh',
)
type TokenRsult = {
	accessToken: string
	refreshToken: string
}
const handleTokens = ({ accessToken, refreshToken }: TokenRsult) => {
	   localStorage[accessToken] = accessToken
	   localStorage[refreshToken] = refreshToken
}
cons getBody = () => ({
	   refreshToken: localStorage.refreshToken,
	   expiresInMins: 30,
})
refreshAuthToken<TokenRsult>(undefined, getBody()).then(handleTokens)
refreshAuthToken<TokenRsult>(undefined, getBody()).then(handleTokens)
refreshAuthToken<TokenRsult>(undefined, getBody()).then(handleTokens)
// only the last call will be executed. Rest will be ignored/aborted by deferred mechanism.
```

```typescript
import PromisE from '@superutils/promise
type Result = { name: string }
const updateProduct = PromisE.deferredPost(
    {
        delayMs: 300, // used for both "throttle" and "deferred" modes
        //   resolveIgnored: ResolveIgnored.NEVER, // never resolve ignored requests
        onResult: (result: Result) => console.log('Product updated: ', result.name),
        throttle: true,
        trailing: true, // makes sure the last request is always executed
    },
	   'https://dummyjson.com/products/1',
	   undefined,
	   { method: 'put' },
)
updateProduct<Result>(undefined, { name: 'Product' }).then(console.log)
await PromisE.delay(300)
updateProduct<Result>(undefined, { name: 'Product N' }).then(console.log)
updateProduct<Result>(undefined, { name: 'Product Name' }).then(console.log)
updateProduct<Result>(undefined, { name: 'Product Name Updated' }).then(console.log)
// Only the first and trailing/last calls will be executed in this case.
// Rest will be ignored/aborted by throttle mechanism.
```
