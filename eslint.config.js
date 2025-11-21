import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

const languageOptions = {
	parserOptions: {
		project: true,
		projectService: true,
		tsconfigRootDir: import.meta.dirname,
	},
}
// Ignores can be defined globally
const ignores = [
	'coverage',
	'dist',
	'docs',
	'node_modules',
	'packages/*/dist',
	'packages/*/tests',
	'packages/demo',
	'scripts',
	'*.js',
]
export default defineConfig(
	{ ignores },
	// ESLint's recommended rules for all JS files
	js.configs.recommended,

	// TypeScript specific rules for TS files
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions,
	},
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['./packages/**/*.{ts,tsx}'],
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					args: 'none', // Ignore all arguments for type definitions
					argsIgnorePattern: '^_$|^_.*$',
					caughtErrors: 'none', // Allow unused variables in catch blocks
					ignoreRestSiblings: true,
					vars: 'all',
					varsIgnorePattern: '^_$|^_.*$',
				},
			],

			// Allow `type` and `interface`
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/no-unused-expressions': 'off',
			'no-prototype-builtins': 'off', // complains about obj.hasOwnProperty()
			// '@typescript-eslint/no-floating-promises': 'off',
			// '@typescript-eslint/no-misused-promises': 'off',

			// // ToDo: remove
			// '@typescript-eslint/no-inferrable-types': 'off',
			// '@typescript-eslint/no-explicit-any': 'off',
		},
	},
	// This must be the last config to override other configs
	prettierConfig,
)
