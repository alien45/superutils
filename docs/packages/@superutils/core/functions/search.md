# Function: search()

> **search**\<`K`, `V`, `AsMap`, `Result`\>(`data`, `options`): `Result`

Defined in: [packages/core/src/iterable/search.ts:89](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/search.ts#L89)

A versatile utility for searching through an iterable list (e.g., Array, Map, Set) of objects.
It supports both a simple "fuzzy" search with a string query across all properties and a
detailed, field-specific search using a query object.

## Type Parameters

### K

`K`

### V

`V` *extends* `Record`\<`string`, `unknown`\>

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
- `NodeList` (in DOM environments)
- `HTMLCollection` (in DOM environments)

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
