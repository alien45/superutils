// import { fallbackIfFails } from '@utiils/core'
// import PromisE_fetchRaw from './fetchRaw'
// import PromisEBase from './PromisEBase'
// import { IPromisE, FetchArgs, FetchError, FetchOptions, FetchConf, FetchResult, FetchAs } from './types'
// import config from './config'

// /**
//  * @name    PromisE.fetch
//  * @summary makes a fetch request and returns JSON.
//  * Default options.headers["content-type"] is 'application/json'.
//  * Will reject promise if response status code is 2xx (200 <= status < 300).
//  *
//  * @param   {string|URL}    url
//  * @param   {AbortController} options.abortCtrl (optional)
//  * @param   {String}    options.method  (optional) Default: `"get"`
//  * @param   {Number}    opitons.timeout (optional) duration in milliseconds to abort the request if it takes longer.
//  * @param   {string}    options.parse   (optional) specify how to parse the result
//  */
// export function PromisE_fetch<T = unknown>(
// 	...[url, options = {}]: FetchArgs
// ): IPromisE<T> {
// 	options.as ??= FetchAs.json
// 	return PromisE_fetchRaw(url, options) as any as IPromisE<T>
// }

// export default PromisE_fetch