# Variable: is

> `const` **is**: `object`

Defined in: [is.ts:118](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/is.ts#L118)

Combination of all the compile-time & runtime utilities functions above

## Type Declaration

### arr()

> **arr**: \<`T`\>(`x`) => `x is T[]` = `isArr`

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### x

`any`

#### Returns

`x is T[]`

### arrUnique()

> **arrUnique**: \<`T`\>(`arr`) => `T`[] = `isArrUnique`

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### arr

`T`[]

#### Returns

`T`[]

### asyncFn()

> **asyncFn**: \<`TData`, `TArgs`\>(`x`) => `x is AsyncFn<TData, TArgs>` = `isAsyncFn`

**`Function`**

isAsyncFn
Check if `x` is an Async function.
Caution: May not work at runtime when Babel/Webpack is used due to code compilation.

---

#### Type Parameters

##### TData

`TData` = `unknown`

##### TArgs

`TArgs` *extends* `any`[] = `unknown`[]

#### Parameters

##### x

`any`

#### Returns

`x is AsyncFn<TData, TArgs>`

#### Example

```typescript
isAsyncFn(async () => {}) // result: true
isAsyncFn(() => {}) // result: false
```

### bool()

> **bool**: (`x`) => `x is boolean` = `isBool`

#### Parameters

##### x

`any`

#### Returns

`x is boolean`

### date()

> **date**: (`x`) => `x is Date` = `isDate`

#### Parameters

##### x

`any`

#### Returns

`x is Date`

### error()

> **error**: (`x`) => `x is Error` = `isError`

#### Parameters

##### x

`any`

#### Returns

`x is Error`

### fn()

> **fn**: (`x`) => `x is Function` = `isFn`

#### Parameters

##### x

`any`

#### Returns

`x is Function`

### integer()

> **integer**: (`x`) => `x is number` = `isInteger`

#### Parameters

##### x

`any`

#### Returns

`x is number`

### map()

> **map**: \<`TKey`, `TValue`\>(`x`) => `x is Map<TKey, TValue>` = `isMap`

#### Type Parameters

##### TKey

`TKey` = `any`

##### TValue

`TValue` = `any`

#### Parameters

##### x

`any`

#### Returns

`x is Map<TKey, TValue>`

### obj()

> **obj**: (`x`, `strict`) => `x is object` = `isObj`

#### Parameters

##### x

`any`

##### strict

`boolean` = `true`

#### Returns

`x is object`

### positiveInteger()

> **positiveInteger**: (`x`) => `x is number` = `isPositiveInteger`

#### Parameters

##### x

`any`

#### Returns

`x is number`

### positiveNumber()

> **positiveNumber**: (`x`) => `x is number` = `isPositiveNumber`

#### Parameters

##### x

`any`

#### Returns

`x is number`

### promise()

> **promise**: \<`T`\>(`x`) => `x is Promise<T>` = `isPromise`

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### x

`any`

#### Returns

`x is Promise<T>`

### set()

> **set**: \<`T`\>(`x`) => `x is Set<T>` = `isSet`

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### x

`any`

#### Returns

`x is Set<T>`

### str()

> **str**: (`x`) => `x is string` = `isStr`

#### Parameters

##### x

`any`

#### Returns

`x is string`

### url()

> **url**: (`x`) => `x is URL` = `isUrl`

#### Parameters

##### x

`any`

#### Returns

`x is URL`

### validDate()

> **validDate**: (`date`) => `boolean` = `isValidDate`

**`Function`**

isValidDate

#### Parameters

##### date

`any`

The value to check. Can be a Date object or a string.

#### Returns

`boolean`

`true` if the value is a valid date, `false` otherwise.

### validNumber()

> **validNumber**: (`x`) => `x is number` = `isValidNumber`

#### Parameters

##### x

`any`

#### Returns

`x is number`

### validURL()

> **validURL**: (`x`, `strict`, `tldExceptions`) => `boolean` = `isValidURL`

Checks if a value is a valid URL.

#### Parameters

##### x

`any`

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
