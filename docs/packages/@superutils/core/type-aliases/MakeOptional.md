# Type Alias: MakeOptional\<Tuple, IndexStart, IndexEnd\>

> **MakeOptional**\<`Tuple`, `IndexStart`, `IndexEnd`\> = `Tuple` *extends* readonly \[`...(infer Left)`, `...Slice<Tuple, IndexStart, IndexEnd>`, `...(infer Right)`\] ? \[`...Left`, `...Partial<Slice<Tuple, IndexStart>>`, `...Right`\] : `never`

Defined in: [packages/core/src/types.ts:196](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/types.ts#L196)

## Type Parameters

### Tuple

`Tuple` *extends* `unknown`[]

### IndexStart

`IndexStart` *extends* `number`

### IndexEnd

`IndexEnd` *extends* `number` = [`TupleMaxLength`](TupleMaxLength.md)\<`Tuple`\>
