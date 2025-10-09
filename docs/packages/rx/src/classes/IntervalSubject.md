# Class: IntervalSubject

Defined in: [packages/rx/src/IntervalSubject.ts:33](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L33)

## Name

IntervalSubject

## Example

```ts
```typescript
// Example 1: Fetch data from API server every minute
const initialValue = 0
const rxInterval = new IntervalSubject(
	true, // auto-start
	60 * 1000, // interval delay. increment counter every "x" milliseconds
 initialValue, // initial counter value
	1, // increment by 1 at each interval
)

const onChange = (counter: number) => {
	counter === initialValue && console.log('Counter started')
	const { PromisE } = require('@utiils/core')
	PromisE.fetch('https://jsonplaceholder.typicode.com/todos/100').then(
        () => console.log(new Date().toISOString(), 'Successful ping'),
        (err: Error) => console.log('Ping failed.', err)
    )
}

// BehaviorSubject automatically resolves with the initial value if subscribed immediately.
// subscribe to the subject and execute `onChange`: first time immediately and then every 60 seconds
rxInterval.subscribe(onChange)
```
```

## Extends

- [`BehaviorSubject`](../variables/BehaviorSubject.md)\<`number`\>

## Constructors

### Constructor

> **new IntervalSubject**(`autoStart`, `delay`, `initialValue`, `incrementBy`): `IntervalSubject`

Defined in: [packages/rx/src/IntervalSubject.ts:37](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L37)

#### Parameters

##### autoStart

`boolean`

##### delay

`number` = `1000`

##### initialValue

`number` = `0`

##### incrementBy

`number` = `1`

#### Returns

`IntervalSubject`

#### Overrides

`BehaviorSubject<number>.constructor`

## Properties

### autoStart

> **autoStart**: `boolean`

Defined in: [packages/rx/src/IntervalSubject.ts:38](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L38)

***

### closed

> **closed**: `boolean`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:12

#### Inherited from

`BehaviorSubject.closed`

***

### delay

> **delay**: `number` = `1000`

Defined in: [packages/rx/src/IntervalSubject.ts:39](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L39)

***

### ~~hasError~~

> **hasError**: `boolean`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:19

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.hasError`

***

### incrementBy

> **incrementBy**: `number` = `1`

Defined in: [packages/rx/src/IntervalSubject.ts:41](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L41)

***

### initialValue

> `readonly` **initialValue**: `number` = `0`

Defined in: [packages/rx/src/IntervalSubject.ts:40](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L40)

***

### ~~isStopped~~

> **isStopped**: `boolean`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:17

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.isStopped`

***

### ~~observers~~

> **observers**: `Observer`\<`number`\>[]

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:15

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.observers`

***

### ~~operator~~

> **operator**: `undefined` \| `Operator`\<`any`, `number`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:17

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.operator`

***

### running

> `readonly` **running**: `boolean` = `false`

Defined in: [packages/rx/src/IntervalSubject.ts:35](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L35)

***

### ~~source~~

> **source**: `undefined` \| `Observable`\<`any`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:13

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.source`

***

### ~~thrownError~~

> **thrownError**: `any`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:21

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.thrownError`

***

### ~~create()~~

> `static` **create**: (...`args`) => `any`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:27

Creates a "subject" by basically gluing an observer to an observable.

#### Parameters

##### args

...`any`[]

#### Returns

`any`

#### Deprecated

Recommended you do not use. Will be removed at some point in the future. Plans for replacement still under discussion.

#### Inherited from

`BehaviorSubject.create`

## Accessors

### observed

#### Get Signature

> **get** **observed**(): `boolean`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:35

##### Returns

`boolean`

#### Inherited from

`BehaviorSubject.observed`

***

### value

#### Get Signature

> **get** **value**(): `T`

Defined in: node\_modules/rxjs/dist/types/internal/BehaviorSubject.d.ts:9

##### Returns

`T`

#### Inherited from

`BehaviorSubject.value`

## Methods

### asObservable()

> **asObservable**(): `Observable`\<`number`\>

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:42

Creates a new Observable with this Subject as the source. You can do this
to create custom Observer-side logic of the Subject and conceal it from
code that uses the Observable.

#### Returns

`Observable`\<`number`\>

Observable that this Subject casts to.

#### Inherited from

`BehaviorSubject.asObservable`

***

### complete()

> **complete**(): `void`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:33

#### Returns

`void`

#### Inherited from

`BehaviorSubject.complete`

***

### error()

> **error**(`err`): `void`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:32

#### Parameters

##### err

`any`

#### Returns

`void`

#### Inherited from

`BehaviorSubject.error`

***

### forEach()

#### Call Signature

> **forEach**(`next`): `Promise`\<`void`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:90

Used as a NON-CANCELLABLE means of subscribing to an observable, for use with
APIs that expect promises, like `async/await`. You cannot unsubscribe from this.

**WARNING**: Only use this with observables you *know* will complete. If the source
observable does not complete, you will end up with a promise that is hung up, and
potentially all of the state of an async function hanging out in memory. To avoid
this situation, look into adding something like timeout, take,
takeWhile, or takeUntil amongst others.

#### Example

```ts
import { interval, take } from 'rxjs';

const source$ = interval(1000).pipe(take(4));

async function getTotal() {
  let total = 0;

  await source$.forEach(value => {
    total += value;
    console.log('observable -> ' + value);
  });

  return total;
}

getTotal().then(
  total => console.log('Total: ' + total)
);

// Expected:
// 'observable -> 0'
// 'observable -> 1'
// 'observable -> 2'
// 'observable -> 3'
// 'Total: 6'
```

##### Parameters

###### next

(`value`) => `void`

A handler for each value emitted by the observable.

##### Returns

`Promise`\<`void`\>

A promise that either resolves on observable completion or
rejects with the handled error.

##### Inherited from

`BehaviorSubject.forEach`

#### Call Signature

> **forEach**(`next`, `promiseCtor`): `Promise`\<`void`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:102

##### Parameters

###### next

(`value`) => `void`

a handler for each value emitted by the observable

###### promiseCtor

`PromiseConstructorLike`

a constructor function used to instantiate the Promise

##### Returns

`Promise`\<`void`\>

a promise that either resolves on observable completion or
 rejects with the handled error

##### Deprecated

Passing a Promise constructor will no longer be available
in upcoming versions of RxJS. This is because it adds weight to the library, for very
little benefit. If you need this functionality, it is recommended that you either
polyfill Promise, or you create an adapter to convert the returned native promise
to whatever promise implementation you wanted. Will be removed in v8.

##### Inherited from

`BehaviorSubject.forEach`

***

### getValue()

> **getValue**(): `number`

Defined in: node\_modules/rxjs/dist/types/internal/BehaviorSubject.d.ts:10

#### Returns

`number`

#### Inherited from

`BehaviorSubject.getValue`

***

### ~~lift()~~

> **lift**\<`R`\>(`operator`): `Observable`\<`R`\>

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:30

#### Type Parameters

##### R

`R`

#### Parameters

##### operator

`Operator`\<`number`, `R`\>

#### Returns

`Observable`\<`R`\>

#### Deprecated

Internal implementation detail, do not use directly. Will be made internal in v8.

#### Inherited from

`BehaviorSubject.lift`

***

### next()

> **next**(`value`): `void`

Defined in: node\_modules/rxjs/dist/types/internal/BehaviorSubject.d.ts:11

#### Parameters

##### value

`number`

#### Returns

`void`

#### Inherited from

`BehaviorSubject.next`

***

### pause()

> **pause**(): `IntervalSubject`

Defined in: [packages/rx/src/IntervalSubject.ts:47](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L47)

#### Returns

`IntervalSubject`

***

### pipe()

#### Call Signature

> **pipe**(): `Observable`\<`number`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:103

##### Returns

`Observable`\<`number`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`\>(`op1`): `Observable`\<`A`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:104

##### Type Parameters

###### A

`A`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

##### Returns

`Observable`\<`A`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`\>(`op1`, `op2`): `Observable`\<`B`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:105

##### Type Parameters

###### A

`A`

###### B

`B`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

##### Returns

`Observable`\<`B`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`\>(`op1`, `op2`, `op3`): `Observable`\<`C`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:106

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

##### Returns

`Observable`\<`C`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`\>(`op1`, `op2`, `op3`, `op4`): `Observable`\<`D`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:107

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

##### Returns

`Observable`\<`D`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`, `E`\>(`op1`, `op2`, `op3`, `op4`, `op5`): `Observable`\<`E`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:108

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

###### E

`E`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

###### op5

`OperatorFunction`\<`D`, `E`\>

##### Returns

`Observable`\<`E`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`\>(`op1`, `op2`, `op3`, `op4`, `op5`, `op6`): `Observable`\<`F`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:109

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

###### E

`E`

###### F

`F`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

###### op5

`OperatorFunction`\<`D`, `E`\>

###### op6

`OperatorFunction`\<`E`, `F`\>

##### Returns

`Observable`\<`F`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`\>(`op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`): `Observable`\<`G`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:110

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

###### E

`E`

###### F

`F`

###### G

`G`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

###### op5

`OperatorFunction`\<`D`, `E`\>

###### op6

`OperatorFunction`\<`E`, `F`\>

###### op7

`OperatorFunction`\<`F`, `G`\>

##### Returns

`Observable`\<`G`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`\>(`op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`, `op8`): `Observable`\<`H`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:111

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

###### E

`E`

###### F

`F`

###### G

`G`

###### H

`H`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

###### op5

`OperatorFunction`\<`D`, `E`\>

###### op6

`OperatorFunction`\<`E`, `F`\>

###### op7

`OperatorFunction`\<`F`, `G`\>

###### op8

`OperatorFunction`\<`G`, `H`\>

##### Returns

`Observable`\<`H`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`\>(`op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`, `op8`, `op9`): `Observable`\<`I`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:112

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

###### E

`E`

###### F

`F`

###### G

`G`

###### H

`H`

###### I

`I`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

###### op5

`OperatorFunction`\<`D`, `E`\>

###### op6

`OperatorFunction`\<`E`, `F`\>

###### op7

`OperatorFunction`\<`F`, `G`\>

###### op8

`OperatorFunction`\<`G`, `H`\>

###### op9

`OperatorFunction`\<`H`, `I`\>

##### Returns

`Observable`\<`I`\>

##### Inherited from

`BehaviorSubject.pipe`

#### Call Signature

> **pipe**\<`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`\>(`op1`, `op2`, `op3`, `op4`, `op5`, `op6`, `op7`, `op8`, `op9`, ...`operations`): `Observable`\<`unknown`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:113

##### Type Parameters

###### A

`A`

###### B

`B`

###### C

`C`

###### D

`D`

###### E

`E`

###### F

`F`

###### G

`G`

###### H

`H`

###### I

`I`

##### Parameters

###### op1

`OperatorFunction`\<`number`, `A`\>

###### op2

`OperatorFunction`\<`A`, `B`\>

###### op3

`OperatorFunction`\<`B`, `C`\>

###### op4

`OperatorFunction`\<`C`, `D`\>

###### op5

`OperatorFunction`\<`D`, `E`\>

###### op6

`OperatorFunction`\<`E`, `F`\>

###### op7

`OperatorFunction`\<`F`, `G`\>

###### op8

`OperatorFunction`\<`G`, `H`\>

###### op9

`OperatorFunction`\<`H`, `I`\>

###### operations

...`OperatorFunction`\<`any`, `any`\>[]

##### Returns

`Observable`\<`unknown`\>

##### Inherited from

`BehaviorSubject.pipe`

***

### resume()

> **resume**(): `IntervalSubject`

Defined in: [packages/rx/src/IntervalSubject.ts:54](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L54)

#### Returns

`IntervalSubject`

***

### start()

> **start**(): `IntervalSubject`

Defined in: [packages/rx/src/IntervalSubject.ts:56](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L56)

#### Returns

`IntervalSubject`

***

### stop()

> **stop**(): `IntervalSubject`

Defined in: [packages/rx/src/IntervalSubject.ts:69](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/IntervalSubject.ts#L69)

#### Returns

`IntervalSubject`

***

### subscribe()

#### Call Signature

> **subscribe**(`observerOrNext?`): `Subscription`

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:43

##### Parameters

###### observerOrNext?

`Partial`\<`Observer`\<`number`\>\> | (`value`) => `void`

##### Returns

`Subscription`

##### Inherited from

`BehaviorSubject.subscribe`

#### Call Signature

> **subscribe**(`next?`, `error?`, `complete?`): `Subscription`

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:45

##### Parameters

###### next?

`null` | (`value`) => `void`

###### error?

`null` | (`error`) => `void`

###### complete?

`null` | () => `void`

##### Returns

`Subscription`

##### Deprecated

Instead of passing separate callback arguments, use an observer argument. Signatures taking separate callback arguments will be removed in v8. Details: https://rxjs.dev/deprecations/subscribe-arguments

##### Inherited from

`BehaviorSubject.subscribe`

***

### ~~toPromise()~~

#### Call Signature

> **toPromise**(): `Promise`\<`undefined` \| `number`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:115

##### Returns

`Promise`\<`undefined` \| `number`\>

##### Deprecated

Replaced with firstValueFrom and lastValueFrom. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise

##### Inherited from

`BehaviorSubject.toPromise`

#### Call Signature

> **toPromise**(`PromiseCtor`): `Promise`\<`undefined` \| `number`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:117

##### Parameters

###### PromiseCtor

`PromiseConstructor`

##### Returns

`Promise`\<`undefined` \| `number`\>

##### Deprecated

Replaced with firstValueFrom and lastValueFrom. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise

##### Inherited from

`BehaviorSubject.toPromise`

#### Call Signature

> **toPromise**(`PromiseCtor`): `Promise`\<`undefined` \| `number`\>

Defined in: node\_modules/rxjs/dist/types/internal/Observable.d.ts:119

##### Parameters

###### PromiseCtor

`PromiseConstructorLike`

##### Returns

`Promise`\<`undefined` \| `number`\>

##### Deprecated

Replaced with firstValueFrom and lastValueFrom. Will be removed in v8. Details: https://rxjs.dev/deprecations/to-promise

##### Inherited from

`BehaviorSubject.toPromise`

***

### unsubscribe()

> **unsubscribe**(): `void`

Defined in: node\_modules/rxjs/dist/types/internal/Subject.d.ts:34

#### Returns

`void`

#### Inherited from

`BehaviorSubject.unsubscribe`
