# @superutils

<!-- Add badges for build status, coverage, etc. here -->

<!-- [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) -->

`@superutils` is a compilation of re-usable, high-quality tools and utilities for TypeScript that have been developed and refined over many years. The collection aims to solve common real-world problems with elegant, robust, practical and well-tested solutions.

## Packages

This monorepo contains the following packages. Each is independently versioned and published to NPM.

| Package               | NPM Version                                               | Description                                                                             |
| :-------------------- | :-------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `@superutils/core`    | [!npm](https://www.npmjs.com/package/@superutils/core)    | A collection of lightweight, dependency-free utility functions and types.               |
| `@superutils/promise` | [!npm](https://www.npmjs.com/package/@superutils/promise) | An extended Promise with status tracking, deferred execution, and cancellable fetch.    |
| `@superutils/react`   | [!npm](https://www.npmjs.com/package/@superutils/react)   | A collection of React hooks and components for common UI patterns and state management. |
| `@superutils/rx`      | [!npm](https://www.npmjs.com/package/@superutils/rx)      | A suite of powerful operators and utilities for working with RxJS observables.          |

## Getting Started

All packages are scoped under `@superutils` and will be available on the NPM registry. You can install any package using your preferred package manager.

```bash
# Example: Installing the @superutils/promise package
npm install @superutils/core @superutils/promise
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
await dp // waits 1 seconds
console.log({
	pending: dp.pending,
	rejected: dp.rejected,
	resolved: dp.resolved,
})
// Prints: { pending: false, resolved: true, rejected: false }
```

For more details please read the API reference for respective packages.

## Contribute

Contributions are welcome! If you'd like to help improve `@superutils`, please feel free to open an issue to discuss a new feature or submit a pull request.

### Pull Request Guidelines

To ensure a smooth and effective review process, please follow these guidelines when submitting a pull request:

- **Detailed Description**: Provide a clear and comprehensive description of the problem you are solving or the feature you are adding. Explain the "why" behind your changes.
- **Testing**: Include tests for any new features or bug fixes, aiming for 100% code coverage. Ensure that all existing tests continue to pass. Use the `npm test` command to run the test suite.
- **Code Style**: Make sure your code adheres to the existing style of the project. Run `npm run lint` to check for any linting issues.
- **Documentation**: If you are adding a new feature or changing an existing one, update the relevant documentation. This includes JSDoc comments (with code examples for new/changed features) and any package-specific `README.md` files.
- **One PR per Feature**: Keep pull requests focused on a single feature or bug fix. This makes them easier to review and merge.
- **Link to an Issue**: If your pull request addresses an existing issue, please link to it in the PR description.
    - Use keywords like `Closes #123`, `Fixes #123`, or `Resolves #123` if the PR fully completes the work described in the issue. This will automatically close the issue when the PR is merged.
    - For partial implementations or related work, simply reference the issue number (e.g., `Related to #123`) to create a link without closing the issue.
- **Work in Progress & Commit History**: For work that is not yet ready for a full review, please use GitHub's **Draft Pull Request** feature. While it's fine to have temporary "WIP" commits on your feature branch during development, please clean up your commit history before marking the PR as "Ready for Review". Use an interactive rebase (`git rebase -i`) to squash temporary commits into logical, well-described units of work that adhere to our commit message guidelines.
- **Commit Messages**: Follow the Conventional Commits specification. This helps maintain a clear project history and enables automated changelog generation. Each final commit message should have the following format:

    ```
    <type>(<scope>): <subject>
    <BLANK LINE>
    [optional body]
    <BLANK LINE>
    [optional footer]
    ```

    - **Type**: Must be one of the following:
        - `feat`: A new feature.
        - `fix`: A bug fix.
        - `docs`: Documentation only changes.
        - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
        - `refactor`: A code change that neither fixes a bug nor adds a feature.
        - `perf`: A code change that improves performance.
        - `test`: Adding missing tests or correcting existing tests.
        - `build`: Changes that affect the build system or external dependencies.
        - `ci`: Changes to our CI configuration files and scripts.
        - `chore`: Other changes that don't modify `src` or `test` files.
    - **Scope**: The full package name affected by the change (e.g., `core`, `promise`). For changes that affect the entire repository (like build scripts or documentation), you can use a general scope like `repo` or `docs`.

- **Breaking Changes**: Clearly identify any breaking changes in your PR description and in the commit message footer (e.g., `BREAKING CHANGE: ...`), including the justification and a migration guide for users.

Here are a few examples:

- A new feature in the 'promise' package

    ```bash
    feat(promise): add deferred execution utility
    ```

- A bug fix in the 'core' package

    ```bash
    fix(core): correct type inference for isObject functio. Fixes #123.
    ```

- A documentation update for the 'react' package

    ```bash
    docs(react): add usage examples for useDebounce hook
    ```

- A commit with a body and a breaking change

    ```bash
    refactor(core): rewrite deepClone to improve performance

    The previous implementation used recursion, which could lead to stack overflows on very deep objects. The new implementation uses an iterative approach with a stack to avoid this issue.

    BREAKING CHANGE: The `deepClone` function no longer clones functions or Symbols. It now only clones plain objects, arrays, and primitives.
    ```

### Development Setup

To contribute to `@superutils`, you'll first need to set up the monorepo on your local machine. This project uses `npm` workspaces to manage dependencies and link local packages.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/alien45/superutils.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd superutils
    ```

3.  **Install dependencies:**
    This command will install all dependencies for the root project and all packages within the workspace, and it will automatically create symbolic links between them.
    ```bash
    npm i
    ```

### Scripts

The following scripts are available at the root level to help with development:

- `npm run build`
  Incrementally builds all packages in the `packages/*` directory.

- `npm run build:watch`
  Starts the incremental build process in watch mode for all packages.

- `npm run clean`
  Cleans all build artifacts.

- `npm run clean:purge` <span id="script-clean-purge"> </span>
  Removes all `dist/*` files before cleaning all build artifacts.

    > [!warning]
    > _This script uses `rm -rf` for cleaning. While `npm` often provides cross-platform compatibility for such commands, users on Windows might need a Unix-like environment (e.g., Git Bash or WSL) for it to function correctly._

- `npm run docs:dev`
  Builds the API documentation and starts the VitePress development server, accessible at `http://localhost:5173`.

- `npm run lint`
  Lints the entire codebase using ESLint.

- `npm start`
  Cleans and starts build process in watch mode.
  Uses: `build:watch` and <a href="#script-clean-purge">`clean:purge`</a>

- `npm test`
  Runs the test suite. It runs the `scripts/test.sh` script which both accepts environment variables and/or a colon-delimited command argument.

    **Supported environment variables:**
    - `PKG`: name of the package to test. Accepts:
        - `*` (default, test all packages),
        - `core`
        - `promise`
        - `react`
        - or any other directory name under `packages/` directory
    - `UI`: start the interactive Vitest UI server and open in a browser. Accepts: `true` / `false`.
    - `RUN`: run test only once and exit immediately. Accepts: `true` / `false`.
    - `COVERAGE`: enable/disable code coverage. Accepts: `true` / `false`.

    **Command Argument:**

    For a more streamlined workflow, you can combine the package and options into a single, colon-delimited argument with the following structure:
    `npm test [package][:option1][:option2]...`

    | Option     | Alias | Description                                | Default |
    | :--------- | :---- | :----------------------------------------- | :------ |
    | `ui`       |       | Opens the interactive Vitest UI.           | `""`    |
    | `run`      | `1`   | Runs tests once and exits (no watch mode). | `""`    |
    | `coverage` | `%`   | Generates a code coverage report.          | `""`    |

    **Note:**
    - If `package` is omitted (e.g., `npm test :ui`), tests will run for all packages.
    - You can combine both environment variables and the options above. However, if there's a conflict, the options take precedence.
      **Examples:**

    | Command                      | Action                                                                          |
    | :--------------------------- | :------------------------------------------------------------------------------ |
    | `npm test`                   | Watch and run all tests for all packages.                                       |
    | `npm test :1`                | Run all tests for all packages only once and exit immediately.                  |
    | `UI=true npm test promise:%` | Watch and test only `promise` package with UI and coverage.                     |
    | `npm test :%:ui`             | Same as above                                                                   |
    | `UI=false npm test :ui`      | Run test and open UI. PS: environment variable `UI` is overriden by `:ui` flag. |

## License

This project is licensed under the MIT License. See the `LICENSE` file in each package for more details.
