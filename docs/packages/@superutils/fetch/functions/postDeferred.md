# Function: postDeferred()

> **postDeferred**\<`ThisArg`, `DefaultUrl`\>(`deferOptions`, `defaultUrl?`, `defaultData?`, `defaultOptions?`): \<`TResult`\>(...`args`) => `IPromisE`\<`TResult`\>

Defined in: [packages/fetch/src/postDeferred.ts:99](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/postDeferred.ts#L99)

Creates a deferred/throttled function for making `POST`, `PUT`, or `PATCH` requests, powered by
PromisE.deferred.
This is ideal for scenarios like auto-saving form data, preventing duplicate submissions on button clicks,
or throttling API updates.

Like `fetchDeferred`, it automatically aborts pending requests when a new one is initiated, ensuring only
the most recent or relevant action is executed.

## Type Parameters

### ThisArg

`ThisArg`

### DefaultUrl

`DefaultUrl` *extends* `string` \| `URL`

## Parameters

### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

### defaultUrl?

`DefaultUrl`

### defaultData?

[`PostBody`](../type-aliases/PostBody.md)

### defaultOptions?

`Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`

## Returns

> \<`TResult`\>(...`args`): `IPromisE`\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `unknown`

### Parameters

#### args

...`DefaultUrl` *extends* `undefined` ? [`PostArgs`](../type-aliases/PostArgs.md) : \[`string` \| `URL`, [`PostBody`](../type-aliases/PostBody.md), `Omit`\<[`FetchOptions`](../type-aliases/FetchOptions.md), `"method"`\> & `object`\]

### Returns

`IPromisE`\<`TResult`\>

## Examples

```typescript
import { postDeferred } from '@superutils/fetch'
import PromisE from '@superutils/promise'

// Mock a simple token store
let currentRefreshToken = 'initial-refresh-token'

// Create a debounced function to refresh the auth token.
// It waits 300ms after the last call before executing.
const refreshAuthToken = postDeferred(
	{
		delayMs: 300, // debounce delay
		onResult: (result: { token: string }) => {
			console.log(`Auth token successfully refreshed at ${new Date().toISOString()}`)
         currentRefreshToken = result.token
     },
	},
	'https://dummyjson.com/auth/refresh', // Default URL
)

// This function would be called from various parts of an app,
// for example, in response to multiple failed API calls.
function requestNewToken() {
  const body = {
	   refreshToken: currentRefreshToken,
	   expiresInMins: 30,
  }
  refreshAuthToken(body)
}

requestNewToken() // Called at 0ms
PromisE.delay(50, requestNewToken) // Called at 50ms
PromisE.delay(100, requestNewToken) // Called at 100ms

// Outcome:
// The first two calls are aborted by the debounce mechanism.
// Only the final call executes, 300ms after it was made (at the 400ms mark).
// The token is refreshed only once, preventing redundant network requests.
```

```typescript
import { postDeferred } from '@superutils/fetch'
import PromisE from '@superutils/promise'

// Create a throttled function to auto-save product updates.
const saveProductThrottled = postDeferred(
    {
        delayMs: 1000, // Throttle window of 1 second
        throttle: true,
        trailing: true, // Ensures the very last update is always saved
        onResult: (product) => console.log(`[Saved] Product: ${product.title}`),
    },
	   'https://dummyjson.com/products/1', // Default URL
	   undefined, // No default data
	   { method: 'put' }, // Default method
)

// Simulate a user typing quickly, triggering multiple saves.
console.log('User starts typing...');
saveProductThrottled({ title: 'iPhone' }); // Executed immediately (leading edge)
await PromisE.delay(200);
saveProductThrottled({ title: 'iPhone 15' }); // Ignored (within 1000ms throttle window)
await PromisE.delay(300);
saveProductThrottled({ title: 'iPhone 15 Pro' }); // Ignored
await PromisE.delay(400);
saveProductThrottled({ title: 'iPhone 15 Pro Max' }); // Queued to execute on the trailing edge

// Outcome:
// The first call ('iPhone') is executed immediately.
// The next two calls are ignored by the throttle.
// The final call ('iPhone 15 Pro Max') is executed after the 1000ms throttle window closes,
// thanks to `trailing: true`.
// This results in only two network requests instead of four.
```
