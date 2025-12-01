# Type Alias: TupleWithAlt\<Tuple, TAlt\>

> **TupleWithAlt**\<`Tuple`, `TAlt`\> = \{ -readonly \[K in keyof Tuple\]: Tuple\[K\] \| TAlt \}

Defined in: [packages/core/src/types.ts:262](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/types.ts#L262)

Add alt type to all members of a tuple.

---

## Type Parameters

### Tuple

`Tuple` *extends* `unknown`[]

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
