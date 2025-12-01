# Type Alias: CurriedArgs\<TArgs, TArgsIsFinite, TFunc, TArity\>

> **CurriedArgs**\<`TArgs`, `TArgsIsFinite`, `TFunc`, `TArity`\> = `TArgsIsFinite` *extends* `false` ? [`CreateTuple`](CreateTuple.md)\<`Parameters`\<`TFunc`\>\[`number`\], `TArity`\> : [`KeepFirstN`](KeepFirstN.md)\<\[`...KeepRequired<TArgs>`, `...KeepOptionals<TArgs, true, undefined>`\], `TArity`\>

Defined in: [packages/core/src/curry.ts:113](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/curry.ts#L113)

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TArgsIsFinite

`TArgsIsFinite` *extends* `boolean`

### TFunc

`TFunc` *extends* (...`args`) => `unknown`

### TArity

`TArity` *extends* `number`
