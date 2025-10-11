# Class: PromisE\<T\>

Defined in: [packages/promise/src/PromisE.ts:54](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L54)

An attempt to solve the problem of Promise status (pending/resolved/rejected) not being easily accessible externally.

For more example see static functions like `PromisE.deferred}, `PromisE.fetch}, `PromisE.timeout} etc.

---

## Examples

```typescript
import PromisE from '@superutils/promise'
const p = new PromisE((resolve, reject) => resolve('done'))
console.log(
 p.pending, // Indicates if promise has finalized (resolved/rejected)
 p.resolved, // Indicates if the promise has resolved
 p.rejected // Indicates if the promise has rejected
)
```

```typescript
import PromisE from '@superutils/promise'
const instance = new Promise((resolve) => setTimeout(() => resolve(1), 1000))
const p = new PromisE(instance)
console.log(p.pending)
```

```typescript
import PromisE from '@superutils/promise'
const p = new PromisE<number>()
setTimeout(() => p.resolve(1))
p.then(console.log)
```

```typescript
import PromisE from '@superutils/promise'
const p = PromisE.try(() => { throw new Error('I am a naughty function' ) })
p.catch(console.error)
```

## Extends

- [`PromisEBase`](PromisEBase.md)\<`T`\>

## Type Parameters

### T

`T` = `unknown`

## Constructors

### Constructor

> **new PromisE**\<`T`\>(...`args`): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:17](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L17)

Create a PromisE instance as a drop-in replacement for Promise

#### Parameters

##### args

...\[(`resolve`, `reject`) => `void`\]

#### Returns

`PromisE`\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

### Constructor

> **new PromisE**\<`T`\>(`promise`): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:19](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L19)

Extend an existing Promise instance to check status or finalize early

#### Parameters

##### promise

`Promise`\<`T`\>

#### Returns

`PromisE`\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

### Constructor

> **new PromisE**\<`T`\>(): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:30](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L30)

If executor function is not provided, the promise must be resolved/rejected externally.

---

#### Returns

`PromisE`\<`T`\>

#### Example

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:176

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`[toStringTag]`](PromisEBase.md#tostringtag)

***

### onEarlyFinalize

> **onEarlyFinalize**: [`OnEarlyFinalize`](../type-aliases/OnEarlyFinalize.md)\<`T`\>[] = `[]`

Defined in: [packages/promise/src/PromisEBase.ts:14](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L14)

callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve()/reject() methods

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`onEarlyFinalize`](PromisEBase.md#onearlyfinalize)

***

### state

> `readonly` **state**: `0` \| `1` \| `2` = `0`

Defined in: [packages/promise/src/PromisEBase.ts:8](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L8)

0: pending, 1: resolved, 2: rejected

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`state`](PromisEBase.md#state)

***

### \[species\]

> `readonly` `static` **\[species\]**: `PromiseConstructor`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:180

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`[species]`](PromisEBase.md#species)

***

### config

> `static` **config**: `object`

Defined in: [packages/promise/src/PromisE.ts:56](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L56)

Global configuration

#### defaults

> **defaults**: `object`

Global default values

##### defaults.deferOptions

> **deferOptions**: [`DeferredOptions`](../type-aliases/DeferredOptions.md)

Default value for `options` used by `PromisE.*deferred*` functions

##### defaults.delayTimeoutMsg

> **delayTimeoutMsg**: `string` = `'Timed out after'`

##### defaults.fetchOptions

> **fetchOptions**: [`FetchOptionsInterceptor`](../type-aliases/FetchOptionsInterceptor.md)

Global defalut values for fetch (get, post....) requests and global interceptors

***

### deferred()

> `static` **deferred**: \<`T`\>(`options`) => \<`TResult`\>(`promise`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\> = `PromisE_deferred`

Defined in: [packages/promise/src/PromisE.ts:58](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L58)

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`DeferredOptions`](../type-aliases/DeferredOptions.md) = `{}`

(optional) options

#### Returns

a callback that is invoked in one of the followin 3 methods:
- sequential: when `delayMs` is not a positive number.
- debounced: when `delayMs > 0` and `throttle = false`
- throttled: when `delayMs > 0` and `throttle = true`

---

> \<`TResult`\>(`promise`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `T`

##### Parameters

###### promise

`Promise`\<`TResult`\> | () => `Promise`\<`TResult`\>

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Name

PromisE.deferred

#### Description

The main difference is that:
 - Notes:
     1. A "request" simply means invokation of the returned callback function
     2. By "handled" it means a "request" will be resolved or rejected.
 - `PromisE.deferred` is to be used with promises/functions
 - There is no specific time delay.
 - The time when a request is completed is irrelevant.
 - If not throttled:
     1. Once a request is handled, all previous requests will be ignored and pool starts anew.
     2. If a function is provided in the  returned callback, ALL of them will be invoked, regardless of pool size.
     3. The last/only request in an on-going requests' pool will handled (resolve/reject).
 - If throttled:
     1. Once a requst starts executing, subsequent requests will be added to a queue.
     2. The last/only item in the queue will be handled. Rest will be ignored.
     3. If a function is provided in the returned callback, it will be invoked only if the request is handled.
     Thus, improving performance by avoiding unnecessary invokations.
     4. If every single request/function needs to be invoked, avoid using throttle.

 - If throttled and `strict` is truthy, all subsequent request while a request is being handled will be ignored.

---

#### Example

```typescript
const example = throttle => {
    const df = PromisE.deferred(throttle)
    df(() => PromisE.delay(5000)).then(console.log)
    df(() => PromisE.delay(500)).then(console.log)
    df(() => PromisE.delay(1000)).then(console.log)
    // delay 2 seconds and invoke df() again
    setTimeout(() => {
        df(() => PromisE.delay(200)).then(console.log)
    }, 2000)
}

// Without throttle
example(false)
// `1000` and `200` will be printed in the console

// with throttle
example(true)
// `5000` and `200` will be printed in the console

// with throttle with strict mode
example(true)
// `5000` will be printed in the console
```

***

### deferredCallback()

> `static` **deferredCallback**: \<`TDefault`, `CbArgs`\>(`callback`, `options`) => \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\> = `PromisE_deferredCallback`

Defined in: [packages/promise/src/PromisE.ts:60](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L60)

#### Type Parameters

##### TDefault

`TDefault`

##### CbArgs

`CbArgs` *extends* `any`[] = `any`[]

#### Parameters

##### callback

(...`args`) => `TDefault` \| `Promise`\<`TDefault`\>

##### options

[`DeferredOptions`](../type-aliases/DeferredOptions.md) = `{}`

#### Returns

deferred/throttled callback function

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `TDefault`

##### Parameters

###### args

...`CbArgs`

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Example

```ts
```typescript
const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
    delayMs: 300,
    throttle: false, // throttle with delay duration set in `defer`
})
// simulate click event
const delays = [
    100,
    150,
    200,
    550,
    580,
    600,
    1000,
    1100,
]
delays.forEach(timeout =>
    setTimeout(() => handleChangeDeferred({
       target: { value: timeout }
    }), timeout)
)

// Result (defer: 300, throttle: true): uses throttled()
// 100, 550, 1100

// Result (defer: 300, throttle: false): uses deferred()
// 200, 600, 1100
```
```

***

### deferredFetch()

> `static` **deferredFetch**: \<`TArgs`, `ThisArg`\>(`deferOptions`, ...`defaultArgs`) => \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\> = `PromisE_deferredFetch`

Defined in: [packages/promise/src/PromisE.ts:62](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L62)

#### Type Parameters

##### TArgs

`TArgs` *extends* [`FetchDeferredArgs`](../type-aliases/FetchDeferredArgs.md)

##### ThisArg

`ThisArg` = `unknown`

#### Parameters

##### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

##### defaultArgs

...`TArgs`

#### Returns

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `unknown`

##### Parameters

###### args

...`CbArgs`

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Name

PromisE.deferredFetch

#### Example

```ts
```typescript
---
// Example: Fetch paginated products
const getProducts = PromisE.deferredFetch({
    delayMs: 300, // used for both "throttle" and "deferred" modes
    resolveIgnored: ResolveIgnored.WITH_ACTIVE,
    throttle: true,
})
getProducts('https://dummyjson.com/products/1').then(console.log)
setTimeout(()=> getProducts('https://dummyjson.com/products/2').then(console.log), 200)
// result (throttle = true): only product 1 retrieved

// result (throttle = false): only product 2 retrieved

// result (ResolveIgnored.WITH_ACTIVE): only product retrieved but both request will resolve the same result

// result (ResolveIgnored.WITH_UNDEFINED): only one product retrieved & resolved but the other will resolve with undefined

// result (ResolveIgnored.NEVER): only one product retrieved & resolved but the other will NEVER resolve
```
```

***

### deferredPost()

> `static` **deferredPost**: \<`ThisArg`\>(`deferOptions`, ...`__namedParameters`) => \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\> = `PromisE_deferredPost`

Defined in: [packages/promise/src/PromisE.ts:64](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L64)

#### Type Parameters

##### ThisArg

`ThisArg` = `unknown`

#### Parameters

##### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

##### \_\_namedParameters

...\[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

#### Returns

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `unknown`

##### Parameters

###### args

...\[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Examples

```typescript
const refreshAuthToken = PromisE_deferredPost(
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

***

### delay()

> `static` **delay**: \<`T`\>(`duration`, `result`, `asRejected`, `timeoutErrMsg?`) => [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\> = `PromisE_delay`

Defined in: [packages/promise/src/PromisE.ts:66](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L66)

#### Type Parameters

##### T

`T` = `number`

#### Parameters

##### duration

`number` = `100`

duration in milliseconds

##### result

`T` = `...`

(optional) specify a value to resolve or reject with.
                             Default: `delayMs` when resolved or timed out error when rejected

##### asRejected

`boolean` = `false`

(optional) if `true`, will reject the promise after the delay.

##### timeoutErrMsg?

`string`

#### Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

See [IPromisE\_Delay](../interfaces/IPromisE_Delay.md)

#### Name

PromisE.delay

#### Example

***

### delayReject()

> `static` **delayReject**: \<`T`\>(`delay`, `reason?`) => [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\> = `PromisE_delayReject`

Defined in: [packages/promise/src/PromisE.ts:68](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L68)

#### Type Parameters

##### T

`T` = `never`

#### Parameters

##### delay

`number`

##### reason?

`any`

#### Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

#### Name

PromisE.delayReject

#### Examples

---

***

### fetch()

> `static` **fetch**: \<`TJSON`, `TOptions`, `TReturn`\>(`url`, `fetchOptions`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TReturn`\> = `PromisE_fetch`

Defined in: [packages/promise/src/PromisE.ts:72](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L72)

**`Function`**

PromisE.fetch

#### Type Parameters

##### TJSON

`TJSON` = `unknown`

##### TOptions

`TOptions` *extends* [`FetchOptions`](../type-aliases/FetchOptions.md) = [`FetchOptions`](../type-aliases/FetchOptions.md)

##### TReturn

`TReturn` = `TOptions`\[`"as"`\] *extends* [`FetchAs`](../enumerations/FetchAs.md) ? [`FetchResult`](../interfaces/FetchResult.md)\<`TJSON`\>\[`any`\[`any`\]\] : `TJSON`

#### Parameters

##### url

`string` | `URL`

##### fetchOptions

`TOptions` & `RequestInit` & [`FetchConf`](../type-aliases/FetchConf.md) & [`FetchRetryConf`](../type-aliases/FetchRetryConf.md) = `...`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TReturn`\>

***

### fetchDeferred()

> `static` **fetchDeferred**: \<`TArgs`, `ThisArg`\>(`deferOptions`, ...`defaultArgs`) => \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/PromisE.ts:70](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L70)

#### Type Parameters

##### TArgs

`TArgs` *extends* [`FetchDeferredArgs`](../type-aliases/FetchDeferredArgs.md)

##### ThisArg

`ThisArg` = `unknown`

#### Parameters

##### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

##### defaultArgs

...`TArgs`

#### Returns

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `unknown`

##### Parameters

###### args

...`CbArgs`

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Name

PromisE.deferredFetch

#### Example

```ts
```typescript
---
// Example: Fetch paginated products
const getProducts = PromisE.deferredFetch({
    delayMs: 300, // used for both "throttle" and "deferred" modes
    resolveIgnored: ResolveIgnored.WITH_ACTIVE,
    throttle: true,
})
getProducts('https://dummyjson.com/products/1').then(console.log)
setTimeout(()=> getProducts('https://dummyjson.com/products/2').then(console.log), 200)
// result (throttle = true): only product 1 retrieved

// result (throttle = false): only product 2 retrieved

// result (ResolveIgnored.WITH_ACTIVE): only product retrieved but both request will resolve the same result

// result (ResolveIgnored.WITH_UNDEFINED): only one product retrieved & resolved but the other will resolve with undefined

// result (ResolveIgnored.NEVER): only one product retrieved & resolved but the other will NEVER resolve
```
```

***

### post()

> `static` **post**: \<`T`\>(...`__namedParameters`) => [`IPromisE`](../interfaces/IPromisE.md)\<`T`\> = `PromisE_post`

Defined in: [packages/promise/src/PromisE.ts:74](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L74)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### \_\_namedParameters

...[`PostArgs`](../type-aliases/PostArgs.md)

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Name

PromisE.post

***

### postDeferred()

> `static` **postDeferred**: \<`ThisArg`\>(`deferOptions`, ...`__namedParameters`) => \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/PromisE.ts:76](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L76)

#### Type Parameters

##### ThisArg

`ThisArg` = `unknown`

#### Parameters

##### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

##### \_\_namedParameters

...\[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

#### Returns

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `unknown`

##### Parameters

###### args

...\[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Examples

```typescript
const refreshAuthToken = PromisE_deferredPost(
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

***

### timeout()

> `static` **timeout**: \<`T`, `TOut`\>(`timeout`, ...`values`) => [`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`TOut`\> = `PromisE_timeout`

Defined in: [packages/promise/src/PromisE.ts:78](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisE.ts#L78)

#### Type Parameters

##### T

`T` *extends* `any`[] \| \[\]

##### TOut

`TOut` = `T`\[`"length"`\] *extends* `1` ? `T`\[`0`\] : `T`

#### Parameters

##### timeout

`number` = `10_000`

(optional) timeout duration in milliseconds.
                 Default: `10000` (10 seconds)

##### values

...`Promise`\<`TOut`\>[]

promise/function: one or more promises as individual arguments

#### Returns

[`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`TOut`\>

#### Name

PromisE.timeout

#### Examples

```typescript
PromisE.timeout(
  5000, // timeout after 5000ms
  PromisE.delay(1000), // resolves after 1000ms with value 1000
).then(console.log)
// Result: 1000
```

```typescript
PromisE.timeout(
    5000, // timeout after 5000ms
    PromisE.delay(1000), // resolves after 1000ms with value 1000
    PromisE.delay(2000), // resolves after 2000ms with value 2000
    PromisE.delay(3000), // resolves after 3000ms with value 3000
).then(console.log)
// Result: [ 1000, 2000, 3000 ]
```

```typescript
PromisE.timeout(
    5000, // timeout after 5000ms
    PromisE.delay(20000), // resolves after 20000ms with value 20000
).catch(console.error)
// Error: Error('Timed out after 5000ms')
```

// Eg: when API request is taking longer than expected, print a message but not reject the promise.
```typescript
const promise = PromisE.timeout(
    5000, // timeout after 5000ms
    PromisE.delay(20000), // data promise, resolves after 20000ms with value 20000
)
const data = await promise.catch(err => {
    // promise did not time out, but was rejected because one of the data promises rejected
    if (!promise.timedout) return Promise.reject(err)

    // promise timed out >> print/update UI
    console.log('Request is taking longer than expected......')
    // now return the data promise (the promise(s) provided in the PromisE.timeout())
    return promise.data
})
```

## Accessors

### pending

#### Get Signature

> **get** **pending**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:59](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L59)

Indicates if the promise is still pending/unfinalized

##### Returns

`boolean`

Indicates if the promise is still pending/unfinalized

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`pending`](PromisEBase.md#pending)

***

### rejected

#### Get Signature

> **get** **rejected**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:64](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L64)

Indicates if the promise has been rejected

##### Returns

`boolean`

Indicates if the promise has been rejected

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`rejected`](PromisEBase.md#rejected)

***

### resolved

#### Get Signature

> **get** **resolved**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:69](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L69)

Indicates if the promise has been resolved

##### Returns

`boolean`

Indicates if the promise has been resolved

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`resolved`](PromisEBase.md#resolved)

## Methods

### catch()

> **catch**\<`TResult`\>(`onrejected?`): `Promise`\<`T` \| `TResult`\>

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1564

Attaches a callback for only the rejection of the Promise.

#### Type Parameters

##### TResult

`TResult` = `never`

#### Parameters

##### onrejected?

The callback to execute when the Promise is rejected.

`null` | (`reason`) => `TResult` \| `PromiseLike`\<`TResult`\>

#### Returns

`Promise`\<`T` \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`catch`](PromisEBase.md#catch)

***

### finally()

> **finally**(`onfinally?`): `Promise`\<`T`\>

Defined in: node\_modules/typescript/lib/lib.es2018.promise.d.ts:29

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

##### onfinally?

The callback to execute when the Promise is settled (fulfilled or rejected).

`null` | () => `void`

#### Returns

`Promise`\<`T`\>

A Promise for the completion of the callback.

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`finally`](PromisEBase.md#finally)

***

### reject()

> **reject**(`reason`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:92](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L92)

Reject pending promise early.

#### Parameters

##### reason

`any`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`reject`](PromisEBase.md#reject)

***

### resolve()

> **resolve**(`value`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:80](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L80)

Resovle pending promise early.

#### Parameters

##### value

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`resolve`](PromisEBase.md#resolve)

***

### then()

> **then**\<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`\<`TResult1` \| `TResult2`\>

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1557

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type Parameters

##### TResult1

`TResult1` = `T`

##### TResult2

`TResult2` = `never`

#### Parameters

##### onfulfilled?

The callback to execute when the Promise is resolved.

`null` | (`value`) => `TResult1` \| `PromiseLike`\<`TResult1`\>

##### onrejected?

The callback to execute when the Promise is rejected.

`null` | (`reason`) => `TResult2` \| `PromiseLike`\<`TResult2`\>

#### Returns

`Promise`\<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`then`](PromisEBase.md#then)

***

### all()

> `static` **all**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\<P\>\]\> \}\>

Defined in: [packages/promise/src/PromisEBase.ts:110](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L110)

Sugar for `new PromisE(Promise.all(...))`

#### Type Parameters

##### T

`T` *extends* \[\] \| readonly `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\<P\>\]\> \}\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`all`](PromisEBase.md#all)

***

### allSettled()

> `static` **allSettled**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\[`number`\]\>\>[]\>

Defined in: [packages/promise/src/PromisEBase.ts:116](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L116)

Sugar for `new PromisE(Promise.allSettled(...))`

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\[`number`\]\>\>[]\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`allSettled`](PromisEBase.md#allsettled)

***

### any()

> `static` **any**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\[`number`\]\>

Defined in: [packages/promise/src/PromisEBase.ts:122](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L122)

Sugar for `new PromisE(Promise.any(...))`

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\[`number`\]\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`any`](PromisEBase.md#any)

***

### race()

> `static` **race**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

Defined in: [packages/promise/src/PromisEBase.ts:126](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L126)

Sugar for `new PromisE(Promise.race(..))`

#### Type Parameters

##### T

`T`

#### Parameters

##### values

`T`[]

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`race`](PromisEBase.md#race)

***

### reject()

> `static` **reject**\<`T`\>(`reason`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:130](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L130)

Extends Promise.reject

#### Type Parameters

##### T

`T` = `never`

#### Parameters

##### reason

`any`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`reject`](PromisEBase.md#reject-2)

***

### resolve()

> `static` **resolve**\<`T`\>(`value?`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:137](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L137)

Sugar for `new PromisE(Promise.resolve(...))`

#### Type Parameters

##### T

`T`

#### Parameters

##### value?

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`resolve`](PromisEBase.md#resolve-2)

***

### try()

> `static` **try**\<`T`, `U`\>(`callbackFn`, ...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

Defined in: [packages/promise/src/PromisEBase.ts:141](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L141)

Sugar for `new PromisE(Promise.try(...))`

#### Type Parameters

##### T

`T`

##### U

`U` *extends* `unknown`[]

#### Parameters

##### callbackFn

(...`args`) => `T` \| `PromiseLike`\<`T`\>

##### args

...`U`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`try`](PromisEBase.md#try)

***

### withResolvers()

> `static` **withResolvers**\<`T`\>(): `object`

Defined in: [packages/promise/src/PromisEBase.ts:182](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/PromisEBase.ts#L182)

Creates a `PromisE` instance and returns it in an object, along with its `resolve` and `reject` functions.

NB: this function is technically no longer needed because the `PromisE` class already comes with the resolvers.

---

#### Type Parameters

##### T

`T` = `unknown`

#### Returns

`object`

##### promise

> **promise**: [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

##### reject()

> **reject**: (`reason?`) => `void`

###### Parameters

###### reason?

`any`

###### Returns

`void`

##### resolve()

> **resolve**: (`value`) => `void`

###### Parameters

###### value

`T` | `PromiseLike`\<`T`\>

###### Returns

`void`

#### Examples

Using `PromisE` directly: simply provide an empty function as the executor

```typescript
import PromisE from '@superutils/promise'
const promisE = new PromisE<number>(() => {})
setTimeout(() => promisE.resolve(1), 1000)
promisE.then(console.log)
```

Using `withResolvers`
```typescript
import PromisE from '@superutils/promise'
const pwr = PromisE.withResolvers<number>()
setTimeout(() => pwr.resolve(1), 1000)
pwr.promise.then(console.log)
```

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`withResolvers`](PromisEBase.md#withresolvers)
