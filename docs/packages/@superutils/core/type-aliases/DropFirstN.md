# Type Alias: DropFirstN\<T, N, Dropped\>

> **DropFirstN**\<`T`, `N`, `Dropped`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`Dropped`\> *extends* `N` ? `T` : `T` *extends* \[infer First, `...(infer Rest)`\] ? `DropFirstN`\<`Rest`, `N`, \[`...Dropped`, `First`\]\> : `never`

Defined in: [packages/core/src/types.ts:78](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/types.ts#L78)

Drop first N items from an array/tuple and keep the rest
---

## Type Parameters

### T

`T` *extends* `unknown`[]

### N

`N` *extends* `number`

### Dropped

`Dropped` *extends* `unknown`[] = \[\]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWO2 = DropFirstN<MyTuple, 2> // result: [third: boolean]
```
