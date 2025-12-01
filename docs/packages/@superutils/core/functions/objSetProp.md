# Function: objSetProp()

> **objSetProp**\<`K`, `V`, `OutKey`\>(`obj`, `key`, `falsyValue?`, `condition?`, `truthyValue?`): `Record`\<`OutKey`, `V`\>

Defined in: [packages/core/src/obj/objSetProp.ts:12](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/obj/objSetProp.ts#L12)

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
