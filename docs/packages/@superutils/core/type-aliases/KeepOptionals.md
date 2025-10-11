# Type Alias: KeepOptionals\<Tuple, Require, TAlt\>

> **KeepOptionals**\<`Tuple`, `Require`, `TAlt`\> = `Require` *extends* `true` ? `Required`\<[`DropFirstN`](DropFirstN.md)\<`Tuple`, `Tuple`\[`"length"`\]\>\> *extends* \[`...(infer Optionals)`\] ? [`TupleWithAlt`](TupleWithAlt.md)\<`Optionals`, `TAlt`\> : `never` : [`DropFirstN`](DropFirstN.md)\<`Tuple`, `Tuple`\[`"length"`\]\>

Defined in: [types.ts:160](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L160)

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
import { KeepOptionals } from '@superutils/core
type MyTuple = [first: string, second?: number, third?: boolean]
type Optionals = KeepOptionals<MyTuple>
// Result: [second?: number, third?: boolean]
type AsRequired = KeepOptionals<MyTuple, true>
// Result: [second: number | undefined, third: boolean | undefined]
type AsRequiredWNull = KeepOptionals<MyTuple, true, null>
// Result: [second: number | null, third: boolean | null]
```
