# Function: isEmpty()

> **isEmpty**(`x`, `nonNumerable`, `fallback`): `boolean` \| `0` \| `1`

Defined in: [packages/core/src/is/isEmpty.ts:54](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/is/isEmpty.ts#L54)

Check if variable contains empty, null-ish value.

Depending on the type certain criteria applies:
- `null` | `undefined`: always empty
- `String`: empty text or only white-spaces
- `Number`: non-finite or NaN
- `Array` | `Uint8Array` | `Map` | `Set` | `Object`: contains zero items/properties
- `Boolean` | `Function` | `Symbol` | `BigInt`: never empty

## Parameters

### x

`unknown`

The value to check for emptiness.

### nonNumerable

`boolean` = `false`

(optional) when `true`, considers non-enumerable properties
while checking objects for emptiness. Default: `false`

### fallback

(optional) value to return when type is unrecognized.
Default: `false`

`boolean` | `0` | `1`

## Returns

`boolean` \| `0` \| `1`

## Examples

```typescript
import { isEmpty } from '@superutils/core'
isEmpty('') // true
isEmpty(' ') // true
isEmpty(`

`) // true
isEmpty('    not empty   ') // false
isEmpty(`

    not empty

`) // false
```

```typescript
import { isEmpty } from '@superutils/core'
isEmpty(NaN) // true
isEmpty(Infinity) // true
isEmpty(0) // false
```

```typescript
import { isEmpty } from '@superutils/core'
isEmpty({}) // true
isEmpty([]) // true
isEmpty(new Map()) // true
isEmpty(new Set()) // true
```
