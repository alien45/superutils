# Function: objCreate()

> **objCreate**\<`V`, `K`, `RV`, `RK`, `Result`\>(`keys`, `values`, `result?`): `Result`

Defined in: [packages/core/src/obj/objCreate.ts:29](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/objCreate.ts#L29)

Creates an object from an array of keys and a corresponding array of values.
It pairs each key with the value at the same index.

## Type Parameters

### V

`V`

### K

`K` *extends* `PropertyKey`

### RV

`RV`

### RK

`RK` *extends* `PropertyKey`

### Result

`Result` *extends* `Record`\<`K` \| `RK`, `V` \| `RV`\>

## Parameters

### keys

`K`[] = `[]`

An array of property keys (strings or symbols).

### values

`V`[] = `[]`

(optional) An array of property values. The value at each index corresponds to the key at the same index. If a value is missing for a key, it will be `undefined`.

### result?

`Result`

(optional) An existing object to add or overwrite properties on. If not provided, a new object is created.

## Returns

`Result`

The newly created object, or the `result` object merged with the new properties.

## Examples

```typescript
const keys = ['a', 'b', 'c'];
const values = [1, 2, 3];
const newObj = objCreate(keys, values);
// newObj is { a: 1, b: 2, c: 3 }
```

```typescript
const existingObj = { a: 0, d: 4 };
const keys = ['b', 'c'];
const values = [2, 3];
objCreate(keys, values, existingObj);
// existingObj is now { a: 0, d: 4, b: 2, c: 3 }
```
