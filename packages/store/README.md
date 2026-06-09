# @superutils/store

A generic, reactive, persistent and fully-typed Map-like data store with advanced search, filtering, and sorting capabilities. It supports both in-memory caching and persistent storage (LocalStorage in browsers, or JSON files in NodeJS).

Built on RxJS for reactive data handling, it is optimized for small to medium datasets and provides a seamless way to manage application state with optional persistence.

<div v-if="false">

For full API reference and example code playground check out the [docs page](https://alien45.github.io/superutils/packages/@superutils/store/).

</div>

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Map-Based Store](#map-based-store)
  - [Object-based Store](#object-based-store)
  - [Persistent Storage (NodeJS)](#persistent-storage-nodejs)
- [Advanced Usage](#advanced-usage)
  - [Data Validation](#data-validation)
  - [Reactive Updates (RxJS & Callbacks)](#reactive-updates-rxjs--callbacks)
  - [Search and Filtering](#search-and-filtering)
  - [Attaching Business Logic: Store Augmentation](#attaching-business-logic-store-augmentation)
  - [Object-based Store With Augmentation](#object-based-store-with-augmentation)
  - [OOP: Subclassing Store](#oop-subclassing-store)

## Installation

### NPM

Install using your favorite package manager (e.g., `npm`, `yarn`, `pnpm`, `bun`, etc.):

```bash
npm install @superutils/store
```

Dependency: `@superutils/core` will be automatically installed by package manager

### CDN / Browser

If you are not using a bundler, you can include the minified browser build directly:

```xml
<script src="https://unpkg.com/@superutils/store@latest/dist/browser/index.min.js"></script>
```

OR,

```xml
<script src="https://cdn.jsdelivr.net/npm/@superutils/store/dist/browser/index.min.js"></script>
```

## Basic Usage

### Map-based Store

The `Store` class can be used just like a standard JavaScript `Map`, but with the added benefit of optional persistence and reactivity.

```javascript
import { createStore } from '@superutils/store'

// Initialize the store that saves the stringified data to `localStorage.users` in the browser.
// Bypassing the name or using `null` will create an in-memory store.
const userStorage = createStore({ name: 'users' })

// Set and get values
userStorage.set('alice', { name: 'Alice', age: 30 })

// functional update
userStorage.set('alice', alice => alice ?? { name: 'Alice', age: 30 })

console.log(userStorage.get('alice')) // prints: { name: 'Alice', age: 30 }
console.log(userStorage.size) // 1
```

### Object-based Store

`createObjectStore` provides a type-safe way to manage a single plain object as a store, where keys of the object become keys in the store.

```javascript
import { createObjectStore } from '@superutils/store'

const userStore = createObjectStore({
  name: 'user-profile',
  initialValue: {
    age: 25,
    name: 'Jane Doe',
    roles: ['guest'],
  },
})

console.log(userStore.get('name'), userStore.get('age')) // Prints: 'Jane Doe' 25

console.log(userStore.toObject()) // prints: { age: 25, name: 'Jane Doe', roles: [ 'guest' ] }
```

### Persistent Storage (NodeJS)

In NodeJS environments, you can use `node-localstorage` to persist your data to the file system.

```javascript
import { createStore } from '@superutils/store'
import { LocalStorage } from 'node-localstorage'

// Provide a localStorage implementation for NodeJS that can be used throughout the application mimicking the browser LocalStorage behavior.
globalThis.localStorage = new LocalStorage(
  './data', // directory to store files in
  1e7, // max file size
)

// Create a store that saves the data to ./data/settings.json
// Bypassing the name or using `null` will create an in-memory store.
const store = createStore({ name: 'settings.json' })
store.set('theme', 'dark') // Automatically saved to ./data/settings.json

/**
 * Alternatively, you can also provide a LocalStorage instance to each Store instance.
 */
createStore({
  name: 'settings.json',
  storage: new LocalStorage('./data', 1e9),
})
```

## Advanced Usage

### Data Validation

To ensure data integrity, you can provide a `validate` object containing hooks for various operations (`set`, `setAll`, `delete`, `clear`, `write`). These hooks are executed immediately before the store's internal state is updated. If a validator throws an error, the operation is aborted.

```javascript
import { createObjectStore } from '@superutils/store'

const settingsStore = createObjectStore({
  name: 'app-settings',
  initialValue: {
    theme: 'light',
    version: '1.0.0',
  },
  validate: {
    set: ([key, value]) => {
      if (key !== 'theme' || ['light', 'dark', 'system'].includes(value)) return

      // throw error to abort operation
      throw new Error(`Invalid theme: ${value}`)
    },
    delete: ([keys]) => {
      if (!keys.includes('version')) return

      throw new Error('The "version" key is protected and cannot be deleted')
    },
  },
})

settingsStore.set('theme', 'system')
console.log(settingsStore.get('theme')) // 'system
try {
  settingsStore.set('theme', 'invalid') // throws error
} catch (err) {
  console.log(err)
}
```

### Reactive Updates (RxJS & Callbacks)

You can subscribe to changes using the internal RxJS Subject or a simple `onChange` callback.

```javascript
import { createStore } from '@superutils/store'

const store = createStore({
  name: 'my-data',
  onChange: data => console.log('Data changed!', data),
})

// Or use the RxJS subject directly
const sub = store.subject$.subscribe(data => {
  console.log('Reactive update:', data)
})

store.set('key', 'value')
```

### Search and Filtering

`Store` provides powerful search and filter capabilities directly on your data.

```javascript
import { createStore } from '@superutils/store'

const store = createStore({
  name: 'products',
  // Pre-populate the storage with sample data
  initialValue: new Map([
    [1, { id: 1, name: 'Laptop', category: 'electronics', price: 1000 }],
    [2, { id: 2, name: 'Chair', category: 'furniture', price: 150 }],
  ]),
})

// Search for items using a query object
const searchResult = store.search({
  query: { category: 'electronics' },
})
console.log(searchResult) // [{ id: 1, name: 'Laptop', ... }]

// Filter items using a predicate
const expensiveItems = store.filter(val => val.price > 500)
```

### Attaching Business Logic: Store Augmentation

Using `createStore`, you can attach custom business logic to your store instance, allowing you to encapsulate operations without having to create a subclass.

```javascript
import { createStore } from '@superutils/store'

const getContext = store => ({
  // Context can be an object or a function that returns an object store => ({
  get isAuthenticated() {
    return store.has('token')
  },
  login: async () => {
    store.set('token', 'some-token')
  },
  logout: () => store.delete('token'),
})

const authStore = createStore(
  {
    initialValue: new Map(),
    name: 'auth',
  },
  getContext,
)

// Access your custom logic directly from the store instance
if (!authStore.isAuthenticated) {
  authStore.login().then(() => console.log('Logged in'))
}
```

### Object-based Store With Augmentation

`createObjectStore` supports augmentation the same way as `createStore`.

```typescript
import { createObjectStore } from '@superutils/store'
import fetch from '@superutils/fetch'

type UserProfile = {
  age: number
  name: string
  roles: string[]
}

const userStore = createObjectStore(
  {
    name: 'user-profile',
    initialValue: {
      age: 25,
      name: 'Jane Doe',
      roles: ['guest'],
    } as UserProfile,
  },
  store => ({
    promoteToAdmin() {
      // Update properties with type safety
      store.set('roles', roles => [...roles, 'admin'])
    },
  }),
)

userStore.promoteToAdmin()
console.log(userStore.get('roles')) // ['guest', 'admin']
```

### OOP: Subclassing Store

You can extend the `Store` class to create custom store implementations with specialized logic or default behaviors.

```typescript
import { Store } from '@superutils/store'

interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

class ProductStore extends Store<number, Product, false> {
  constructor(
    ...[name, options]: ConstructorParameters<
      typeof Store<number, Product, false>
    >
  ) {
    super(name, { ...options, delay: 100 }) // Set a default delay for this store type
  }

  getInStockProducts(limit?: number) {
    return this.filter(product => product.inStock, limit)
  }
}

const products = new ProductStore('my-products')
products.set(1, { id: 1, name: 'Laptop', price: 1200, inStock: true })
products.set(2, { id: 2, name: 'Mouse', price: 25, inStock: false })
console.log(products.getInStockProducts()) // Map { 1 => { id: 1, name: 'Laptop', price: 1200, inStock: true } }
```
