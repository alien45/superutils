# Function: objSetProp()

> **objSetProp**\<`K`, `V`, `OutKey`\>(`obj`, `key`, `falsyValue?`, `condition?`, `truthyValue?`): `Record`\<`OutKey`, `V`\>

Defined in: [packages/core/src/obj/objSetProp.ts:12](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/objSetProp.ts#L12)

Assign value to an object property

## Type Parameters

### K

`K` *extends* `PropertyKey`

### V

`V`

### OutKey

`OutKey` *extends* `PropertyKey`

## Parameters

### obj

`Record`\<`K`, `V`\>

### key

`OutKey`

### falsyValue?

`V`

(optional) Default: `obj[key]`

### condition?

(optional)

`boolean` | (`value`, `key`, `obj`) => `boolean`

### truthyValue?

`V`

(optional) value to use if condition is truthy

## Returns

`Record`\<`OutKey`, `V`\>
