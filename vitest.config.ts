import { defineConfig } from 'vitest/config'

export default defineConfig((config) => {
	// Read PKG from env or default to all
	const pkg = process.env.PKG || '*' // "*" => all packages
	const runOnce = `${process.env.RUN}`.toLowerCase() === 'true' || undefined
	const ui = !runOnce && `${process.env.UI}`.toLowerCase() === 'true' || undefined

	return {
		test: {
			api: {
				host: process.env.API_HOST || 'localhost', // use IPv4
				port: Number(process.env.API_PORT) || 3000,
				strictPort: true,
			},
			environment: 'node',
			globals: true,
			headless: true,
			include: [
				`packages/${pkg}/**/*.test.ts`,
				`packages/${pkg}/**/*.spec.ts`,
				`packages/${pkg}/**/*.test.tsx`,
				`packages/${pkg}/**/*.spec.tsx`,
			],
			ui,
			watch: !runOnce,
		},
	}
})