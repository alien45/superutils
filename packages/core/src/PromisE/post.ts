import { isStr } from "../is"
import PromisE_fetch from "./fetch"
import mergeFetchOptions from "./mergeFetchOptions"
import { FetchOptions, PostBody, PromisE_PostArgs } from "./types"

/**
 * @name    PromisE.post
 * @summary make a HTTP "POST" request and return result as JSON.
 * Default "content-type" is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 */
export default function PromisE_post<T = unknown> (...[
    url = '',
    data,
    options,
    timeout,
    abortCtrl,
]: PromisE_PostArgs) {
    return PromisE_fetch<T>(
        url,
        mergeFetchOptions(
            {
                method: 'post',
                body: isStr(data)
                    ? data
                    : JSON.stringify(data)
            },
            options,
        ),
        timeout,
        abortCtrl,
    )
}