# Type Alias: Curry()\<TData, TParams\>

> **Curry**\<`TData`, `TParams`\> = \<`TArgs`\>(...`args`) => [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\> *extends* \[`any`, `...any[]`\] ? `Curry`\<`TData`, [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>\> : `TData`

Defined in: [types.ts:36](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L36)

A recursive helper type that defines the signature of the curry function.

## Type Parameters

### TData

`TData`

The final return type.

### TParams

`TParams` *extends* `any`[]

The tuple of remaining parameters.

## Type Parameters

### TArgs

`TArgs` *extends* `any`[]

## Parameters

### args

...`TArgs` & [`KeepFirstN`](KeepFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>

## Returns

[`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\> *extends* \[`any`, `...any[]`\] ? `Curry`\<`TData`, [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>\> : `TData`
