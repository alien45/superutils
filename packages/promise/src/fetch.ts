import PromisE_fetchResponse from './fetchResponse'
import PromisEBase from './PromisEBase'
import { IPromisE, PromisE_FetchArgs } from './types'

/**
 * @name    PromisE.fetch
 * @summary makes a fetch request and returns JSON.
 * Default options.headers["content-type"] is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 * 
 * @param   {string|URL}      url
 * @param   {String}          options         (optional)
 * @param   {String}          options.method  (optional) Default: `"get"`
 * @param   {Number}          timeout         (optional) duration in milliseconds to abort the request if it takes longer.
 * @param   {AbortController} abortCtrl
 */
export function PromisE_fetch <T = unknown>(...args: PromisE_FetchArgs): IPromisE<T> {
    args[3] = args[3] ?? new AbortController()
    const _abortCtrl = args[3]
    const promise = new PromisEBase<T>(
        PromisE_fetchResponse(...args)
            .then(response => response.json())
    )

    // abort fetch request if promise is finalized manually before completion
    // by invoking `promise.reject()` or `promise.resolve()
    promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
    return promise
}
export default PromisE_fetch