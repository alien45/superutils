# Type Alias: MakeOptional\<Tuple, IndexStart, IndexEnd\>

> **MakeOptional**\<`Tuple`, `IndexStart`, `IndexEnd`\> = `Tuple` *extends* readonly \[`...(infer Left)`, `...Slice<Tuple, IndexStart, IndexEnd>`, `...(infer Right)`\] ? \[`...Left`, `...Partial<Slice<Tuple, IndexStart>>`, `...Right`\] : `never`

Defined in: [types.ts:196](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L196)

## Type Parameters

### Tuple

`Tuple` *extends* `unknown`[]

### IndexStart

`IndexStart` *extends* `number`

### IndexEnd

`IndexEnd` *extends* `number` = [`TupleMaxLength`](TupleMaxLength.md)\<`Tuple`\>
