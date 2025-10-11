# Type Alias: MakeOptional\<Tuple, IndexStart, IndexEnd\>

> **MakeOptional**\<`Tuple`, `IndexStart`, `IndexEnd`\> = `Tuple` *extends* readonly \[`...(infer Left)`, `...Slice<Tuple, IndexStart, IndexEnd>`, `...(infer Right)`\] ? \[`...Left`, `...Partial<Slice<Tuple, IndexStart>>`, `...Right`\] : `never`

Defined in: [types.ts:195](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L195)

## Type Parameters

### Tuple

`Tuple` *extends* `any`[]

### IndexStart

`IndexStart` *extends* `number`

### IndexEnd

`IndexEnd` *extends* `number` = [`TupleMaxLength`](TupleMaxLength.md)\<`Tuple`\>
