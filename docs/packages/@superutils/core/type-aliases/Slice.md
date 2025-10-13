# Type Alias: Slice\<Tuple, IndexStart, IndexEnd\>

> **Slice**\<`Tuple`, `IndexStart`, `IndexEnd`\> = \[`...KeepRequired<Tuple>`, `...KeepOptionals<Tuple, true>`\] *extends* \[`...(infer All)`\] ? [`DropFirstN`](DropFirstN.md)\<[`KeepFirstN`](KeepFirstN.md)\<`All`, `IndexEnd`\>, `IndexStart`\> *extends* \[`...(infer Sliced)`\] ? `Sliced` : `never` : `never`

Defined in: [types.ts:218](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L218)

Create a new slices tuple from an existing tuple
---

## Type Parameters

### Tuple

`Tuple` *extends* `unknown`[]

### IndexStart

`IndexStart` *extends* `number`

### IndexEnd

`IndexEnd` *extends* `number` = [`TupleMaxLength`](TupleMaxLength.md)\<`Tuple`\>

## Example

```typescript
type MyTuple = [a: string, b: boolean, c: number, d: Record<string, unknown>]
type FirstHalf = Slice<MyTuple, 0, 2>
type LastHalf = Slice<MyTuple, 2>
```
