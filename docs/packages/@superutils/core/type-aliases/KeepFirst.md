# Type Alias: KeepFirst\<T\>

> **KeepFirst**\<`T`\> = `T` *extends* readonly \[infer First, `...DropFirst<T>`\] ? \[`First`\] : `never`

Defined in: [packages/core/src/types.ts:118](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/types.ts#L118)

Keep the first item from an array/tuple and drop the rest
---

## Type Parameters

### T

`T` *extends* `unknown`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWFirst = KeepFirst<MyTuple> // result: [first: string]
```
