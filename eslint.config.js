import globals from 'globals'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	// Ignores can be defined globally
	{ ignores: ['dist', 'node_modules'] },

	// ESLint's recommended rules for all JS files
	js.configs.recommended,

	// TypeScript specific rules for TS files
	{
		files: ['**/*.{ts,tsx}'],
		extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {},
	},
	// This must be the last config to override other configs
	prettierConfig,
)
