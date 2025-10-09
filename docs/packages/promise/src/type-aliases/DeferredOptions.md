# Type Alias: DeferredOptions\<ThisArg\>

> **DeferredOptions**\<`ThisArg`\> = `object` & `object` & `ThrottleConfig`\<`ThisArg`\> \| `object` & `DeferredConfig`\<`ThisArg`\>

Defined in: [packages/promise/src/types/deferred.ts:3](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/deferred.ts#L3)

## Type Declaration

### delayMs?

> `optional` **delayMs**: `number`

Delay in milliseconds, used for `debounce` and `throttle` modes.

### onError()?

> `optional` **onError**: (`err`) => `any` \| `Promise`\<`any`\>

Callback invoked whenever promise/function throws error

#### Parameters

##### err

`any`

#### Returns

`any` \| `Promise`\<`any`\>

### onIgnore()?

> `optional` **onIgnore**: (`ignored`) => `any` \| `Promise`\<`any`\>

Whenever a promise/function is ignored when in debource/throttle mode, `onIgnored` wil be invoked.
The promise/function will not be invoked, unless it's manually invoked using the `ignored` function.
Use for debugging or logging purposes.

#### Parameters

##### ignored

() => `Promise`\<`any`\>

#### Returns

`any` \| `Promise`\<`any`\>

### onResult()?

> `optional` **onResult**: (`result?`) => `any` \| `Promise`\<`any`\>

Whenever a promise/function is executed successfully `onResult` will be called.
Those that are ignored but resolve with last will not cause `onResult` to be invoked.

Result can be `undefined` if `ResolveIgnored.WITH_UNDEFINED` is used.

#### Parameters

##### result?

`any`

#### Returns

`any` \| `Promise`\<`any`\>

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
