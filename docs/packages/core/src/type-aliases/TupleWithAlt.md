# Type Alias: TupleWithAlt\<Tuple, TAlt\>

> **TupleWithAlt**\<`Tuple`, `TAlt`\> = \{ -readonly \[K in keyof Tuple\]: Tuple\[K\] \| TAlt \}

Defined in: [packages/core/src/types.ts:251](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L251)

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
