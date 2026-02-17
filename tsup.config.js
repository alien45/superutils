import fs from 'fs'
import path from 'path'
import { defineConfig } from 'tsup'

export default defineConfig((options = {}) => {
	const cwd = process.cwd()
	let pkgName = path.basename(cwd).replaceAll('-', '_')
	if (pkgName === 'promise') pkgName = 'PromisE'

	return [
		{ // standard ESM build (unminified)
			clean: true,
			dts: true,
			entry: ['src/index.ts'],
			external: [/^@superutils\/.*/],
			format: ['cjs', 'esm'],
			outDir: 'dist',
		},

		{ // minified solo build with no external depencencies, suitable for browsers
			clean: true,
			dts: false,
			format: ['iife'],
			entry: [
				fs.existsSync(path.join(cwd, 'src/browser.ts'))
					? 'src/browser.ts'
					: 'src/index.ts'

			],
			esbuildOptions: (options, context) => {
				// This forces the output filename and avoids tsup's default naming.
				options.outfile = 'dist/browser/index.min.js'
				// `outdir` & `splitting` must be unset when `outfile` is used.
				options.splitting = false
				options.outdir = undefined
			},
			globalName: `superutils.${pkgName}`,
			minify: true,
			noExternal: [/^@superutils\/.*/],
			outDir: 'dist/browser',
			platform: 'browser',
			sourcemap: true,
			treeshake: true,
		},
	].filter(Boolean)
})