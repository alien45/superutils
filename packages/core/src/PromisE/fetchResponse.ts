import { isValidURL, isObj, isPositiveNumber } from "../is"
import { TimeoutId } from "../types"
import PromisEBase from "./PromisEBase"
import { IPromisE, PromisE_FetchArgs } from "./types"

/**
 * @name    PromisE.fetchResponse
 * @summary makes a fetch request and returns Response.
 * This DOES NOT return an instance of {@link PromisEBase}.
 */
export default function PromisE_fetchResponse(
    ...[
        url,
        options,
        timeout,
        abortCtrl = new AbortController(),
        errMsgs = {
            invalidUrl: 'Invalid URL',
            reqTimedout: 'Request timed out',
        }
    ]: PromisE_FetchArgs
): IPromisE<Response> {
    const promise = PromisEBase.try(async () => {
        if (!isValidURL(url, false)) throw new Error(errMsgs.invalidUrl)

        let timeoutId: TimeoutId = !isPositiveNumber(timeout)
            ? undefined
            : setTimeout(() => abortCtrl?.abort(), timeout)
        options = isObj(options) && options || {}
        options.headers ??= {}
        if (!options.headers['Content-Type'] && !options.headers['content-type']) {
            options.headers['content-type'] = 'application/json'
        }
        options.method ??= 'get'
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