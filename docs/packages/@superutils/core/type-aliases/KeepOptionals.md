# Type Alias: KeepOptionals\<Tuple, Require, TAlt\>

> **KeepOptionals**\<`Tuple`, `Require`, `TAlt`\> = `Require` *extends* `true` ? `Required`\<[`DropFirstN`](DropFirstN.md)\<`Tuple`, `Tuple`\[`"length"`\]\>\> *extends* \[`...(infer Optionals)`\] ? [`TupleWithAlt`](TupleWithAlt.md)\<`Optionals`, `TAlt`\> : `never` : [`DropFirstN`](DropFirstN.md)\<`Tuple`, `Tuple`\[`"length"`\]\>

Defined in: [types.ts:161](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/core/src/types.ts#L161)

Extract optional members of a tuple.

## Type Parameters

### Tuple

`Tuple` *extends* `unknown`[]

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
