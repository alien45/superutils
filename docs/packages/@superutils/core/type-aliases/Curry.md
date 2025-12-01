# Type Alias: Curry()\<TData, TParams\>

> **Curry**\<`TData`, `TParams`\> = \<`TArgs`\>(...`args`) => [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\> *extends* \[`unknown`, `...unknown[]`\] ? `Curry`\<`TData`, [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>\> : `TData`

Defined in: [packages/core/src/types.ts:36](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/types.ts#L36)

A recursive helper type that defines the signature of the curry function.

## Type Parameters

### TData

`TData`

The final return type.

### TParams

`TParams` *extends* `unknown`[]

The tuple of remaining parameters.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

## Parameters

### args

...`TArgs` & [`KeepFirstN`](KeepFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>

## Returns

[`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\> *extends* \[`unknown`, `...unknown[]`\] ? `Curry`\<`TData`, [`DropFirstN`](DropFirstN.md)\<`TParams`, `TArgs`\[`"length"`\]\>\> : `TData`
