# @superutils

<!-- Add badges for build status, coverage, etc. here -->

<!-- [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) -->

`@superutils` is a collection of small, deliberately scoped TypeScript utilities built to solve recurring production problems without introducing hidden abstractions or unnecessary coupling.

While many of the foundational packages are dependency-free and framework-agnostic, some packages are intentionally designed to integrate closely with specific ecosystems such as React or RxJS, while still favoring explicit behavior and minimal surface area. Each package is designed to be usable on its own and makes its assumptions explicit, including any framework or runtime dependencies.

Many of these utilities have been evolving for nearly a decade across real-world codebases. The immediate predecessor to this project was the common-utils library developed and used in production at Totem Accounting, where these patterns were stress-tested under real user traffic, long-lived state, and operational constraints. @superutils is a cleaned-up, modular continuation of that work.

This library is built for engineers, myself included, who prefer simple, explicit APIs and modular & reusable tools with predictable behavior and long term maintainability.

## Table of Contents

- [Why @superutils exists](#why-superutils-exists)
- [Design philosophy](#design-philosophy)
- [Non-goals](#non-goals)
- [Packages](#packages)
- [Getting Started](#getting-started)
- [Contribute](#contribute)
- [License](#license)

## Why @superutils exists

Over the past several years, I kept encountering the same classes of problems across different products and teams: managing asynchronous behavior without losing observability, reducing repeated boilerplate around common workflows, and enforcing correctness at boundaries without obscuring control flow.

In multiple production systems, including my work at Totem Accounting, these problems were often solved ad hoc. Small helper functions would emerge, get copied across codebases, slowly diverge, and eventually become harder to reason about than the problems they were meant to solve. Existing libraries addressed parts of these needs, but often introduced opinionated abstractions, hidden state, or unnecessary coupling that made long-term maintenance harder.

Over time, certain patterns proved themselves. Utilities that were explicit, small in scope, and readable in one sitting survived repeated refactors, onboarding cycles, and real user traffic. @superutils is an extraction of those patterns into a modular, reusable form. It trades breadth and cleverness for clarity, explicit behavior, and predictable failure modes.

This library exists primarily because it reflects how I prefer to build systems myself: tools I am comfortable depending on in production, understanding fully, and maintaining over time.

The intent is to build utilities once, understand them fully, test them thoroughly, and feel comfortable reusing them across different systems and contexts.

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
      <td id="coverage_fetch"><div style="color:green">&#128153;&nbsp;99.01%</div></td>
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

All packages are scoped under `@superutils` and will be available on the NPM registry. You can install any package using your preferred package manager.

```bash
# Installing the @superutils/promise package
npm install @superutils/promise
```

Once installed, you can import the utilities directly into your project.

```typescript
import PromisE from '@superutils/promise'

const dp = PromisE.delay(1000)
console.log({
	pending: dp.pending,
	rejected: dp.rejected,
	resolved: dp.resolved,
})
// Prints: { pending: true, resolved: false, rejected: false }
await dp // waits 1 second
console.log({
	pending: dp.pending,
	rejected: dp.rejected,
	resolved: dp.resolved,
})
// Prints: { pending: false, resolved: true, rejected: false }
```

For more details please read the API reference for respective packages.

## Contribute

For contribution guidelines and development standards used in this project, see [CONTRIBUTING.md](_media/CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the `LICENSE` file in each package for more details.
