# Interface: IPromisE\_Delay\<T\>

Defined in: [packages/promise/src/types/IPromisE.ts:27](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L27)

## Extends

- [`IPromisE`](IPromisE.md)\<`T`\>

## Type Parameters

### T

`T` = `unknown`

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:176

#### Inherited from

[`IPromisE`](IPromisE.md).[`[toStringTag]`](IPromisE.md#tostringtag)

***

### onEarlyFinalize

> **onEarlyFinalize**: [`OnEarlyFinalize`](../type-aliases/OnEarlyFinalize.md)\<`T`\>[]

Defined in: [packages/promise/src/types/IPromisE.ts:8](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L8)

callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve/reject methods

#### Inherited from

[`IPromisE`](IPromisE.md).[`onEarlyFinalize`](IPromisE.md#onearlyfinalize)

***

### pause()

> **pause**: () => `void`

Defined in: [packages/promise/src/types/IPromisE.ts:67](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L67)

Caution: pausing will prevent the promise from resolving/rejeting automatically.

In order to finalize the promise either the `resolve()` or the `reject()` method must be invoked manually.

An never-finalized promise may cause memory leak and will leave it at the mercry of the garbage collector.
Use `pause()` only if you are sure.

#### Returns

`void`

#### Examples

```typescript
// Example 1: SAFE => no memory leak, because no reference to the promise is stored and no suspended code
<button onClick={() => {
    const promise = PromisE.delay(1000).then(... do stuff ....)
    setTimeout(() => promise.pause(), 300)
}}>Click Me</button>
```

```typescript
<button onClick={() => {
    const promise = PromisE.delay(1000)
    setTimeout(() => promise.pause(), 300)
    await promise // suspended code
    //... do stuff ....
}}>Click Me</button>
```

```typescript
// Until the reference to promises is collected by the garbage collector,
// reference to the unfinished promise will remain in memory.
const promises = []
<button onClick={() => {
    const promise = PromisE.delay(1000)
    setTimeout(() => promise.pause(), 300)
    promises.push(promise)
}}>Click Me</button>
```

***

### pending

> `readonly` **pending**: `boolean`

Defined in: [packages/promise/src/types/IPromisE.ts:11](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L11)

Indicates if the promise is still pending/unfinalized

#### Inherited from

[`IPromisE`](IPromisE.md).[`pending`](IPromisE.md#pending)

***

### reject()

> **reject**: (`reason`) => `void`

Defined in: [packages/promise/src/types/IPromisE.ts:14](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L14)

Reject pending promise early.

#### Parameters

##### reason

`unknown`

#### Returns

`void`

#### Inherited from

[`IPromisE`](IPromisE.md).[`reject`](IPromisE.md#reject)

***

### rejected

> `readonly` **rejected**: `boolean`

Defined in: [packages/promise/src/types/IPromisE.ts:17](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L17)

Indicates if the promise has been rejected

#### Inherited from

[`IPromisE`](IPromisE.md).[`rejected`](IPromisE.md#rejected)

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/promise/src/types/IPromisE.ts:20](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L20)

Resovle pending promise early.

#### Parameters

##### value

`T`

#### Returns

`void`

#### Inherited from

[`IPromisE`](IPromisE.md).[`resolve`](IPromisE.md#resolve)

***

### resolved

> `readonly` **resolved**: `boolean`

Defined in: [packages/promise/src/types/IPromisE.ts:23](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L23)

Indicates if the promise has been resolved

#### Inherited from

[`IPromisE`](IPromisE.md).[`resolved`](IPromisE.md#resolved)

***

### state

> `readonly` **state**: `0` \| `1` \| `2`

Defined in: [packages/promise/src/types/IPromisE.ts:5](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L5)

0: pending, 1: resolved, 2: rejected

#### Inherited from

[`IPromisE`](IPromisE.md).[`state`](IPromisE.md#state)

***

### timeoutId

> **timeoutId**: `undefined` \| `string` \| `number` \| `Timeout`

Defined in: [packages/promise/src/types/IPromisE.ts:68](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/types/IPromisE.ts#L68)

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

[`IPromisE`](IPromisE.md).[`catch`](IPromisE.md#catch)

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

[`IPromisE`](IPromisE.md).[`finally`](IPromisE.md#finally)

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

[`IPromisE`](IPromisE.md).[`then`](IPromisE.md#then)
