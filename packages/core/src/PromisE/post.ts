import { isStr } from "../is"
import PromisE from "./PromisE"
import { PostBody, FetchOptions } from "./types"

/**
 * @name    PromisE.post
 * @summary make a HTTP "POST" request and return result as JSON.
 * Default "content-type" is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 */
export function PromisE_post<T = unknown> (
    url: string | URL,
    data: PostBody,
    options?: Omit<FetchOptions, 'method'>,
    timeout?: number,
    abortCtrl?: AbortController,
) {
    return PromisE.fetch<T>(
        url,
        getPostOptions(data, options),
        timeout,
        abortCtrl,
    )
}
export default PromisE_post

export const getPostOptions = (data?: PostBody, options?: FetchOptions) => ({
    ...options,
    body: !isStr(data)
        ? JSON.stringify(data)
        : data,
    headers: {
        ...!options?.headers?.['Content-Type']
            && !options?.headers?.['content-type']
            && { 'content-type': 'application/json' },
        ...options?.headers,
    },
    method: 'POST',
})