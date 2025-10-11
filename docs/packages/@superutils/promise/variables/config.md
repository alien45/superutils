# Variable: config

> `const` **config**: `object`

Defined in: [packages/promise/src/config.ts:11](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/config.ts#L11)

Global configuration

## Type Declaration

### defaults

> **defaults**: `object`

Global default values

#### defaults.deferOptions

> **deferOptions**: [`DeferredOptions`](../type-aliases/DeferredOptions.md)

Default value for `options` used by `PromisE.*deferred*` functions

#### defaults.delayTimeoutMsg

> **delayTimeoutMsg**: `string` = `'Timed out after'`

#### defaults.fetchOptions

> **fetchOptions**: [`FetchOptionsInterceptor`](../type-aliases/FetchOptionsInterceptor.md)

Global defalut values for fetch (get, post....) requests and global interceptors
