# Type Alias: DeferredOptions\<ThisArg\>

> **DeferredOptions**\<`ThisArg`\> = `object` & `object` & [`ThrottleConfig`](../../core/type-aliases/ThrottleConfig.md)\<`ThisArg`\> \| `object` & [`DeferredConfig`](../../core/interfaces/DeferredConfig.md)\<`ThisArg`\>

Defined in: [packages/promise/src/types/deferred.ts:15](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/deferred.ts#L15)

## Type Declaration

### delayMs?

> `optional` **delayMs**: `number`

Delay in milliseconds, used for `debounce` and `throttle` modes.

### onError()?

> `optional` **onError**: (`err`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

Callback invoked whenever promise/function throws error

#### Parameters

##### err

`unknown`

#### Returns

[`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

### onIgnore()?

> `optional` **onIgnore**: (`ignored`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

Whenever a promise/function is ignored when in debource/throttle mode, `onIgnored` wil be invoked.
The promise/function will not be invoked, unless it's manually invoked using the `ignored` function.
Use for debugging or logging purposes.

#### Parameters

##### ignored

() => `Promise`\<`unknown`\>

#### Returns

[`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

### onResult()?

> `optional` **onResult**: (`result?`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

Whenever a promise/function is executed successfully `onResult` will be called.
Those that are ignored but resolve with last will not cause `onResult` to be invoked.

Result can be `undefined` if `ResolveIgnored.WITH_UNDEFINED` is used.

#### Parameters

##### result?

`unknown`

#### Returns

[`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

### resolveError?

> `optional` **resolveError**: [`ResolveError`](../enumerations/ResolveError.md)

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
