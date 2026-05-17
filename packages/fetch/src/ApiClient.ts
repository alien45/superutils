import { isStr } from '@superutils/core'
import { DeferredAsyncOptions } from '@superutils/promise'
import createClient from './createClient'
import createPostClient from './createPostClient'
import mergeOptions from './mergeOptions'
import { FetchOptions, ExcludeOptions, FetchInterceptors } from './types'

/**
 * Configuration for the ApiClient instance.
 */
export type ApiClientConfig<
	/** Options that are enforced for every request and cannot be overridden. */
	FixedOptions extends ApiClientFetchOptions,
	/** Default options that can be overridden by individual request calls. */
	CommonOptions extends ExcludeOptions<FixedOptions, ApiClientFetchOptions>,
	CommonDelay extends number,
> = {
	commonOptions?: CommonOptions
	commonDeferOptions?: DeferredAsyncOptions<unknown, CommonDelay>
	errorPrefix?: string
	fixedOptions?: FixedOptions
	withBaseClients?: boolean
}
export type ApiClientFetchOptions = Omit<FetchOptions, 'method'>

/**
 * A fully encapsulated and isolated API client factory.
 *
 * ApiClient creates a sandboxed environment for a specific API service. It provides
 * complete isolation by ignoring global `fetch.defaults` by default, ensuring that instance-specific
 * configurations remain clean and predictable. It bundles RESTful methods and execution
 * controls (like debounce/throttle) into a single, cohesive unit.
 *
 * ### Key Features:
 * - **Isolation**: Instance-specific options are scoped to this client and isolated from other instances.
 * - **Base Resolution**: Automatic path joining when `apiBaseUrl` is provided.
 * - **Unified Error Handling**: Optional `errorPrefix` to namespace errors for easier debugging.
 * - **Method Suite**: Integrated `delete`, `get`, `head`, `options`, `patch`, `post` and `put` methods.
 *
 * ### Precedence & Merging Nuances
 * - **Options follow a strict hierarchy**: `fixedOptions` > `call options` > `commonOptions`.
 * - Global `fetch.defaults` are ignored by default.
 * - **Headers**: Merged by key. Specifying headers in a call overrides common headers with the
 *   same name, but does NOT remove or replace the entire header set.
 * - **Interceptors**: Cumulative. Interceptors from all levels are concatenated and executed
 *   sequentially (Common -> Call -> Fixed). They cannot be overridden or replaced.
 * - **Error Messages**: Merged by key, allowing per-service or per-call customization of
 *   specific error strings without losing the rest of the global message set.
 */
export class ApiClient<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	FixedOptions extends ApiClientFetchOptions = {}, // "{}" is required to correct infer common options
	CommonOptions extends ExcludeOptions<FixedOptions, ApiClientFetchOptions> =
		ExcludeOptions<FixedOptions, ApiClientFetchOptions>,
	CommonDelay extends number = number,
> {
	/** The base GET-style client. Defaults to GET method. */
	public readonly client!: ReturnType<
		typeof createClient<FixedOptions, CommonOptions, CommonDelay>
	>

	/** The base POST-style client. Defaults to POST method and supports request bodies. */
	public readonly postClient!: ReturnType<
		typeof createPostClient<FixedOptions, CommonOptions, CommonDelay>
	>

	/** Alias for postClient with DELETE method. */
	public readonly delete!: typeof this.postClient

	/** Alias for client with GET method. */
	public readonly get!: typeof this.client

	/** Alias for client with HEAD method. */
	public readonly head!: typeof this.client

	/** Alias for client with OPTIONS method. */
	public readonly options!: typeof this.client

	/** Alias for postClient with POST method. */
	public readonly post!: typeof this.postClient

	/** Alias for postClient with PUT method. */
	public readonly put!: typeof this.postClient

	/** Alias for postClient with PATCH method. */
	public readonly patch!: typeof this.postClient

	/**
	 * Creates a new ApiClient instance.
	 *
	 * @param apiBaseUrl - The base URL for the API. Relative paths passed to methods will be appended to this.
	 * @param config - Optional configuration for headers, interceptors, and default behavior.
	 */
	constructor(
		public apiBaseUrl?: string,
		config: ApiClientConfig<FixedOptions, CommonOptions, CommonDelay> = {},
	) {
		const {
			errorPrefix,
			fixedOptions = {} as FixedOptions,
			commonOptions = {} as CommonOptions,
			commonDeferOptions = {},
			withBaseClients = true,
		} = config
		const interceptors: FetchInterceptors = {}
		if (errorPrefix)
			interceptors.error = [
				err => {
					err.message = `${errorPrefix} ${err.message}`
					return err
				},
			]

		if (isStr(this.apiBaseUrl)) {
			interceptors.request = [
				url => {
					const useBaseUrl =
						isStr(url)
						&& !url.startsWith('http://')
						&& !url.startsWith('https://')
						&& !url.startsWith(this.apiBaseUrl!)
					if (useBaseUrl) url = `${this.apiBaseUrl}${url as string}`
					return url
				},
			]
		}

		const getMethods = [
			withBaseClients ? 'client' : '',
			'get',
			'head',
			'options',
		].filter(Boolean)
		const postMethods = [
			withBaseClients ? 'postClient' : '',
			'delete',
			'patch',
			'post',
			'put',
		].filter(Boolean)
		const methods = [...getMethods, ...postMethods].reduce(
			(obj, method) => {
				const isBaseClient = method.toLowerCase().includes('client')
				const _createClient = (
					getMethods.includes(method)
						? createClient
						: createPostClient
				) as typeof createClient

				return {
					[method]: {
						enumerable: false,
						value: _createClient(
							mergeOptions(fixedOptions, {
								interceptors,
								method: isBaseClient
									? undefined
									: method.toUpperCase(),
							}),
							{ ignoreGlobalDefaults: true, ...commonOptions },
							commonDeferOptions,
						),
						writable: false,
					},
					...obj,
				}
			},
			{},
		)
		Object.defineProperties(this, methods)
	}
}

export default ApiClient
