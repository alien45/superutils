# Type Alias: TupleWithAlt\<Tuple, TAlt\>

> **TupleWithAlt**\<`Tuple`, `TAlt`\> = \{ -readonly \[K in keyof Tuple\]: Tuple\[K\] \| TAlt \}

Defined in: [types.ts:262](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L262)

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
