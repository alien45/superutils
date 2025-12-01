# Type Alias: DeferredOptions\<ThisArg\>

> **DeferredOptions**\<`ThisArg`\> = `object` & `object` & `ThrottleConfig`\<`ThisArg`\> \| `object` & `DeferredConfig`\<`ThisArg`\>

Defined in: packages/promise/dist/index.d.ts:81

## Type Declaration

### delayMs?

> `optional` **delayMs**: `number`

Delay in milliseconds, used for `debounce` and `throttle` modes.

### onError()?

> `optional` **onError**: (`err`) => `ValueOrPromise`\<`unknown`\>

Callback invoked whenever promise/function throws error

#### Parameters

##### err

`unknown`

#### Returns

`ValueOrPromise`\<`unknown`\>

### onIgnore()?

> `optional` **onIgnore**: (`ignored`) => `ValueOrPromise`\<`unknown`\>

Whenever a promise/function is ignored when in debource/throttle mode, `onIgnored` wil be invoked.
The promise/function will not be invoked, unless it's manually invoked using the `ignored` function.
Use for debugging or logging purposes.

#### Parameters

##### ignored

() => `Promise`\<`unknown`\>

#### Returns

`ValueOrPromise`\<`unknown`\>

### onResult()?

> `optional` **onResult**: (`result?`) => `ValueOrPromise`\<`unknown`\>

Whenever a promise/function is executed successfully `onResult` will be called.
Those that are ignored but resolve with last will not cause `onResult` to be invoked.

Result can be `undefined` if `ResolveIgnored.WITH_UNDEFINED` is used.

#### Parameters

##### result?

`unknown`

#### Returns

`ValueOrPromise`\<`unknown`\>

### resolveError?

> `optional` **resolveError**: [`ResolveError`](../enumerations/ResolveError.md)

What do to when an executed function/promise throws error
See [ResolveError](../enumerations/ResolveError.md) for available options.

### resolveIgnored?

> `optional` **resolveIgnored**: [`ResolveIgnored`](../enumerations/ResolveIgnored.md)

Indicates what to do when a promise in the queue is ignored.
See [ResolveIgnored](../enumerations/ResolveIgnored.md) for available options.

### throttle?

> `optional` **throttle**: `boolean`

Enable throttle mode. Requires DeferredOptions.delayMs

## Type Parameters

### ThisArg

`ThisArg` = `unknown`
