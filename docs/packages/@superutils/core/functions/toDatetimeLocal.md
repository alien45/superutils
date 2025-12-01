# Function: toDatetimeLocal()

> **toDatetimeLocal**(`dateStr`): `""` \| `` `${number}-${number}-${number}T${number}:${number}` ``

Defined in: [packages/core/src/toDatetimeLocal.ts:27](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/toDatetimeLocal.ts#L27)

Convert timestamp to `input["datetime-local"]` compatible format.

---

## Parameters

### dateStr

`string` | `number` | `Date`

## Returns

`""` \| `` `${number}-${number}-${number}T${number}:${number}` ``

## Examples

```typescript
toDatetimeLocal('2000-01-01T01:01:01.001Z')
// result: "2000-01-01T01:01" // assuming local timezone is UTC+0
```

```typescript
const date = new Date('2000-01-01T01:01:01.001Z')
toDatetimeLocal(date)
// result: "2000-01-01T01:01" // assuming local timezone is UTC+0
```

```typescript
const epoch = new Date('2000-01-01T01:01:01.001Z').getTime()
toDatetimeLocal(epoch)
// result: "2000-01-01T01:01" // assuming local timezone is UTC+0
```
