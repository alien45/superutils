import {
    isValidURL,
    isObj,
    isPositiveNumber,
    TimeoutId
} from '@utiils/core'
import PromisEBase from './PromisEBase'
import { IPromisE, PromisE_FetchArgs, PromisE_FetchErrMsgs } from './types'

export const defaultFetchErrMsgs: Required<PromisE_FetchErrMsgs> = {
    invalidUrl: 'Invalid URL',
    reqTimedout: 'Request timed out',
}

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
        errMsgs
    ]: PromisE_FetchArgs
): IPromisE<Response> {
    errMsgs = {
        ...defaultFetchErrMsgs,
        ...errMsgs,
    }
    const promise = new PromisEBase<Response>(async (resolve, reject) => {
        if (!isValidURL(url, false)) reject(new Error(errMsgs.invalidUrl))

        let timeoutId: TimeoutId = !isPositiveNumber(timeout)
            ? undefined
            : setTimeout(() => abortCtrl?.abort(), timeout)
        try {
            options = { ...options }
            options.headers ??= {}
            if (!options.headers['Content-Type'] && !options.headers['content-type']) {
                options.headers['content-type'] = 'application/json'
            }
            options.method ??= 'get'
            options.signal = abortCtrl?.signal

            const response = await fetch(url.toString(), options)
            const { status = 0 } = response
            const isSuccess = status >= 200 && status < 300
            if (!isSuccess) {
                const json = await response.json()
                const message = json?.message
                    || `Request failed with status code ${status}. ${JSON.stringify(json || '')}`
                const error = new Error(
                    `${message}`.replace('Error: ', '')
                )
                throw error
            }
            resolve(response)
        } catch (err) {
            reject(
                (err as any)?.name === 'AbortError'
                    ? new Error(errMsgs.reqTimedout, { cause: err })
                    : err
            )
        }
        timeoutId && clearTimeout(timeoutId)
    })
    // Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
    promise.onEarlyFinalize.push(() => abortCtrl?.abort())
    return promise
}