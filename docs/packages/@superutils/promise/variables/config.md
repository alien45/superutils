# Variable: config

> `const` **config**: `object`

Defined in: [packages/promise/src/config.ts:5](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/config.ts#L5)

Global configuration

## Type Declaration

### deferOptions

> **deferOptions**: [`DeferredOptions`](../type-aliases/DeferredOptions.md)

Default value for `options` used by `PromisE.*deferred*` functions

### delayTimeoutMsg

> **delayTimeoutMsg**: `string` = `'Timed out after'`

### retryOptions

> **retryOptions**: `object`

#### retryOptions.retry

> **retry**: `number` = `1`

#### retryOptions.retryBackOff

> **retryBackOff**: `"exponential"` = `'exponential'`

#### retryOptions.retryDelay

> **retryDelay**: `number` = `300`

#### retryOptions.retryDelayJitter

> **retryDelayJitter**: `true` = `true`

#### retryOptions.retryDelayJitterMax

> **retryDelayJitterMax**: `number` = `100`

#### retryOptions.retryIf

> **retryIf**: `null` = `null`
