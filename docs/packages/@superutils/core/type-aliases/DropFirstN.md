# Type Alias: DropFirstN\<T, N, Dropped\>

> **DropFirstN**\<`T`, `N`, `Dropped`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`Dropped`\> *extends* `N` ? `T` : `T` *extends* \[infer First, `...(infer Rest)`\] ? `DropFirstN`\<`Rest`, `N`, \[`...Dropped`, `First`\]\> : `never`

Defined in: [types.ts:78](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L78)

Drop first N items from an array/tuple and keep the rest
---

## Type Parameters

### T

`T` *extends* `any`[]

### N

`N` *extends* `number`

### Dropped

`Dropped` *extends* `any`[] = \[\]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWO2 = DropFirstN<MyTuple, 2> // result: [third: boolean]
```
