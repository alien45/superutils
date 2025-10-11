# Class: FetchError

Defined in: [packages/promise/src/types/fetch.ts:236](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L236)

## Extends

- `Error`

## Constructors

### Constructor

> **new FetchError**(`message`, `options`): `FetchError`

Defined in: [packages/promise/src/types/fetch.ts:241](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L241)

#### Parameters

##### message

`string`

##### options

###### cause?

`unknown`

###### options

[`FetchOptions`](../type-aliases/FetchOptions.md)

###### response?

`Response`

###### url

`string` \| `URL`

#### Returns

`FetchError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### options?

> `optional` **options**: [`FetchOptions`](../type-aliases/FetchOptions.md)

Defined in: [packages/promise/src/types/fetch.ts:237](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L237)

***

### response?

> `optional` **response**: `Response`

Defined in: [packages/promise/src/types/fetch.ts:238](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L238)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### url

> **url**: `string` \| `URL`

Defined in: [packages/promise/src/types/fetch.ts:239](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L239)

## Methods

### isError()

> `static` **isError**(`error`): `error is Error`

Defined in: node\_modules/typescript/lib/lib.esnext.error.d.ts:23

Indicates whether the argument provided is a built-in Error instance or not.

#### Parameters

##### error

`unknown`

#### Returns

`error is Error`

#### Inherited from

`Error.isError`
