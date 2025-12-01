# Function: search()

> **search**\<`K`, `V`, `AsMap`, `Result`\>(`data`, `options`): `Result`

Defined in: [packages/core/src/iterable/search.ts:54](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/search.ts#L54)

A versatile utility for searching through an iterable list (e.g., Array, Map, Set) of objects.
It supports both a simple "fuzzy" search with a string query across all properties and a
detailed, field-specific search using a query object.

## Type Parameters

### K

`K`

### V

`V`

### AsMap

`AsMap` *extends* `boolean` = `true`

### Result

`Result` = `AsMap` *extends* `true` ? `Map`\<`K`, `V`\> : `V`[]

## Parameters

### data

[`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

The list of objects to search within. Compatible types include:
- `Array`
- `Map`
- `Set`
- `NodeList` (in DOM environments): `options.transform()` required
- `HTMLCollection` (in DOM environments): should accompany `options.transform()`

### options

[`SearchOptions`](../type-aliases/SearchOptions.md)\<`K`, `V`, `AsMap`\>

The search criteria.

## Returns

`Result`

A `Map` or an `Array` containing the matched items, based on the `asMap` option.

## Example

```typescript
const users = [
  { id: 1, name: 'John Doe', city: 'New York' },
  { id: 2, name: 'Jane Doe', city: 'London' },
  { id: 3, name: 'Peter Jones', city: 'New York' },
];

// Simple string search (case-insensitive, partial match by default)
const doeUsers = search(users, { query: 'doe' });
// Returns: [{ id: 1, ... }, { id: 2, ... }]

// Field-specific search, requiring all fields to match
const peterInNY = search(users, {
  query: { name: 'Peter', city: 'New York' },
  matchAll: true,
});
// Returns: [{ id: 3, ... }]
```
