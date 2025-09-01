import { PromisE } from './PromisE'

/**
 * @name    PromisE.fetch
 * @summary makes a fetch request and returns JSON.
 * Default options.headers["content-type"] is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 * 
 * @param   {string|URL} url
 * @param   {String}    options.method  (optional) Default: `"get"`
 * @param   {Number}    timeout         (optional) duration in milliseconds to abort the request if it takes longer.
 */
export function PromisE_fetch <T = unknown>(
    ...args: Parameters<typeof PromisE.fetchResponse>
) {
    return new PromisE<T>(
        PromisE
            .fetchResponse(...args)
            .then(response => response.json())
    )
}
export default PromisE_fetch