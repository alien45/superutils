import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	// Ignores can be defined globally
	{ ignores: ['dist', 'node_modules'] },

	// ESLint's recommended rules for all JS files
	js.configs.recommended,

	// TypeScript specific rules for TS files
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// Allow `type` and `interface`
			'@typescript-eslint/consistent-type-definitions': 'off',
		},
	},
	// This must be the last config to override other configs
	prettierConfig,
)
