import { isFn, isObj, isStr } from '@superutils/core'
import { DeferredAsyncOptions } from '@superutils/promise'
import createClient from './createClient'
import createPostClient from './createPostClient'
import mergeOptions from './mergeOptions'
import {
	FetchOptions,
	ExcludeOptions,
	FetchInterceptors,
	GET_METHODS,
	POST_METHODS,
} from './types'

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
}
export type ApiClientFetchOptions = Omit<FetchOptions, 'method'>

const URL_REGEX = /^(?:https?:)?\/\//i

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
	FixedOptions extends ApiClientFetchOptions = {}, // "{}" is required to correctly infer common options
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
	 * @param baseUrl - The base URL for the API. Relative paths passed to methods will be appended to this.
	 * @param config - Optional configuration for headers, interceptors, and default behavior.
	 */
	constructor(
		public baseUrl?: string | null,
		config: ApiClientConfig<FixedOptions, CommonOptions, CommonDelay> = {},
	) {
		const {
			errorPrefix,
			fixedOptions = {} as FixedOptions,
			commonDeferOptions = {},
		} = config
		let { commonOptions = {} as CommonOptions } = config

		if (this.baseUrl?.endsWith('/'))
			this.baseUrl = this.baseUrl.slice(0, -1)

		// make sure "method" and "body" are non-existent from both options
		Reflect.deleteProperty(fixedOptions, 'body')
		Reflect.deleteProperty(fixedOptions, 'method')
		Reflect.deleteProperty(commonOptions, 'body')
		Reflect.deleteProperty(commonOptions, 'method')

		// add interceptors to to common options, to be executed before user-provided interceptors
		const interceptors: FetchInterceptors = {
			error: !errorPrefix
				? undefined
				: err => {
						err.message = `${errorPrefix} ${err.message}`
						return err
					},
			request: !isStr(this.baseUrl)
				? undefined
				: url =>
						isStr(url)
						&& !URL_REGEX.test(url)
						&& !!this.baseUrl
						&& !url.startsWith(this.baseUrl)
							? `${this.baseUrl}${url.startsWith('/') ? url : `/${url}`}`
							: url,
		}
		commonOptions = mergeOptions(
			{ ignoreGlobalDefaults: true, interceptors },
			commonOptions,
		) as CommonOptions
		this.client = createClient(
			fixedOptions,
			commonOptions,
			commonDeferOptions,
		)
		this.postClient = createPostClient(
			fixedOptions,
			commonOptions,
			commonDeferOptions,
		)

		Object.defineProperties(
			this,
			[...GET_METHODS, ...POST_METHODS].reduce((obj, method) => {
				obj[method.toLowerCase()] = {
					enumerable: false,
					value: createMethodProxy(
						this,
						method,
						!GET_METHODS.includes(
							method as (typeof GET_METHODS)[number],
						),
					),
					writable: false,
				}
				return obj
			}, {} as PropertyDescriptorMap),
		)
	}
}
export default ApiClient

const addMethodToOptions = (
	args: unknown[],
	optionsIndex: number,
	method: string,
) => {
	if (!isObj(args[optionsIndex])) args[optionsIndex] = {}
	;(args[optionsIndex] as FetchOptions).method = method
	return args
}

/**
 * Create proxy traps to intercept calls to ApiClient methods and their respective .deferred() functions to:
 * 1. re-use the appropriate base client instead of creating base client for each method
 * 2. enforce respective HTTP method
 */
const createMethodProxy = (
	instance: ApiClient,
	method: string,
	isPost = false,
	baseClient = isPost ? instance.postClient : instance.client,
) =>
	new Proxy(baseClient, {
		// trap to enforce options.method into instance[METHOD]() calls
		apply: (
			_target,
			thisArg: unknown,
			args: Parameters<typeof baseClient>,
		) =>
			Reflect.apply(
				baseClient,
				thisArg,
				addMethodToOptions(args, isPost ? 2 : 1, method),
			) as typeof baseClient,
		// trap to enforce options.method into individual .deferred()() calls
		get: (_target, propName: string) => {
			const propVal = Reflect.get(
				baseClient,
				propName,
			) as (typeof baseClient)[keyof typeof baseClient]
			if (propName !== 'deferred' || !isFn(propVal)) return propVal

			const deferred = (...args: unknown[]) => {
				const deferredFn = Reflect.apply(
					propVal,
					baseClient,
					args,
				) as (typeof baseClient)['deferred']

				let optionsIndex = isPost ? 2 : 1
				if (args[1] !== undefined) optionsIndex-- // defaultUrl provided
				if (isPost && args[2] !== undefined) optionsIndex-- // defaultData provided

				return new Proxy(deferredFn, {
					apply: (target, thisArg, callArgs) =>
						Reflect.apply(
							target,
							thisArg,
							addMethodToOptions(callArgs, optionsIndex, method),
						) as ReturnType<(typeof baseClient)['deferred']>,
				})
			}
			return deferred
		},
	})
