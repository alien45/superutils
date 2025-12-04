/** Check if the environment is Browser */
export const isEnvBrowser = () =>
	typeof window !== 'undefined' && typeof window?.document !== 'undefined'

/** Check if the environment is NodeJS */
export const isEnvNode = () =>
	typeof process !== 'undefined' && process?.versions?.node != null

/** Check if page is loaded on a touchscreen device */
export const isEnvTouchable = () =>
	typeof window !== 'undefined'
	&& 'ontouchstart' in (window?.document?.documentElement ?? {})
