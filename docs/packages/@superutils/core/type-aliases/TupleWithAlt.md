# Type Alias: TupleWithAlt\<Tuple, TAlt\>

> **TupleWithAlt**\<`Tuple`, `TAlt`\> = \{ -readonly \[K in keyof Tuple\]: Tuple\[K\] \| TAlt \}

Defined in: [types.ts:261](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L261)

Add alt type to all members of a tuple.

---

## Type Parameters

### Tuple

`Tuple` *extends* `any`[]

### TAlt

`TAlt` = `undefined`

## Example

```typescript
type MyTuple = [first: boolean, second: string]
type MyTupleWithUndefined = TupleWithAlt<MyTuple>
// Result: [first: boolean | undefined, second: string | undefined]
type MyTupleWithNull = TupleWithAlt<MyTuple, null>
// Result: [first: boolean | null, second: string | null]
```
