# Type Alias: KeepOptionals\<Tuple, Require, TAlt\>

> **KeepOptionals**\<`Tuple`, `Require`, `TAlt`\> = `Require` *extends* `true` ? `Required`\<[`DropFirstN`](DropFirstN.md)\<`Tuple`, `Tuple`\[`"length"`\]\>\> *extends* \[`...(infer Optionals)`\] ? [`TupleWithAlt`](TupleWithAlt.md)\<`Optionals`, `TAlt`\> : `never` : [`DropFirstN`](DropFirstN.md)\<`Tuple`, `Tuple`\[`"length"`\]\>

Defined in: [packages/core/src/types.ts:150](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L150)

Extract optional members of a tuple.

## Type Parameters

### Tuple

`Tuple` *extends* `any`[]

tuple

### Require

`Require` *extends* `true` \| `false` = `false`

(optional) if true, all returned member of the returned tuple will be required field and TAlt will be added as union.
Defaults to `false`

### TAlt

`TAlt` = `undefined`

(optional) Defaults to `undefined`

## Example

```typescript
import { KeepOptionals } from '@utiils/core
type MyTuple = [first: string, second?: number, third?: boolean]
type Optionals = KeepOptionals<MyTuple>
// Result: [second?: number, third?: boolean]
type AsRequired = KeepOptionals<MyTuple, true>
// Result: [second: number | undefined, third: boolean | undefined]
type AsRequiredWNull = KeepOptionals<MyTuple, true, null>
// Result: [second: number | null, third: boolean | null]
```
