# @superutils

<!-- Add badges for build status, coverage, etc. here -->

<!-- [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) -->

`@superutils` is a collection of small, battle-tested TypeScript utilities for solving recurring production problems without hidden abstractions. Evolved from patterns proven over a decade in real-world systems, the library includes both framework-agnostic utilities and packages tailored for ecosystems like React. Each tool is designed to be modular, explicit, and maintainable, reflecting a preference for simple and reliable building blocks.

## Table of Contents

- [Why @superutils exists](#why-superutils-exists)
- [Design philosophy](#design-philosophy)
- [Non-goals](#non-goals)
- [Packages](#packages)
- [Getting Started](#getting-started)
- [Contribute](#contribute)
- [License](#license)

## Why @superutils exists

Over the years, I kept encountering the same recurring problems across different teams and products: managing async flows cleanly, reducing repeated boilerplate, and enforcing correctness without hiding control flow. In production systems, including my work at Totem Accounting, many of these solutions were built ad hoc and slowly drifted across codebases, which I later consolidated into a single repository. That repository, however, still carried project-specific assumptions and needed further modularization and cleaner abstractions to become truly reusable across different systems.

@superutils is a distillation of the patterns that consistently held up. It focuses on small, explicit, production-ready utilities that prioritize clarity, predictable behavior, and long-term maintainability over clever abstractions.

## Design philosophy

- Utilities should be small enough to understand in one sitting
- APIs should be explicit and unsurprising
- Systems should be fault-tolerant, with failure remaining observable when needed
- Defaults should be conservative and opt-in
- Types should aid correctness without obscuring runtime behavior

### Non-goals

- Not a framework or application architecture
- Not a monolithic utility bundle
- No hidden global state or implicit side effects
- No runtime magic, patching, or environment mutation
- No attempt to abstract away fundamental complexity

## Packages

This monorepo contains the following packages. Each is independently versioned and published to NPM.

<table>
  <thead>
    <tr>
      <th><a href="https://www.npmjs.com/org/superutils">NPM Package</a></th>
      <th>Description</th>
      <th>Test Coverage</th>
      <th><a href="https://alien45.github.io/superutils">Docs</a></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/@superutils/core">
          <code>@superutils/core</code>
        </a>
      </td>
      <td>
        A collection of lightweight, dependency-free utility functions and types.
        <br />
        <b><i>Why:</i></b> prevents copy-pasted helpers from drifting across codebases.
      </td>
      <td id="coverage_core"><div style="color:green">&#128152;&nbsp;100%</div></td>
      <td><a href="https://alien45.github.io/superutils/packages/@superutils/core/">View</a></td>
    </tr>
    <tr>
      <td><a href="https://www.npmjs.com/package/@superutils/fetch"><code>@superutils/fetch</code></a></td>
      <td>
        A lightweight <code>fetch</code> wrapper for browsers and Node.js, designed to simplify data fetching and reduce boilerplate.
        <br />
        <b><i>Why:</i></b> address recurring production issues around retries, cancellation, and request lifecycles in a consistent, observable way.
      </td>
      <td id="coverage_fetch"><div style="color:green">&#128152;&nbsp;100%</div></td>
      <td><a href="https://alien45.github.io/superutils/packages/@superutils/fetch/">View</a></td>
    </tr>
    <tr>
      <td>
        <a href="https://www.npmjs.com/package/@superutils/promise">
          <code>@superutils/promise</code>
        </a>
      </td>
      <td>
        An extended Promise with additional features such as status tracking, deferred/throttled execution, timeout and retry mechanism.
        <br />
        <b><i>Why:</i></b> provide shared async primitives used across higher-level utilities.
      </td>
      <td id="coverage_promise"><div style="color:green">&#128152;&nbsp;100%</div></td>
      <td><a href="https://alien45.github.io/superutils/packages/@superutils/promise/">View</a></td>
    </tr>
    <tr>
      <td>
        <code>@superutils/react</code>
      </td>
      <td>A collection of React hooks and components for common UI patterns and state management.</td>
      <td id="coverage_react"><div style="color:gray">&#128221;&nbsp;Planned</div></td>
      <td><a href="https://alien45.github.io/superutils/packages/@superutils/react/">View</a></td>
    </tr>
    <tr>
      <td>
        <code>@superutils/rx</code>
      </td>
      <td>
        A set of small, focused utilities for working with RxJS observables and subjects.
        <br />
        <b><i>Why:</i></b> avoid re-implementing common RxJS subject and lifecycle patterns across codebases
      </td>
      <td id="coverage_rx"><div style="color:gray">&#128221;&nbsp;Planned</div></td>
      <td><a href="https://alien45.github.io/superutils/packages/@superutils/rx/">View</a></td>
    </tr>
  </tbody>
</table>

## Getting Started

### NPM

All packages are scoped under `@superutils` and will be available on the NPM registry. You can install any package using your preferred package manager (e.g., `npm`, `yarn`, `pnpm`, `bun`, etc.).

```bash
# Installing the @superutils/fetch package
npm install @superutils/fetch
```

Once installed, you can import the utilities directly into your project.

```typescript
import fetch from '@superutils/fetch'

fetch
	.get('[DUMMYJSON-DOT-COM]/products', {
		interceptors: {
			// transform result
			result: products =>
				products.map(p => ({
					...p,
					updated: new Date().toISOString(),
				})),
		},
		timeout: 5000,
	})
	.then(console.log)
```

### CDN / Browser

If you are not using a bundler, you can include the minified browser build directly:

```xml
<script src="https://unpkg.com/@superutils/fetch@latest/dist/browser/index.min.js"></script>
```

OR,

```xml
<script src="https://cdn.jsdelivr.net/npm/@superutils/fetch@latest/dist/browser/index.min.js"></script>
```

This exposes a global `superutils` object containing the exports of any loaded packages:

```javascript
superutils.core // All exports from `@superutils/core`
superutils.fetch // Default export (function) from `@superutils/fetch` + named exports
superutils.PromisE // Default export (class) from `@superutils/promise` + named exports
```

For more details please read the API reference for respective packages.

## Contribute

For contribution guidelines and development standards used in this project, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the `LICENSE` file in each package for more details.
