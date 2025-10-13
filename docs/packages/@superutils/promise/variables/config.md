# Variable: config

> `const` **config**: `object`

Defined in: [packages/promise/src/config.ts:11](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/config.ts#L11)

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
