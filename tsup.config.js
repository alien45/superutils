import { defineConfig } from 'tsup'

export default defineConfig({
	// All packages in this monorepo are external.
	// They should not be bundled, only imported.
	external: [
		// Matches @superutils/core, @superutils/promise, etc.
		/^@superutils\/.*/,
	],
	// ... any other shared tsup options can go here
})
