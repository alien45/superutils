# Function: fetchDeferred()

> **fetchDeferred**\<`TArgs`, `ThisArg`\>(`deferOptions`, ...`defaultFetchArgs`): \<`TResult`\>(...`args`) => `IPromisE`\<`TResult`\>

Defined in: [packages/fetch/src/fetchDeferred.ts:102](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/fetch/src/fetchDeferred.ts#L102)

Creates a deferred/throttled version of [fetch](fetch.md), powered by PromisE.deferred.
This is ideal for scenarios requiring advanced control over HTTP requests, such as debouncing search inputs,
throttling API calls, or ensuring sequential request execution.

It leverages the robust capabilities of the underlying [fetch](fetch.md) function, which includes features like request timeouts and manual abortion.
`fetchDeferred` uses this to automatically abort pending requests when a new one is initiated, preventing race conditions and redundant network traffic.

## Type Parameters

### TArgs

`TArgs` *extends* [`FetchDeferredArgs`](../type-aliases/FetchDeferredArgs.md)

### ThisArg

`ThisArg` = `unknown`

## Parameters

### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

Configuration for the deferred execution behavior (e.g., `delayMs`, `throttle`).
See [DeferredOptions](../type-aliases/DeferredOptions.md) for details.

### defaultFetchArgs

...`TArgs`

(optional) Default `url` and `fetchOptions` to be used for every call made by the
returned function. This is useful for creating a reusable client for a specific endpoint.

## Returns

> \<`TResult`\>(...`args`): `IPromisE`\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `unknown`

### Parameters

#### args

...[`FetchDeferredCbArgs`](../type-aliases/FetchDeferredCbArgs.md)

### Returns

`IPromisE`\<`TResult`\>

## Examples

```typescript
import { fetchDeferred, ResolveIgnored } from '@superutils/fetch'

// Create a debounced search function with a 300ms delay.
const searchProducts = fetchDeferred({
	delayMs: 300, // Debounce delay
	resolveIgnored: ResolveIgnored.WITH_UNDEFINED, // Ignored (aborted) promises will resolve with `undefined`
})

// User types 'iphone'
searchProducts('https://dummyjson.com/products/search?q=iphone').then(result => {
  console.log('Result for "iphone":', result);
});

// Before 300ms has passed, the user continues typing 'iphone 9'
setTimeout(() => {
  searchProducts('https://dummyjson.com/products/search?q=iphone 9').then(result => {
    console.log('Result for "iphone 9":', result);
  });
}, 200);

// Outcome:
// The first request for "iphone" is aborted.
// The first promise resolves with `undefined`.
// The second request for "iphone 9" is executed after the 300ms debounce delay.
```

**Behavior with different `deferOptions` in the example above:**
- **`throttle: true`**: Switches from debounce to throttle mode. The first request for "iphone" would
execute immediately. The second request for "iphone 9", made within the 300ms throttle window, would be ignored.
- **`delayMs: 0`**: Disables debouncing and throttling, enabling sequential/queue mode. Both requests ("iphone"
and "iphone 9") would execute, but one after the other, never simultaneously.
- **`resolveIgnored`**: Controls how the promise for an aborted request (like the first "iphone" call) resolves.
   1. `ResolveIgnored.WITH_UNDEFINED` (used in the example): The promise for the aborted "iphone"
request resolves with `undefined`.
   2. `ResolveIgnored.WITH_LAST`: The promise for the aborted "iphone" request waits and resolves with the result
of the final "iphone 9" request. Both promises resolve to the same value.
   3. `ResolveIgnored.NEVER`: The promise for the aborted "iphone" request is neither resolved nor rejected.
It will remain pending indefinitely.
   4. `ResolveIgnored.WITH_ERROR`: The promise for the aborted "iphone" request is rejected with a `FetchError`.

```typescript
import { fetchDeferred, ResolveIgnored } from '@superutils/fetch'

// Create a throttled function to fetch a random quote.
// The URL and a 3-second timeout are set as defaults, creating a reusable client.
const getRandomQuote = fetchDeferred(
	{
		delayMs: 300, // Throttle window
		throttle: true,
     // Ignored calls will resolve with the result of the last successful call.
		resolveIgnored: ResolveIgnored.WITH_LAST,
	},
	'https://dummyjson.com/quotes/random', // Default URL
	{ timeout: 3000 }, // Default fetch options
)

// Call the function multiple times in quick succession.
getRandomQuote().then(quote => console.log('Call 1 resolved:', quote.id));
getRandomQuote().then(quote => console.log('Call 2 resolved:', quote.id));
getRandomQuote().then(quote => console.log('Call 3 resolved:', quote.id));

// Outcome:
// Due to throttling, only one network request is made.
// Because `resolveIgnored` is `WITH_LAST`, all three promises resolve with the same quote.
// The promises for the two ignored calls resolve as soon as the first successful call resolves.
// Console output will show the same quote ID for all three calls.
```
