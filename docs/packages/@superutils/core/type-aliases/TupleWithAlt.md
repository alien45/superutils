# Type Alias: TupleWithAlt\<Tuple, TAlt\>

> **TupleWithAlt**\<`Tuple`, `TAlt`\> = \{ -readonly \[K in keyof Tuple\]: Tuple\[K\] \| TAlt \}

Defined in: [packages/core/src/types.ts:262](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/types.ts#L262)

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
