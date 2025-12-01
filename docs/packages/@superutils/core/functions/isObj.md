# Function: isObj()

> **isObj**\<`T`\>(`x`, `strict`): `x is T`

Defined in: [packages/core/src/is/isObj.ts:44](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/is/isObj.ts#L44)

Check if value is an object.

## Type Parameters

### T

`T` = `Record`\<`PropertyKey`, `unknown`\>

## Parameters

### x

`unknown`

value to check

### strict

`boolean` = `true`

(optional) whether to exclude anything other than plain object. Eg: Array, Map, RegExp, Set etc.

Default: `true`

Valid objects:
- object literals (Prototype: `Object.prototype`)
- objects created using `Object.create(null)`

Valid when strict mode off (false):
- all of above
- buit-in objects like Date, Error, Map, Set, Uint8Array etc
- custom Class instances
- objects created using `Object.create(object)`

Always invalid:
- `null`, `undefined`, `NaN`, `Infinity`
- primitive: String, Number, BigInt...

## Returns

`x is T`

## Example

```typescript
import { isObj } from '@superutils/core'

console.log(isObj(null)) // false
console.log(isObj(undefined)) // false
console.log(isObj(NaN)) // false
console.log(isObj(Infinity)) // false
console.log(isObj({})) // true
console.log(isObj({ a: 1, b: 2})) // true
console.log(isObj(Object.create(null))) // true
console.log(isObj(new Map())) // false (strict)
console.log(isObj(new Map(), false)) // true (non-strict)
console.log(isObj(new Error('error'))) // false (strict)
console.log(isObj(new Error('error'), false)) // true (non-strict)
class Test { a = 1 }) // a custom class
console.log(isObj(new Test())) // false
console.log(isObj(new Test(), false)) // true
```
