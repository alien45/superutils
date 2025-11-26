# @superutils/core

Core utilities and types used by other `@superutils` packages.

## Installation

```bash
npm install @superutils/core
```

## Usage

### `deferred(fn)`

```typescript

import { deferred } from '@superutils/core'

const handleChange = deferred(
    event => console.log(event.target.value),
    300 // debounce delay in milliseconds
)
handleChange({ target: { value 1 } }) // will be ignored
handleChange({ target: { value 2 } }) // will be ignored
handleChange({ target: { value 3 } }) // will be executed
```

## Classes

- [ReadOnlyArrayHelper](classes/ReadOnlyArrayHelper.md)

## Interfaces

- [DeferredConfig](interfaces/DeferredConfig.md)

## Type Aliases

- [ArrayComparator](type-aliases/ArrayComparator.md)
- [AsyncFn](type-aliases/AsyncFn.md)
- [CreateTuple](type-aliases/CreateTuple.md)
- [Curry](type-aliases/Curry.md)
- [DropFirst](type-aliases/DropFirst.md)
- [DropFirstN](type-aliases/DropFirstN.md)
- [DropLast](type-aliases/DropLast.md)
- [EntryComparator](type-aliases/EntryComparator.md)
- [FindOptions](type-aliases/FindOptions.md)
- [IfPromiseAddValue](type-aliases/IfPromiseAddValue.md)
- [IsFiniteTuple](type-aliases/IsFiniteTuple.md)
- [IsOptional](type-aliases/IsOptional.md)
- [IterableList](type-aliases/IterableList.md)
- [IterableType](type-aliases/IterableType.md)
- [KeepFirst](type-aliases/KeepFirst.md)
- [KeepFirstN](type-aliases/KeepFirstN.md)
- [KeepOptionals](type-aliases/KeepOptionals.md)
- [KeepRequired](type-aliases/KeepRequired.md)
- [MakeOptional](type-aliases/MakeOptional.md)
- [MinLength](type-aliases/MinLength.md)
- [OptionalIf](type-aliases/OptionalIf.md)
- [ReadOnlyAllowAddFn](type-aliases/ReadOnlyAllowAddFn.md)
- [ReadOnlyConfig](type-aliases/ReadOnlyConfig.md)
- [SearchOptions](type-aliases/SearchOptions.md)
- [Slice](type-aliases/Slice.md)
- [SortOptions](type-aliases/SortOptions.md)
- [ThrottleConfig](type-aliases/ThrottleConfig.md)
- [TimeoutId](type-aliases/TimeoutId.md)
- [TupleMaxLength](type-aliases/TupleMaxLength.md)
- [TupleWithAlt](type-aliases/TupleWithAlt.md)
- [ValueOrFunc](type-aliases/ValueOrFunc.md)
- [ValueOrPromise](type-aliases/ValueOrPromise.md)

## Variables

- [EMAIL\_REGEX](variables/EMAIL_REGEX.md)
- [HASH\_REGEX](variables/HASH_REGEX.md)
- [HEX\_REGEX](variables/HEX_REGEX.md)
- [is](variables/is.md)

## Functions

- [arrReadOnly](functions/arrReadOnly.md)
- [arrReverse](functions/arrReverse.md)
- [arrSort](functions/arrSort.md)
- [arrToMap](functions/arrToMap.md)
- [arrUnique](functions/arrUnique.md)
- [asAny](functions/asAny.md)
- [clearClutter](functions/clearClutter.md)
- [copyToClipboard](functions/copyToClipboard.md)
- [curry](functions/curry.md)
- [debounce](functions/debounce.md)
- [deferred](functions/deferred.md)
- [fallbackIfFails](functions/fallbackIfFails.md)
- [forceCast](functions/forceCast.md)
- [getSize](functions/getSize.md)
- [getUrlParam](functions/getUrlParam.md)
- [isArr](functions/isArr.md)
- [isArr2D](functions/isArr2D.md)
- [isArrLike](functions/isArrLike.md)
- [isArrLikeSafe](functions/isArrLikeSafe.md)
- [isArrObj](functions/isArrObj.md)
- [isArrUnique](functions/isArrUnique.md)
- [isAsyncFn](functions/isAsyncFn.md)
- [isBool](functions/isBool.md)
- [isDate](functions/isDate.md)
- [isDateValid](functions/isDateValid.md)
- [isDefined](functions/isDefined.md)
- [isEmpty](functions/isEmpty.md)
- [isEmptySafe](functions/isEmptySafe.md)
- [isEnvBrowser](functions/isEnvBrowser.md)
- [isEnvNode](functions/isEnvNode.md)
- [isEnvTouchable](functions/isEnvTouchable.md)
- [isError](functions/isError.md)
- [isFn](functions/isFn.md)
- [isInteger](functions/isInteger.md)
- [isMap](functions/isMap.md)
- [isMapObj](functions/isMapObj.md)
- [isNumber](functions/isNumber.md)
- [isObj](functions/isObj.md)
- [isPositiveInteger](functions/isPositiveInteger.md)
- [isPositiveNumber](functions/isPositiveNumber.md)
- [isPromise](functions/isPromise.md)
- [isRegExp](functions/isRegExp.md)
- [isSet](functions/isSet.md)
- [isStr](functions/isStr.md)
- [isSubjectLike](functions/isSubjectLike.md)
- [isSymbol](functions/isSymbol.md)
- [isUint8Arr](functions/isUint8Arr.md)
- [isUrl](functions/isUrl.md)
- [isUrlValid](functions/isUrlValid.md)
- [mapEntries](functions/mapEntries.md)
- [mapFilter](functions/mapFilter.md)
- [mapFind](functions/mapFind.md)
- [mapJoin](functions/mapJoin.md)
- [mapKeys](functions/mapKeys.md)
- [mapSearch](functions/mapSearch.md)
- [mapValues](functions/mapValues.md)
- [matchItemCb](functions/matchItemCb.md)
- [noop](functions/noop.md)
- [noopAsync](functions/noopAsync.md)
- [objClean](functions/objClean.md)
- [objCopy](functions/objCopy.md)
- [objCreate](functions/objCreate.md)
- [objKeys](functions/objKeys.md)
- [objReadOnly](functions/objReadOnly.md)
- [objSetProp](functions/objSetProp.md)
- [objSetPropUndefined](functions/objSetPropUndefined.md)
- [objSort](functions/objSort.md)
- [objWithoutKeys](functions/objWithoutKeys.md)
- [randomInt](functions/randomInt.md)
- [sliceMap](functions/sliceMap.md)
- [sort](functions/sort.md)
- [throttled](functions/throttled.md)
- [toDatetimeLocal](functions/toDatetimeLocal.md)
