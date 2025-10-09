# Type Alias: Curry()\<TData, TParams\>

> **Curry**\<`TData`, `TParams`\> = \<`TArgs`\>(...`args`) => [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\> *extends* \[`any`, `...any[]`\] ? `Curry`\<`TData`, [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>\> : `TData`

Defined in: [packages/core/src/types.ts:36](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L36)

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
