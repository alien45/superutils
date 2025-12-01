# Type Alias: DropFirstN\<T, N, Dropped\>

> **DropFirstN**\<`T`, `N`, `Dropped`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`Dropped`\> *extends* `N` ? `T` : `T` *extends* \[infer First, `...(infer Rest)`\] ? `DropFirstN`\<`Rest`, `N`, \[`...Dropped`, `First`\]\> : `never`

Defined in: [packages/core/src/types.ts:78](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/types.ts#L78)

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
