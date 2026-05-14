/** Check if the environment is browser */
export const isEnvBrowser = () =>
	typeof window !== 'undefined'
	&& typeof window.navigator !== 'undefined'
	&& typeof window.document !== 'undefined'

/** Check if the environment is Bun */
export const isEnvBun = () =>
	Object.hasOwn(globalThis, 'Bun')
	&& typeof process !== 'undefined'
	&& !!process.versions?.bun

/** Check if the environment is Deno */
export const isEnvDeno = () =>
	typeof (globalThis as unknown as { Deno?: { version: string } }).Deno
		?.version === 'string'

/** Check if the environment is mobile browser */
export const isEnvMobile = () =>
	isEnvBrowser()
	&& /Android|Adr|webOS|iPhone|iPad|iPod|iOS|BlackBerry|BB10|IEMobile|Opera Mini|Mobile|CriOS|FxiOS|Silk|Huawei|HUAWEI|Honor|EMUI|Mi(?:ui)?|Redmi|Poco|OPR\/|Vivo|Oppo|Lenovo|Pixel|SM-|GT-|Moto|Nexus/i.test(
		String(
			navigator.userAgent
				|| (window as unknown as { opera: string })?.opera,
		),
	)

/**
 * Check if the environment is NodeJS
 *
 * @param strict (optional) if false, will exclude bun
 */
export const isEnvNode = (strict = false) =>
	typeof process !== 'undefined'
	&& !!process.versions?.node
	&& (!strict || !process.versions?.bun)

/** Check if page is loaded on a touchscreen device */
export const isEnvTouchable = () =>
	'ontouchstart' in (window?.document?.documentElement ?? {})
