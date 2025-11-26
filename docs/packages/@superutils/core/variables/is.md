# Variable: is

> `const` **is**: `object`

Defined in: [packages/core/src/is/index.ts:77](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/is/index.ts#L77)

Compilation of all the compile-time & runtime utilities functions above

## Type Declaration

### arr()

> **arr**: \<`Item`\>(`x`) => `x is Item[]` = `isArr`

Check if value is an array

#### Type Parameters

##### Item

`Item` = `unknown`

#### Parameters

##### x

`unknown`

#### Returns

`x is Item[]`

### arr2D()

> **arr2D**: \<`Item`\>(`x`) => `x is Item[][]` = `isArr2D`

Check if argument is a 2-dimentional array

#### Type Parameters

##### Item

`Item` = `unknown`

#### Parameters

##### x

`unknown`

#### Returns

`x is Item[][]`

### arrLike()

> **arrLike**: (`x`) => x is unknown\[\] \| Set\<unknown\> \| Map\<unknown, unknown\> = `isArrLike`

Check if value is convertible to an array by using `Array.from(x)`

#### Parameters

##### x

`any`

#### Returns

x is unknown\[\] \| Set\<unknown\> \| Map\<unknown, unknown\>

### arrLikeSafe()

> **arrLikeSafe**: \<`T`, `MapKey`\>(`x`) => x is Set\<T\> \| Map\<MapKey, T\> \| T\[\] = `isArrLikeSafe`

Check if value is convertible to an array by using `Array.from(x)` even if it comes from a different realm
(eg: iframe, iframes, worker contexts, node vm contexts, browser extensions).

Caution: much slower than [()](../functions/isArrLike.md) due to use of `Object.prototype.toString.call()`

#### Type Parameters

##### T

`T` = `unknown`

##### MapKey

`MapKey` = `unknown`

#### Parameters

##### x

`unknown`

#### Returns

x is Set\<T\> \| Map\<MapKey, T\> \| T\[\]

### arrObj()

> **arrObj**: \<`K`, `V`, `T`\>(`x`, `strict`) => `x is T[]` = `isArrObj`

Check if value is an array of objects

#### Type Parameters

##### K

`K` *extends* `PropertyKey`

##### V

`V`

##### T

`T` *extends* `Record`\<`K`, `V`\>[]

#### Parameters

##### x

`unknown`

##### strict

`boolean` = `true`

#### Returns

`x is T[]`

### arrUnique()

> **arrUnique**: \<`T`\>(`arr`) => `boolean` = `isArrUnique`

Check if all values in the array are unique

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### arr

`T`[]

#### Returns

`boolean`

### asyncFn()

> **asyncFn**: \<`TData`, `TArgs`\>(`x`) => `x is AsyncFn<TData, TArgs>` = `isAsyncFn`

Check if value is an Async function.
Caution: May not work at runtime when Babel/Webpack is used due to code compilation.

---

#### Type Parameters

##### TData

`TData` = `unknown`

##### TArgs

`TArgs` *extends* `unknown`[] = `unknown`[]

#### Parameters

##### x

`unknown`

#### Returns

`x is AsyncFn<TData, TArgs>`

#### Example

```typescript
isAsyncFn(async () => {}) // result: true
isAsyncFn(() => {}) // result: false
```

### bool()

> **bool**: (`x`) => `x is boolean` = `isBool`

Check if value is boolean

#### Parameters

##### x

`unknown`

#### Returns

`x is boolean`

### date()

> **date**: (`x`) => `x is Date` = `isDate`

Check if value is instance of Date

#### Parameters

##### x

`unknown`

#### Returns

`x is Date`

### dateValid()

> **dateValid**: (`date`) => `boolean` = `isDateValid`

Check if a value is a valid date.

#### Parameters

##### date

`unknown`

The value to check. Can be a Date object or a string.

#### Returns

`boolean`

`true` if the value is a valid date, `false` otherwise.

### defined()

> **defined**: \<`T`\>(`x`) => `x is T` = `isDefined`

Check if value is not undefined or null

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### x

`undefined` | `null` | `T`

#### Returns

`x is T`

### empty()

> **empty**: (`x`, `nonNumerable`, `fallback`) => `boolean` \| `0` \| `1` = `isEmpty`

Check if variable contains empty, null-ish value.

Depending on the type certain criteria applies:
- `null` | `undefined`: always empty
- `String`: empty text or only white-spaces
- `Number`: non-finite or NaN
- `Array` | `Uint8Array` | `Map` | `Set` | `Object`: contains zero items/properties
- `Boolean` | `Function` | `Symbol` | `BigInt`: never empty

#### Parameters

##### x

`unknown`

The value to check for emptiness.

##### nonNumerable

`boolean` = `false`

(optional) when `true`, considers non-enumerable properties
while checking objects for emptiness. Default: `false`

##### fallback

(optional) value to return when type is unrecognized.
Default: `false`

`boolean` | `0` | `1`

#### Returns

`boolean` \| `0` \| `1`

#### Examples

```typescript
import { isEmpty } from '@superutils/core'
isEmpty('') // true
isEmpty(' ') // true
isEmpty(`

`) // true
isEmpty('    not empty   ') // false
isEmpty(`

    not empty

`) // false
```

```typescript
import { isEmpty } from '@superutils/core'
isEmpty(NaN) // true
isEmpty(Infinity) // true
isEmpty(0) // false
```

```typescript
import { isEmpty } from '@superutils/core'
isEmpty({}) // true
isEmpty([]) // true
isEmpty(new Map()) // true
isEmpty(new Set()) // true
```

### emptySafe()

> **emptySafe**: (`x`, `numberableOnly`) => `boolean` \| `1` = `isEmptySafe`

Safe version of [isEmpty](../functions/isEmpty.md) with extended type checks and cross-realm handling.

CAUTION: much slower than [isEmpty](../functions/isEmpty.md) due to use of Object.prototype.toString.call()

Cross-realm means objects created in different JavaScript contexts.
Eg: iframe, node vm context, worker context, browser extensions etc.

#### Parameters

##### x

`unknown`

The value to check for emptiness.

##### numberableOnly

`boolean` = `false`

#### Returns

`boolean` \| `1`

`true` if the value is considered empty, `false` otherwise.

### envBrowser()

> **envBrowser**: () => `boolean` = `isEnvBrowser`

Check if the environment is Browser

#### Returns

`boolean`

### envNode()

> **envNode**: () => `boolean` = `isEnvNode`

Check if the environment is NodeJS

#### Returns

`boolean`

### envTouchable()

> **envTouchable**: () => `boolean` = `isEnvTouchable`

Check if page is loaded on a touchscreen device

#### Returns

`boolean`

### error()

> **error**: (`x`) => `x is Error` = `isError`

Check if value is instance of Error

#### Parameters

##### x

`unknown`

#### Returns

`x is Error`

### fn()

> **fn**: (`x`) => `x is (args: any[]) => any` = `isFn`

Check if value is a function

#### Parameters

##### x

`unknown`

#### Returns

`x is (args: any[]) => any`

### integer()

> **integer**: (`x`) => `x is number` = `isInteger`

Check if value is an integer

#### Parameters

##### x

`unknown`

#### Returns

`x is number`

### map()

> **map**: \<`TKey`, `TValue`\>(`x`) => `x is Map<TKey, TValue>` = `isMap`

Check if value is instance of Map

#### Type Parameters

##### TKey

`TKey` = `unknown`

##### TValue

`TValue` = `unknown`

#### Parameters

##### x

`unknown`

#### Returns

`x is Map<TKey, TValue>`

### mapObj()

> **mapObj**: \<`K`, `V`, `T`\>(`x`, `strict`) => `x is Map<K, V>` = `isMapObj`

Check if provided is a Map and all values are objects

#### Type Parameters

##### K

`K` *extends* `PropertyKey`

##### V

`V`

##### T

`T` *extends* `Record`\<`K`, `V`\>

#### Parameters

##### x

`unknown`

##### strict

`boolean` = `true`

#### Returns

`x is Map<K, V>`

### number()

> **number**: (`x`) => `x is number` = `isNumber`

Check if value is a valid finite number

#### Parameters

##### x

`unknown`

#### Returns

`x is number`

### obj()

> **obj**: \<`T`\>(`x`, `strict`) => `x is T` = `isObj`

Check if value is an object.

#### Type Parameters

##### T

`T` = `object`

#### Parameters

##### x

`unknown`

value to check

##### strict

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

#### Returns

`x is T`

#### Example

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

### positiveInteger()

> **positiveInteger**: (`x`) => `x is number` = `isPositiveInteger`

Check if value is a positive integer

#### Parameters

##### x

`unknown`

#### Returns

`x is number`

### positiveNumber()

> **positiveNumber**: (`x`) => `x is number` = `isPositiveNumber`

Check if value is a positive number

#### Parameters

##### x

`unknown`

#### Returns

`x is number`

### promise()

> **promise**: \<`T`\>(`x`) => `x is Promise<T>` = `isPromise`

Check if value is a Promise

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### x

`unknown`

#### Returns

`x is Promise<T>`

### regExp()

> **regExp**: (`x`) => `x is RegExp` = `isRegExp`

Check if value is a regular expession

#### Parameters

##### x

`unknown`

#### Returns

`x is RegExp`

### set()

> **set**: \<`T`\>(`x`) => `x is Set<T>` = `isSet`

Check if value is instance of Set

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### x

`unknown`

#### Returns

`x is Set<T>`

### str()

> **str**: (`x`) => `x is string` = `isStr`

Check if value is string

#### Parameters

##### x

`unknown`

#### Returns

`x is string`

### subjectLike()

> **subjectLike**: (`x`, `withValue`) => `boolean` = `isSubjectLike`

Check if value is similar to a RxJS subject with .subscribe & .next functions

#### Parameters

##### x

`unknown`

The value to check

##### withValue

`boolean` = `false`

When `true`, also checks if `value` property exists in `x`

#### Returns

`boolean`

`true` if the value is subject-like, `false` otherwise.

### symbol()

> **symbol**: (`x`) => `x is symbol` = `isSymbol`

Check if value is a Symbol

#### Parameters

##### x

`unknown`

#### Returns

`x is symbol`

### uint8Arr()

> **uint8Arr**: (`arr`) => `arr is Uint8Array<ArrayBufferLike>` = `isUint8Arr`

Check if value is instance of Uint8Array

#### Parameters

##### arr

`unknown`

#### Returns

`arr is Uint8Array<ArrayBufferLike>`

### url()

> **url**: (`x`) => `x is URL` = `isUrl`

Check if value is instance of URL

#### Parameters

##### x

`unknown`

#### Returns

`x is URL`

### urlValid()

> **urlValid**: (`x`, `strict`, `tldExceptions`) => `boolean` = `isUrlValid`

Check if a value is a valid URL/string-URL.

#### Parameters

##### x

`unknown`

The value to check.

##### strict

`boolean` = `true`

If true:
- requires a domain name with a TLDs etc.
- and x is string, catches any auto-correction (eg: trailing spaces being removed, spaces being replaced by `%20`)
by `new URL()` to ensure string URL is valid
Defaults to `true`.

##### tldExceptions

`string`[] = `...`

when in strict mode, treat these hosts as valid despite no domain name extensions
Defaults to `['localhost']`

#### Returns

`boolean`

`true` if the value is a valid URL, `false` otherwise.
