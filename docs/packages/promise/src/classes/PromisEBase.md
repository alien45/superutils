# Class: PromisEBase\<T\>

Defined in: [packages/promise/src/PromisEBase.ts:4](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L4)

## Extends

- `Promise`\<`T`\>

## Extended by

- [`PromisE`](PromisE.md)

## Type Parameters

### T

`T` = `unknown`

## Implements

- [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

## Constructors

### Constructor

> **new PromisEBase**\<`T`\>(...`args`): `PromisEBase`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:17](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L17)

Create a PromisE instance as a drop-in replacement for Promise

#### Parameters

##### args

...\[(`resolve`, `reject`) => `void`\]

#### Returns

`PromisEBase`\<`T`\>

#### Overrides

`Promise<T>.constructor`

### Constructor

> **new PromisEBase**\<`T`\>(`promise`): `PromisEBase`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:19](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L19)

Extend an existing Promise instance to check status or finalize early

#### Parameters

##### promise

`Promise`\<`T`\>

#### Returns

`PromisEBase`\<`T`\>

#### Overrides

`Promise<T>.constructor`

### Constructor

> **new PromisEBase**\<`T`\>(): `PromisEBase`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:30](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L30)

If executor function is not provided, the promise must be resolved/rejected externally.

---

#### Returns

`PromisEBase`\<`T`\>

#### Example

#### Overrides

`Promise<T>.constructor`

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:176

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`[toStringTag]`](../interfaces/IPromisE.md#tostringtag)

#### Inherited from

[`PromisE`](PromisE.md).[`[toStringTag]`](PromisE.md#tostringtag)

***

### onEarlyFinalize

> **onEarlyFinalize**: [`OnEarlyFinalize`](../type-aliases/OnEarlyFinalize.md)\<`T`\>[] = `[]`

Defined in: [packages/promise/src/PromisEBase.ts:14](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L14)

callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve()/reject() methods

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`onEarlyFinalize`](../interfaces/IPromisE.md#onearlyfinalize)

***

### state

> `readonly` **state**: `0` \| `1` \| `2` = `0`

Defined in: [packages/promise/src/PromisEBase.ts:8](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L8)

0: pending, 1: resolved, 2: rejected

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`state`](../interfaces/IPromisE.md#state)

***

### \[species\]

> `readonly` `static` **\[species\]**: `PromiseConstructor`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:180

#### Inherited from

`Promise.[species]`

## Accessors

### pending

#### Get Signature

> **get** **pending**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:59](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L59)

Indicates if the promise is still pending/unfinalized

##### Returns

`boolean`

Indicates if the promise is still pending/unfinalized

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`pending`](../interfaces/IPromisE.md#pending)

***

### rejected

#### Get Signature

> **get** **rejected**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:64](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L64)

Indicates if the promise has been rejected

##### Returns

`boolean`

Indicates if the promise has been rejected

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`rejected`](../interfaces/IPromisE.md#rejected)

***

### resolved

#### Get Signature

> **get** **resolved**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:69](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L69)

Indicates if the promise has been resolved

##### Returns

`boolean`

Indicates if the promise has been resolved

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`resolved`](../interfaces/IPromisE.md#resolved)

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

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`catch`](../interfaces/IPromisE.md#catch)

#### Inherited from

`Promise.catch`

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

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`finally`](../interfaces/IPromisE.md#finally)

#### Inherited from

`Promise.finally`

***

### reject()

> **reject**(`reason`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:92](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L92)

Reject pending promise early.

#### Parameters

##### reason

`any`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`reject`](../interfaces/IPromisE.md#reject)

***

### resolve()

> **resolve**(`value`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:80](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L80)

Resovle pending promise early.

#### Parameters

##### value

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`resolve`](../interfaces/IPromisE.md#resolve)

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

#### Implementation of

[`IPromisE`](../interfaces/IPromisE.md).[`then`](../interfaces/IPromisE.md#then)

#### Inherited from

`Promise.then`

***

### all()

> `static` **all**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\<P\>\]\> \}\>

Defined in: [packages/promise/src/PromisEBase.ts:110](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L110)

Sugar for `new PromisE(Promise.all(...))`

#### Type Parameters

##### T

`T` *extends* \[\] \| readonly `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\<P\>\]\> \}\>

#### Overrides

`Promise.all`

***

### allSettled()

> `static` **allSettled**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\[`number`\]\>\>[]\>

Defined in: [packages/promise/src/PromisEBase.ts:116](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L116)

Sugar for `new PromisE(Promise.allSettled(...))`

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\[`number`\]\>\>[]\>

#### Overrides

`Promise.allSettled`

***

### any()

> `static` **any**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\[`number`\]\>

Defined in: [packages/promise/src/PromisEBase.ts:122](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L122)

Sugar for `new PromisE(Promise.any(...))`

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\[`number`\]\>

#### Overrides

`Promise.any`

***

### race()

> `static` **race**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

Defined in: [packages/promise/src/PromisEBase.ts:126](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L126)

Sugar for `new PromisE(Promise.race(..))`

#### Type Parameters

##### T

`T`

#### Parameters

##### values

`T`[]

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

#### Overrides

`Promise.race`

***

### reject()

> `static` **reject**\<`T`\>(`reason`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:130](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L130)

Extends Promise.reject

#### Type Parameters

##### T

`T` = `never`

#### Parameters

##### reason

`any`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Overrides

`Promise.reject`

***

### resolve()

> `static` **resolve**\<`T`\>(`value?`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:137](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L137)

Sugar for `new PromisE(Promise.resolve(...))`

#### Type Parameters

##### T

`T`

#### Parameters

##### value?

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Overrides

`Promise.resolve`

***

### try()

> `static` **try**\<`T`, `U`\>(`callbackFn`, ...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

Defined in: [packages/promise/src/PromisEBase.ts:141](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L141)

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

#### Overrides

`Promise.try`

***

### withResolvers()

> `static` **withResolvers**\<`T`\>(): `object`

Defined in: [packages/promise/src/PromisEBase.ts:182](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/PromisEBase.ts#L182)

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
import PromisE from '@utiils/promise'
const promisE = new PromisE<number>(() => {})
setTimeout(() => promisE.resolve(1), 1000)
promisE.then(console.log)
```

Using `withResolvers`
```typescript
import PromisE from '@utiils/promise'
const pwr = PromisE.withResolvers<number>()
setTimeout(() => pwr.resolve(1), 1000)
pwr.promise.then(console.log)
```

#### Overrides

`Promise.withResolvers`
