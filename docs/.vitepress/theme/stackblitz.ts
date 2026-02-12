import { debounce, fallbackIfFails, getValues, isObj } from '@superutils/core'
import fetch, { FetchAs } from '@superutils/fetch'
import sdk, {
	type EmbedOptions,
	type Project,
	type ProjectTemplate,
} from '@stackblitz/sdk'

export type ExternalFile = {
	src: string
}

export type PlaygroundProject = Partial<Project> & {
	/** The code to be used in the index.ts/js file (if not provided in the `project.files`) */
	code?: string
	files?: {
		[path: string]: string | ExternalFile
	}
	indexFile?: string
	language?: string
	/** Additional package.json script to be added to the project */
	scripts?: Record<string, string>
}

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
	// remove any direct file import using url
	delete dependencies['https:']
	return dependencies
}

// try now button to code blocks whenever route changes/content-updates
export const addTryNowBtnNListen = debounce(() => {
	const languages = [
		'typescript',
		'javascript',
		'ts',
		'js',
		'tsx',
		'jsx',
		'html',
		'htm',
	]
	const ICON_STACKBLITZ = `<svg style="display: inline-block" viewBox="0 0 28 28" aria-hidden="true" class="StackBlitzLogo-boltIcon-FmCUV StackBlitzLogo-boltIcon_blue-NgOER" height="18" width="18"><path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"></path></svg>`
	const tryBtnClass = 'try-button'

	languages
		.map(lang => getValues(document.querySelectorAll(`.language-${lang}`)))
		.flat()
		.filter(
			el =>
				!!el
				&& !!el.querySelector('code')
				&& !el.querySelector(`.${tryBtnClass}`), // avoid adding duplicate buttons
		)
		.forEach(codeBlock => {
			const lang = getValues(codeBlock.classList)
				.filter(x => x.startsWith('language-'))[0]
				.split('-')[1]
			const btn = `
					<div class="try-button-wrap">
						<a href="#" class="${tryBtnClass}" data-template="${lang}">
							${ICON_STACKBLITZ} Try Now!
						</a>
					</div>
				`
			codeBlock.innerHTML = btn + codeBlock.innerHTML
		})
	;(window as any).embedPlayground = embedPlayground
	document.body.removeEventListener('click', tryBtnClickHandler)
	document.body.addEventListener('click', tryBtnClickHandler)
}, 100)
/**
 *
 * @param project
 * @param element
 * @param embedOptions
 */
export const embedPlayground = async (
	project: PlaygroundProject = {} as PlaygroundProject,
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
		language = 'javascript',
		scripts = {},
		template = 'node',
	} = project
	const isTs = ['typescript', 'ts'].includes(language)
	const isHtml = ['htm', 'html', 'xhtml'].includes(language)
	const indexExt =
		{
			javascript: 'js',
			typescript: 'ts',
			html: 'html',
			htm: 'html',
		}[language] ?? language

	const indexFile = project.indexFile || `index.${indexExt}`
	const externalFiles = Object.keys(files).filter(x => isObj(files[x]))
	const externalFileUrls = externalFiles
		.map(x => (files[x] as ExternalFile).src)
		.map(x =>
			x.startsWith('./')
				? window.location.href + x.substring(2) //relative path to file
				: x.startsWith('/')
					? `${window.location.protocol}//${window.location.host}${x}`
					: x,
		)
	const externalContents = await Promise.all(
		externalFileUrls.map(src =>
			fallbackIfFails(
				fetch(src, {
					as: FetchAs.text,
					timeout: 10_000,
				}),
				[],
				`Failed to load external file: ${src}`, // if fails to load just replace with string
			),
		),
	)
	const filesWithContent: Record<string, string> = {
		...files,
		...externalFiles.reduce(
			(obj, key, index) => ({
				...obj,
				[key]: externalContents[index],
			}),
			{},
		),
	}
	const filesDep = Object.keys(filesWithContent).filter(x =>
		['ts', 'js', 'jsx', 'tsx'].includes(x.split('.').pop()),
	)
	const fileDependencies = filesDep
		.map(x => extractDependencies(filesWithContent[x]))
		.reduce((obj, next) => ({ ...obj, ...next }), {})
	const _project = {
		description: 'Try @superutils in embeded StackBlitz playground',
		title: 'Playground',
		...project,
		template:
			language !== template
				? template // specific template provided
				: isHtml
					? 'html'
					: 'node',
		files: {
			[indexFile]: code || '// Your code goes here',
			...filesWithContent,
			'package.json': JSON.stringify(
				{
					name: 'playground',
					private: true,
					dependencies: {
						...(isTs && {
							'@types/node': '^25.0.3',
							typescript: '^5.9.3',
						}),
						...(isHtml && {
							serve: 'latest',
						}),
						...(code && extractDependencies(code)),
						...fileDependencies,
						...dependencies,
					},
					scripts: {
						start: isTs
							? 'tsc --build && node index.js'
							: isHtml
								? 'serve -p 54321'
								: 'node index.js',
						...scripts,
					},
					type: 'module',
					...JSON.parse(files['package.json'] ?? '{}'),
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
	} as Project
	const _embedOptions = {
		height: 480,
		openFile: indexFile,
		view: isHtml ? 'preview' : 'default',
		...embedOptions,
	} as EmbedOptions

	return sdk.embedProject(element, _project, _embedOptions)
	// // embed playground into the DOM element
	// const embed = await sdk.embedProject(element, _project, _embedOptions)
	// // const snapshot = await embed.getFsSnapshot()
	// return embed
}

/** "Try Now" button click event handler */
export const tryBtnClickHandler = (event: PointerEvent) => {
	const target = event.target as HTMLElement
	if (!target.classList.contains('try-button')) return

	event.preventDefault()

	const language = (target.getAttribute('data-template')
		|| 'javascript') as ProjectTemplate
	const parent = target.closest(`.language-${language}`)

	const code = parent.querySelector('pre code')?.textContent
	code && embedPlayground({ code, language })
}
