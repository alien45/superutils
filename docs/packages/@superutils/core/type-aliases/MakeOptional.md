# Type Alias: MakeOptional\<Tuple, IndexStart, IndexEnd\>

> **MakeOptional**\<`Tuple`, `IndexStart`, `IndexEnd`\> = `Tuple` *extends* readonly \[`...(infer Left)`, `...Slice<Tuple, IndexStart, IndexEnd>`, `...(infer Right)`\] ? \[`...Left`, `...Partial<Slice<Tuple, IndexStart>>`, `...Right`\] : `never`

Defined in: [types.ts:196](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/core/src/types.ts#L196)

## Type Parameters

### Tuple

`Tuple` *extends* `unknown`[]

### IndexStart

`IndexStart` *extends* `number`

### IndexEnd

`IndexEnd` *extends* `number` = [`TupleMaxLength`](TupleMaxLength.md)\<`Tuple`\>
