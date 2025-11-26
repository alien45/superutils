# Function: isEmptySafe()

> **isEmptySafe**(`x`, `numberableOnly`): `boolean` \| `1`

Defined in: [packages/core/src/is/isEmpty.ts:100](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/is/isEmpty.ts#L100)

Safe version of [isEmpty](isEmpty.md) with extended type checks and cross-realm handling.

CAUTION: much slower than [isEmpty](isEmpty.md) due to use of Object.prototype.toString.call()

Cross-realm means objects created in different JavaScript contexts.
Eg: iframe, node vm context, worker context, browser extensions etc.

## Parameters

### x

`unknown`

The value to check for emptiness.

### numberableOnly

`boolean` = `false`

## Returns

`boolean` \| `1`

`true` if the value is considered empty, `false` otherwise.
