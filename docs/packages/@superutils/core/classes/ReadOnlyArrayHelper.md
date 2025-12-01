# Class: ReadOnlyArrayHelper\<T\>

Defined in: [packages/core/src/arr/arrReadOnly.ts:27](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L27)

Helper class for creating read-only arrays.

Caution: This class can by itself only make the array partially read-only.
Use [()](../functions/arrReadOnly.md) instead.

## Extends

- `Array`\<`T`\>

## Type Parameters

### T

`T`

## Indexable

\[`n`: `number`\]: `T`

## Constructors

### Constructor

> **new ReadOnlyArrayHelper**\<`T`\>(`config`, `arr`): `ReadOnlyArrayHelper`\<`T`\>

Defined in: [packages/core/src/arr/arrReadOnly.ts:28](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L28)

#### Parameters

##### config

`Omit`\<[`ReadOnlyConfig`](../type-aliases/ReadOnlyConfig.md)\<`T`[]\>, `"revoke"`\>

##### arr

`T`[]

#### Returns

`ReadOnlyArrayHelper`\<`T`\>

#### Overrides

`Array<T>.constructor`

## Properties

### \[unscopables\]

> `readonly` **\[unscopables\]**: `object`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:97

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### Index Signature

\[`key`: `number`\]: `undefined` \| `boolean`

#### \[iterator\]?

> `optional` **\[iterator\]**: `boolean`

#### \[unscopables\]?

> `readonly` `optional` **\[unscopables\]**: `boolean`

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### at?

> `optional` **at**: `boolean`

#### concat?

> `optional` **concat**: `boolean`

#### copyWithin?

> `optional` **copyWithin**: `boolean`

#### entries?

> `optional` **entries**: `boolean`

#### every?

> `optional` **every**: `boolean`

#### fill?

> `optional` **fill**: `boolean`

#### filter?

> `optional` **filter**: `boolean`

#### find?

> `optional` **find**: `boolean`

#### findIndex?

> `optional` **findIndex**: `boolean`

#### findLast?

> `optional` **findLast**: `boolean`

#### findLastIndex?

> `optional` **findLastIndex**: `boolean`

#### flat?

> `optional` **flat**: `boolean`

#### flatMap?

> `optional` **flatMap**: `boolean`

#### forEach?

> `optional` **forEach**: `boolean`

#### includes?

> `optional` **includes**: `boolean`

#### indexOf?

> `optional` **indexOf**: `boolean`

#### join?

> `optional` **join**: `boolean`

#### keys?

> `optional` **keys**: `boolean`

#### lastIndexOf?

> `optional` **lastIndexOf**: `boolean`

#### length?

> `optional` **length**: `boolean`

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### map?

> `optional` **map**: `boolean`

#### pop?

> `optional` **pop**: `boolean`

#### push?

> `optional` **push**: `boolean`

#### reduce?

> `optional` **reduce**: `boolean`

#### reduceRight?

> `optional` **reduceRight**: `boolean`

#### reverse?

> `optional` **reverse**: `boolean`

#### shift?

> `optional` **shift**: `boolean`

#### slice?

> `optional` **slice**: `boolean`

#### some?

> `optional` **some**: `boolean`

#### sort?

> `optional` **sort**: `boolean`

#### splice?

> `optional` **splice**: `boolean`

#### toLocaleString?

> `optional` **toLocaleString**: `boolean`

#### toReversed?

> `optional` **toReversed**: `boolean`

#### toSorted?

> `optional` **toSorted**: `boolean`

#### toSpliced?

> `optional` **toSpliced**: `boolean`

#### toString?

> `optional` **toString**: `boolean`

#### unshift?

> `optional` **unshift**: `boolean`

#### values?

> `optional` **values**: `boolean`

#### with?

> `optional` **with**: `boolean`

#### Inherited from

`Array.[unscopables]`

***

### config

> `readonly` **config**: `Omit`\<[`ReadOnlyConfig`](../type-aliases/ReadOnlyConfig.md)\<`T`[]\>, `"revoke"`\>

Defined in: [packages/core/src/arr/arrReadOnly.ts:29](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L29)

***

### length

> **length**: `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1329

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### Inherited from

`Array.length`

***

### reduce()

> **reduce**: \{(`callbackfn`): `T`; (`callbackfn`, `initialValue`): `T`; \<`U`\>(`callbackfn`, `initialValue`): `U`; \}

Defined in: [packages/core/src/arr/arrReadOnly.ts:59](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L59)

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Call Signature

> (`callbackfn`): `T`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `T`

##### Returns

`T`

#### Call Signature

> (`callbackfn`, `initialValue`): `T`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `T`

###### initialValue

`T`

##### Returns

`T`

#### Call Signature

> \<`U`\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `U`

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

###### initialValue

`U`

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

##### Returns

`U`

#### Param

A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

#### Param

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

#### Overrides

`Array.reduce`

***

### reduceRight()

> **reduceRight**: \{(`callbackfn`): `T`; (`callbackfn`, `initialValue`): `T`; \<`U`\>(`callbackfn`, `initialValue`): `U`; \}

Defined in: [packages/core/src/arr/arrReadOnly.ts:61](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L61)

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Call Signature

> (`callbackfn`): `T`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `T`

##### Returns

`T`

#### Call Signature

> (`callbackfn`, `initialValue`): `T`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `T`

###### initialValue

`T`

##### Returns

`T`

#### Call Signature

> \<`U`\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

###### U

`U`

##### Parameters

###### callbackfn

(`previousValue`, `currentValue`, `currentIndex`, `array`) => `U`

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

###### initialValue

`U`

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

##### Returns

`U`

#### Param

A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.

#### Param

If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.

#### Overrides

`Array.reduceRight`

***

### \[species\]

> `readonly` `static` **\[species\]**: `ArrayConstructor`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:316

#### Inherited from

`Array.[species]`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `ArrayIterator`\<`T`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:78

Iterator

#### Returns

`ArrayIterator`\<`T`\>

#### Inherited from

`Array.[iterator]`

***

### at()

> **at**(`index`): `undefined` \| `T`

Defined in: node\_modules/typescript/lib/lib.es2022.array.d.ts:24

Returns the item located at the specified index.

#### Parameters

##### index

`number`

The zero-based index of the desired code unit. A negative index will count back from the last item.

#### Returns

`undefined` \| `T`

#### Inherited from

`Array.at`

***

### concat()

#### Call Signature

> **concat**(...`items`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1353

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

##### Parameters

###### items

...`ConcatArray`\<`T`\>[]

Additional arrays and/or items to add to the end of the array.

##### Returns

`T`[]

##### Inherited from

`Array.concat`

#### Call Signature

> **concat**(...`items`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1359

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

##### Parameters

###### items

...(`T` \| `ConcatArray`\<`T`\>)[]

Additional arrays and/or items to add to the end of the array.

##### Returns

`T`[]

##### Inherited from

`Array.concat`

***

### copyWithin()

> **copyWithin**(`target`, `start`, `end?`): `this`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:62

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

#### Parameters

##### target

`number`

If target is negative, it is treated as length+target where length is the
length of the array.

##### start

`number`

If start is negative, it is treated as length+start. If end is negative, it
is treated as length+end.

##### end?

`number`

If not specified, length of the this object is used as its default value.

#### Returns

`this`

#### Inherited from

`Array.copyWithin`

***

### entries()

> **entries**(): `ArrayIterator`\<\[`number`, `T`\]\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:83

Returns an iterable of key, value pairs for every entry in the array

#### Returns

`ArrayIterator`\<\[`number`, `T`\]\>

#### Inherited from

`Array.entries`

***

### every()

#### Call Signature

> **every**\<`S`\>(`predicate`, `thisArg?`): `this is S[]`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1440

Determines whether all the members of an array satisfy the specified test.

##### Type Parameters

###### S

`S`

##### Parameters

###### predicate

(`value`, `index`, `array`) => `value is S`

A function that accepts up to three arguments. The every method calls
the predicate function for each element in the array until the predicate returns a value
which is coercible to the Boolean value false, or until the end of the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function.
If thisArg is omitted, undefined is used as the this value.

##### Returns

`this is S[]`

##### Inherited from

`Array.every`

#### Call Signature

> **every**(`predicate`, `thisArg?`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1449

Determines whether all the members of an array satisfy the specified test.

##### Parameters

###### predicate

(`value`, `index`, `array`) => `unknown`

A function that accepts up to three arguments. The every method calls
the predicate function for each element in the array until the predicate returns a value
which is coercible to the Boolean value false, or until the end of the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function.
If thisArg is omitted, undefined is used as the this value.

##### Returns

`boolean`

##### Inherited from

`Array.every`

***

### fill()

> **fill**(`value`, `start?`, `end?`): `this`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:51

Changes all array elements from `start` to `end` index to a static `value` and returns the modified array

#### Parameters

##### value

`T`

value to fill array section with

##### start?

`number`

index to start filling the array at. If start is negative, it is treated as
length+start where length is the length of the array.

##### end?

`number`

index to stop filling the array at. If end is negative, it is treated as
length+end.

#### Returns

`this`

#### Inherited from

`Array.fill`

***

### filter()

#### Call Signature

> **filter**\<`S`\>(`predicate`, `thisArg?`): `S`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1476

Returns the elements of an array that meet the condition specified in a callback function.

##### Type Parameters

###### S

`S`

##### Parameters

###### predicate

(`value`, `index`, `array`) => `value is S`

A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.

##### Returns

`S`[]

##### Inherited from

`Array.filter`

#### Call Signature

> **filter**(`predicate`, `thisArg?`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1482

Returns the elements of an array that meet the condition specified in a callback function.

##### Parameters

###### predicate

(`value`, `index`, `array`) => `unknown`

A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.

###### thisArg?

`any`

An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.

##### Returns

`T`[]

##### Inherited from

`Array.filter`

***

### find()

#### Call Signature

> **find**\<`S`\>(`predicate`, `thisArg?`): `undefined` \| `S`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:29

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

###### S

`S`

##### Parameters

###### predicate

(`value`, `index`, `obj`) => `value is S`

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found, find
immediately returns that element value. Otherwise, find returns undefined.

###### thisArg?

`any`

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

##### Returns

`undefined` \| `S`

##### Inherited from

`Array.find`

#### Call Signature

> **find**(`predicate`, `thisArg?`): `undefined` \| `T`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:30

##### Parameters

###### predicate

(`value`, `index`, `obj`) => `unknown`

###### thisArg?

`any`

##### Returns

`undefined` \| `T`

##### Inherited from

`Array.find`

***

### findIndex()

> **findIndex**(`predicate`, `thisArg?`): `number`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:41

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

##### predicate

(`value`, `index`, `obj`) => `unknown`

find calls predicate once for each element of the array, in ascending
order, until it finds one where predicate returns true. If such an element is found,
findIndex immediately returns that element index. Otherwise, findIndex returns -1.

##### thisArg?

`any`

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

#### Returns

`number`

#### Inherited from

`Array.findIndex`

***

### findLast()

#### Call Signature

> **findLast**\<`S`\>(`predicate`, `thisArg?`): `undefined` \| `S`

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:29

Returns the value of the last element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

###### S

`S`

##### Parameters

###### predicate

(`value`, `index`, `array`) => `value is S`

findLast calls predicate once for each element of the array, in descending
order, until it finds one where predicate returns true. If such an element is found, findLast
immediately returns that element value. Otherwise, findLast returns undefined.

###### thisArg?

`any`

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

##### Returns

`undefined` \| `S`

##### Inherited from

`Array.findLast`

#### Call Signature

> **findLast**(`predicate`, `thisArg?`): `undefined` \| `T`

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:30

##### Parameters

###### predicate

(`value`, `index`, `array`) => `unknown`

###### thisArg?

`any`

##### Returns

`undefined` \| `T`

##### Inherited from

`Array.findLast`

***

### findLastIndex()

> **findLastIndex**(`predicate`, `thisArg?`): `number`

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:41

Returns the index of the last element in the array where predicate is true, and -1
otherwise.

#### Parameters

##### predicate

(`value`, `index`, `array`) => `unknown`

findLastIndex calls predicate once for each element of the array, in descending
order, until it finds one where predicate returns true. If such an element is found,
findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.

##### thisArg?

`any`

If provided, it will be used as the this value for each invocation of
predicate. If it is not provided, undefined is used instead.

#### Returns

`number`

#### Inherited from

`Array.findLastIndex`

***

### flat()

> **flat**\<`A`, `D`\>(`this`, `depth?`): `FlatArray`\<`A`, `D`\>[]

Defined in: node\_modules/typescript/lib/lib.es2019.array.d.ts:75

Returns a new array with all sub-array elements concatenated into it recursively up to the
specified depth.

#### Type Parameters

##### A

`A`

##### D

`D` *extends* `number` = `1`

#### Parameters

##### this

`A`

##### depth?

`D`

The maximum recursion depth

#### Returns

`FlatArray`\<`A`, `D`\>[]

#### Inherited from

`Array.flat`

***

### flatMap()

> **flatMap**\<`U`, `This`\>(`callback`, `thisArg?`): `U`[]

Defined in: node\_modules/typescript/lib/lib.es2019.array.d.ts:64

Calls a defined callback function on each element of an array. Then, flattens the result into
a new array.
This is identical to a map followed by flat with depth 1.

#### Type Parameters

##### U

`U`

##### This

`This` = `undefined`

#### Parameters

##### callback

(`this`, `value`, `index`, `array`) => `U` \| readonly `U`[]

A function that accepts up to three arguments. The flatMap method calls the
callback function one time for each element in the array.

##### thisArg?

`This`

An object to which the this keyword can refer in the callback function. If
thisArg is omitted, undefined is used as the this value.

#### Returns

`U`[]

#### Inherited from

`Array.flatMap`

***

### forEach()

> **forEach**(`callbackfn`, `thisArg?`): `void`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1464

Performs the specified action for each element in an array.

#### Parameters

##### callbackfn

(`value`, `index`, `array`) => `void`

A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.

##### thisArg?

`any`

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

#### Returns

`void`

#### Inherited from

`Array.forEach`

***

### includes()

> **includes**(`searchElement`, `fromIndex?`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es2016.array.include.d.ts:25

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

##### searchElement

`T`

The element to search for.

##### fromIndex?

`number`

The position in this array at which to begin searching for searchElement.

#### Returns

`boolean`

#### Inherited from

`Array.includes`

***

### indexOf()

> **indexOf**(`searchElement`, `fromIndex?`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1425

Returns the index of the first occurrence of a value in an array, or -1 if it is not present.

#### Parameters

##### searchElement

`T`

The value to locate in the array.

##### fromIndex?

`number`

The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.

#### Returns

`number`

#### Inherited from

`Array.indexOf`

***

### join()

> **join**(`separator?`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1364

Adds all the elements of an array into a string, separated by the specified separator string.

#### Parameters

##### separator?

`string`

A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma.

#### Returns

`string`

#### Inherited from

`Array.join`

***

### keys()

> **keys**(): `ArrayIterator`\<`number`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:88

Returns an iterable of keys in the array

#### Returns

`ArrayIterator`\<`number`\>

#### Inherited from

`Array.keys`

***

### lastIndexOf()

> **lastIndexOf**(`searchElement`, `fromIndex?`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1431

Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.

#### Parameters

##### searchElement

`T`

The value to locate in the array.

##### fromIndex?

`number`

The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.

#### Returns

`number`

#### Inherited from

`Array.lastIndexOf`

***

### map()

> **map**\<`U`\>(`callbackfn`, `thisArg?`): `U`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1470

Calls a defined callback function on each element of an array, and returns an array that contains the results.

#### Type Parameters

##### U

`U`

#### Parameters

##### callbackfn

(`value`, `index`, `array`) => `U`

A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

##### thisArg?

`any`

An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.

#### Returns

`U`[]

#### Inherited from

`Array.map`

***

### pop()

> **pop**(): `T`

Defined in: [packages/core/src/arr/arrReadOnly.ts:42](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L42)

#### Returns

`T`

#### Overrides

`Array.pop`

***

### push()

> **push**(...`items`): `number`

Defined in: [packages/core/src/arr/arrReadOnly.ts:44](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L44)

#### Parameters

##### items

...`T`[]

#### Returns

`number`

#### Overrides

`Array.push`

***

### reverse()

> **reverse**(): `ReadOnlyArrayHelper`\<`T`\>

Defined in: [packages/core/src/arr/arrReadOnly.ts:49](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L49)

#### Returns

`ReadOnlyArrayHelper`\<`T`\>

#### Overrides

`Array.reverse`

***

### shift()

> **shift**(): `T`

Defined in: [packages/core/src/arr/arrReadOnly.ts:51](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L51)

#### Returns

`T`

#### Overrides

`Array.shift`

***

### slice()

> **slice**(`start?`, `end?`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1384

Returns a copy of a section of an array.
For both start and end, a negative index can be used to indicate an offset from the end of the array.
For example, -2 refers to the second to last element of the array.

#### Parameters

##### start?

`number`

The beginning index of the specified portion of the array.
If start is undefined, then the slice begins at index 0.

##### end?

`number`

The end index of the specified portion of the array. This is exclusive of the element at the index 'end'.
If end is undefined, then the slice extends to the end of the array.

#### Returns

`T`[]

#### Inherited from

`Array.slice`

***

### some()

> **some**(`predicate`, `thisArg?`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1458

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

##### predicate

(`value`, `index`, `array`) => `unknown`

A function that accepts up to three arguments. The some method calls
the predicate function for each element in the array until the predicate returns a value
which is coercible to the Boolean value true, or until the end of the array.

##### thisArg?

`any`

An object to which the this keyword can refer in the predicate function.
If thisArg is omitted, undefined is used as the this value.

#### Returns

`boolean`

#### Inherited from

`Array.some`

***

### sort()

> **sort**(`compareFn?`): `this`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1395

Sorts an array in place.
This method mutates the array and returns a reference to the same array.

#### Parameters

##### compareFn?

(`a`, `b`) => `number`

Function used to determine the order of the elements. It is expected to return
a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
```ts
[11,2,22,1].sort((a, b) => a - b)
```

#### Returns

`this`

#### Inherited from

`Array.sort`

***

### splice()

> **splice**(...`_ignoredArgs`): `never`[]

Defined in: [packages/core/src/arr/arrReadOnly.ts:53](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L53)

#### Parameters

##### \_ignoredArgs

...`unknown`[]

#### Returns

`never`[]

#### Overrides

`Array.splice`

***

### toLocaleString()

#### Call Signature

> **toLocaleString**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1337

Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.

##### Returns

`string`

##### Inherited from

`Array.toLocaleString`

#### Call Signature

> **toLocaleString**(`locales`, `options?`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:64

##### Parameters

###### locales

`string` | `string`[]

###### options?

`NumberFormatOptions` & `DateTimeFormatOptions`

##### Returns

`string`

##### Inherited from

`Array.toLocaleString`

***

### toReversed()

> **toReversed**(): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:46

Returns a copy of an array with its elements reversed.

#### Returns

`T`[]

#### Inherited from

`Array.toReversed`

***

### toSorted()

> **toSorted**(`compareFn?`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:57

Returns a copy of an array with its elements sorted.

#### Parameters

##### compareFn?

(`a`, `b`) => `number`

Function used to determine the order of the elements. It is expected to return
a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
```ts
[11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]
```

#### Returns

`T`[]

#### Inherited from

`Array.toSorted`

***

### toSpliced()

#### Call Signature

> **toSpliced**(`start`, `deleteCount`, ...`items`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:66

Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array.

##### Parameters

###### start

`number`

The zero-based location in the array from which to start removing elements.

###### deleteCount

`number`

The number of elements to remove.

###### items

...`T`[]

Elements to insert into the copied array in place of the deleted elements.

##### Returns

`T`[]

The copied array.

##### Inherited from

`Array.toSpliced`

#### Call Signature

> **toSpliced**(`start`, `deleteCount?`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:74

Copies an array and removes elements while returning the remaining elements.

##### Parameters

###### start

`number`

The zero-based location in the array from which to start removing elements.

###### deleteCount?

`number`

The number of elements to remove.

##### Returns

`T`[]

A copy of the original array with the remaining elements.

##### Inherited from

`Array.toSpliced`

***

### toString()

> **toString**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1333

Returns a string representation of an array.

#### Returns

`string`

#### Inherited from

`Array.toString`

***

### unshift()

> **unshift**(...`_ignoredArgs`): `number`

Defined in: [packages/core/src/arr/arrReadOnly.ts:55](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L55)

#### Parameters

##### \_ignoredArgs

...`T`[]

#### Returns

`number`

#### Overrides

`Array.unshift`

***

### values()

> **values**(): `ArrayIterator`\<`T`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:93

Returns an iterable of values in the array

#### Returns

`ArrayIterator`\<`T`\>

#### Inherited from

`Array.values`

***

### with()

> **with**(`index`, `value`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2023.array.d.ts:85

Copies an array, then overwrites the value at the provided index with the
given value. If the index is negative, then it replaces from the end
of the array.

#### Parameters

##### index

`number`

The index of the value to overwrite. If the index is
negative, then it replaces from the end of the array.

##### value

`T`

The value to write into the copied array.

#### Returns

`T`[]

The copied array with the updated value.

#### Inherited from

`Array.with`

***

### from()

#### Call Signature

> `static` **from**\<`T`\>(`arrayLike`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:72

Creates an array from an array-like object.

##### Type Parameters

###### T

`T`

##### Parameters

###### arrayLike

`ArrayLike`\<`T`\>

An array-like object to convert to an array.

##### Returns

`T`[]

##### Inherited from

`Array.from`

#### Call Signature

> `static` **from**\<`T`, `U`\>(`arrayLike`, `mapfn`, `thisArg?`): `U`[]

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:80

Creates an array from an iterable object.

##### Type Parameters

###### T

`T`

###### U

`U`

##### Parameters

###### arrayLike

`ArrayLike`\<`T`\>

An array-like object to convert to an array.

###### mapfn

(`v`, `k`) => `U`

A mapping function to call on every element of the array.

###### thisArg?

`any`

Value of 'this' used to invoke the mapfn.

##### Returns

`U`[]

##### Inherited from

`Array.from`

#### Call Signature

> `static` **from**\<`T`\>(`iterable`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:101

Creates an array from an iterable object.

##### Type Parameters

###### T

`T`

##### Parameters

###### iterable

An iterable object to convert to an array.

`Iterable`\<`T`, `any`, `any`\> | `ArrayLike`\<`T`\>

##### Returns

`T`[]

##### Inherited from

`Array.from`

#### Call Signature

> `static` **from**\<`T`, `U`\>(`iterable`, `mapfn`, `thisArg?`): `U`[]

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:109

Creates an array from an iterable object.

##### Type Parameters

###### T

`T`

###### U

`U`

##### Parameters

###### iterable

An iterable object to convert to an array.

`Iterable`\<`T`, `any`, `any`\> | `ArrayLike`\<`T`\>

###### mapfn

(`v`, `k`) => `U`

A mapping function to call on every element of the array.

###### thisArg?

`any`

Value of 'this' used to invoke the mapfn.

##### Returns

`U`[]

##### Inherited from

`Array.from`

***

### fromAsync()

#### Call Signature

> `static` **fromAsync**\<`T`\>(`iterableOrArrayLike`): `Promise`\<`T`[]\>

Defined in: node\_modules/typescript/lib/lib.esnext.array.d.ts:24

Creates an array from an async iterator or iterable object.

##### Type Parameters

###### T

`T`

##### Parameters

###### iterableOrArrayLike

An async iterator or array-like object to convert to an array.

`AsyncIterable`\<`T`, `any`, `any`\> | `Iterable`\<`T` \| `PromiseLike`\<`T`\>, `any`, `any`\> | `ArrayLike`\<`T` \| `PromiseLike`\<`T`\>\>

##### Returns

`Promise`\<`T`[]\>

##### Inherited from

`Array.fromAsync`

#### Call Signature

> `static` **fromAsync**\<`T`, `U`\>(`iterableOrArrayLike`, `mapFn`, `thisArg?`): `Promise`\<`Awaited`\<`U`\>[]\>

Defined in: node\_modules/typescript/lib/lib.esnext.array.d.ts:34

Creates an array from an async iterator or iterable object.

##### Type Parameters

###### T

`T`

###### U

`U`

##### Parameters

###### iterableOrArrayLike

An async iterator or array-like object to convert to an array.

`AsyncIterable`\<`T`, `any`, `any`\> | `Iterable`\<`T`, `any`, `any`\> | `ArrayLike`\<`T`\>

###### mapFn

(`value`, `index`) => `U`

###### thisArg?

`any`

Value of 'this' used when executing mapfn.

##### Returns

`Promise`\<`Awaited`\<`U`\>[]\>

##### Inherited from

`Array.fromAsync`

***

### isArray()

> `static` **isArray**(`arg`): `arg is any[]`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1520

#### Parameters

##### arg

`any`

#### Returns

`arg is any[]`

#### Inherited from

`Array.isArray`

***

### of()

> `static` **of**\<`T`\>(...`items`): `T`[]

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:86

Returns a new array from a set of elements.

#### Type Parameters

##### T

`T`

#### Parameters

##### items

...`T`[]

A set of elements to include in the new array object.

#### Returns

`T`[]

#### Inherited from

`Array.of`
