# Type Alias: TupleMaxLength\<T\>

> **TupleMaxLength**\<`T`\> = `Required`\<`T`\>\[`"length"`\]

Defined in: [types.ts:246](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L246)

Get the maximum possible length of a tuple

This is particularly useful when a tuple (or function paramenters) contains optional members.

---

## Type Parameters

### T

`T` *extends* readonly `any`[]

## Example

```typescript
type MyTuple = [string, number?, boolean?]
type Lengths = MyTuple['length'] // 1 | 2 | 3 // union because of optional parameters
type MaxLength = TupleMaxLength<MyTuple> // 3
```
