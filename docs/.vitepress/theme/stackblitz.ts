import sdk, {
	type EmbedOptions,
	type Project,
	type ProjectTemplate,
} from '@stackblitz/sdk'

export const extractDependencies = (code: string) => {
	const dependencies = {}
	// Matches: import ... from 'pkg' OR import 'pkg'
	const regex =
		/(?:import\s+(?:type\s+)?[\s\S]*?\s+from\s+|import\s+)['"]([^'"]+)['"]/g
	let match: unknown

	while ((match = regex.exec(code)) !== null) {
		const pkg = match[1]
		if (pkg.startsWith('.') || pkg.startsWith('/')) continue

		const parts = pkg.split('/')
		const name = pkg.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
		dependencies[name] = 'latest'
	}
	return dependencies
}

/**
 *
 * @param project
 * @param element
 * @param embedOptions
 */
export const embedPlayground = (
	project: Partial<Project> & {
		/** The code to be used in the index.ts/js file (if not provided in the `project.files`) */
		code?: string
		/** Additional package.json script to be added to the project */
		scripts?: Record<string, string>
	} = {} as any,
	/** Element or selector to embed the playground in */
	element?: string | HTMLElement,
	embedOptions: EmbedOptions = {},
) => {
	embedOptions.crossOriginIsolated ??= false
	if (!element) {
		// if element or selector is not provided, open playground on a modal
		const modal = document.createElement('div')
		modal.classList.add('modal', 'playground')
		modal.style = `
			background: var(--vp-c-bg);
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100%;
			background: black;
			padding: 35px 0 0;
			z-index: 99999;
		`

		const closeButton = document.createElement('div')
		const closeStyle = `
			background: #32363f;
			border: 1px solid grey;
			border-radius: 5px;
			cursor: pointer;
			left: 0;
			position: fixed;
			right: 0;
			padding: 5px 10px;
			text-align: center;
			top: 0;
		`
		closeButton.classList.add('close')
		closeButton.onmouseenter = () => {
			closeButton.style = `${closeStyle};background: black;`
		}
		closeButton.onmouseleave = () => {
			closeButton.style = closeStyle
		}
		closeButton.onclick = () => modal.remove()
		closeButton.style = closeStyle
		closeButton.textContent = 'Close Playground'
		modal.appendChild(closeButton)

		const playground = document.createElement('div')
		playground.classList.add('stackblitz')
		modal.appendChild(playground)
		document.body.appendChild(modal)
		element = document.querySelector(
			`.modal.playground > .stackblitz`,
		) as HTMLElement

		embedOptions.height = '100%'
	} else if (typeof element === 'string') {
		// assume query selector and embed playground in the element
		element =
			document.getElementById(element)
			?? (document.querySelector(element) as HTMLElement)
	}
	if (!element)
		return console.error('Element not found to embed the playground!')

	const {
		code = '',
		dependencies = {},
		files = {},
		scripts = {},
		template = 'javascript',
	} = project
	const isTs = ['typescript', 'ts'].includes(template)
	const indexFile = `index.${isTs ? 'ts' : 'js'}`

	const pkgJson = JSON.parse(files['package.json'] ?? '{}')
	// embed playground into the DOM element
	sdk.embedProject(
		element,
		{
			...project,
			title: 'Playground',
			template: 'node',
			files: {
				[indexFile]: code || '// Your code goes here',
				...files,
				'package.json': JSON.stringify(
					{
						name: 'playground',
						private: true,
						dependencies: {
							...(isTs && {
								'@types/node': '^25.0.3',
								typescript: '^5.9.3',
							}),
							...(code && extractDependencies(code)),
							...dependencies,
						},
						scripts: {
							start: `${isTs ? 'tsc --build && ' : ''}node index.js`,
							...scripts,
						},
						type: 'module',
						...pkgJson,
					},
					null,
					4,
				),
				...(isTs && {
					'tsconfig.json': JSON.stringify(
						{
							compilerOptions: {
								// declaration: true,
								esModuleInterop: true,
								forceConsistentCasingInFileNames: true,
								lib: ['ESNext'],
								module: 'ESNext',
								moduleResolution: 'bundler',
								resolveJsonModule: true,
								strict: true,
								skipLibCheck: true,
								target: 'ESNext',
							},
						},
						null,
						4,
					),
				}),
			},
		},
		{
			height: 480,
			openFile: indexFile,
			...embedOptions,
		},
	)
}

/** "Try Now" button click event handler */
export const tryBtnClickHandler = (event: PointerEvent) => {
	const target = event.target as HTMLElement
	if (!target.classList.contains('try-button')) return

	event.preventDefault()

	const parent = target.closest('.try-button-wrap')
	const className = `temp-${new Date().getTime()}`
	parent.classList.add(className)

	const template = (target.getAttribute('data-template')
		|| 'javascript') as ProjectTemplate
	const code = document.querySelector(
		`.try-button-wrap.${className}+.language-${template} > pre`,
	)?.textContent
	parent.classList.remove(className)
	embedPlayground({ code, template })
}
