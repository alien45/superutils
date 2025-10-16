# @superutils/core

Core utilities and types used by other `@superutils` packages.

## Installation

```bash
npm install @superutils/core
```

## Usage

### `deferred(fn)`

```typescript

import { deferred } from '@superutils/core'

const handleChange = deferred(
    event => console.log(event.target.value),
    300 // debounce delay in milliseconds
)
handleChange({ target: { value 1 } }) // will be ignored
handleChange({ target: { value 2 } }) // will be ignored
handleChange({ target: { value 3 } }) // will be executed
```
