import { defineConfig } from 'vitest/config'

export default defineConfig(config => {
	const port = Number(process.env.API_PORT) || 3000
	const strictPort = `${process.env.API_STRICT_PORT}`.toLowerCase() === 'true'
	const host = process.env.API_HOST || 'localhost'
	const pkg = process.env.PKG || '*' // "*" => all packages
	const coverage = `${process.env.COVERAGE}`.toLowerCase() === 'true'
	const skipFull = `${process.env.SKIP_FULL}`.toLowerCase() === 'true'
	const runOnce = `${process.env.RUN}`.toLowerCase() === 'true'
	const ui = `${process.env.UI}`.toLowerCase() === 'true'
	const exclude = [
		'coverage',
		'**/*.config.js',
		'docs',
		'**/dist/**',
		'**/node_modules/**',
		'packages/*/dist/',
		'packages/demo',
		'vitest.config.ts',
		// Exclude helper/utility files from test directories
		'**/*/{tests,test}/**/!(*.{test,spec}).{ts,tsx}',
	]
	console.log('\nTest Package(s):', pkg !== '*' ? pkg : 'All', '\n')
	return {
		test: {
			api: {
				host,
				port,
				strictPort,
			},
			...(coverage && {
				coverage: {
					enabled: true,
					exclude,
					provider: 'v8',
					reporter: ['text', 'json', 'html'],
					reportsDirectory: './coverage',
					skipFull,
				},
			}),
			environment: 'node',
			globals: true,
			headless: true,
			exclude,
			include: [
				`packages/${pkg}/**/*.{test,spec}.{ts,tsx}`,
				`packages/${pkg}/test/*.{ts,tsx}`,
			],
			ui,
			watch: !runOnce,
		},
	}
})
