# Variable: config

> `const` **config**: `object`

Defined in: [packages/promise/src/config.ts:11](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/config.ts#L11)

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
