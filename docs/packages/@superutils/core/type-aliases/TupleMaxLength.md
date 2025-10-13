# Type Alias: TupleMaxLength\<T\>

> **TupleMaxLength**\<`T`\> = `Required`\<`T`\>\[`"length"`\]

Defined in: [types.ts:247](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L247)

Get the maximum possible length of a tuple

This is particularly useful when a tuple (or function paramenters) contains optional members.

---

## Type Parameters

### T

`T` *extends* readonly `unknown`[]

## Example

```typescript
type MyTuple = [string, number?, boolean?]
type Lengths = MyTuple['length'] // 1 | 2 | 3 // union because of optional parameters
type MaxLength = TupleMaxLength<MyTuple> // 3
```
