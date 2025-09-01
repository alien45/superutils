import { isValidURL, isObj, isPositiveNumber } from "../is"
import { TimeoutId } from "../types"
import PromisE from "./PromisE"
import { FetchOptions } from "./types"

/**
 * @name    PromisE.fetchResponse
 * @summary makes a fetch request and returns Response.
 * This DOES NOT return an instance of {@link PromisE}.
 */
export function PromisE_fetchResponse (
    url: string | URL,
    options?: FetchOptions,
    timeout?: number,
    abortCtrl: AbortController = new AbortController(),
    errMsgs = {
        invalidUrl: 'Invalid URL',
        reqTimedout: 'Request timed out',
    }
) {
    const promise = PromisE.try(async () => {
        if (!isValidURL(url, false)) throw new Error(errMsgs.invalidUrl)

        options = isObj(options) && options || {}
        options.method ??= 'get'
        let timeoutId: TimeoutId = !isPositiveNumber(timeout)
            ? undefined
            : setTimeout(() => abortCtrl?.abort(), timeout)
        options.signal = abortCtrl?.signal

        const response = await fetch(url.toString(), options)
            .catch(err => Promise.reject(
                err?.name === 'AbortError'
                    ? new Error(errMsgs.reqTimedout)
                    : err
            ))
            .finally(() => timeoutId && clearTimeout(timeoutId))

        const { status = 0 } = response || {}
        const isSuccess = status >= 200 && status < 300
        if (!isSuccess) {
            const json = await response.json() || {}
            const message = json.message || `Request failed with status code ${status}. ${JSON.stringify(json || '')}`
            const error = new Error(`${message}`.replace('Error: ', ''))
            throw error
        }
        return response
    })
    // Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
    promise.onEarlyFinalize.push(() => abortCtrl?.abort())
    return promise
}
export default PromisE_fetchResponse