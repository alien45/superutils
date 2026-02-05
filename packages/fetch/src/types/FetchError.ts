import { FetchOptions } from './options'


/** Custom error message for fetch requests with more detailed info about the request URL, fetch options and response */
export class FetchError extends Error {
    /** Create a new `FetchError` with a new `message` while preserving all metadata */
    clone!: (newMessage: string) => FetchError
    /* FetchOptions */
    options!: FetchOptions
    /* FResponse received, if any */
    response!: Response | undefined
    /* Fetch URL */
    url!: string | URL

    constructor(
        message: string,
        options: {
            cause?: unknown
            options: FetchOptions
            response?: Response
            url: string | URL
        },
    ) {
        super(message, { cause: options.cause })

        this.name = 'FetchError'

        /* Prevents cluttering the console log output while also preserving ready-only member behavior */
        Object.defineProperties(this, {
            clone: {
                get() {
                    return (newMessage: string) =>
                        new FetchError(newMessage, {
                            cause: options.cause,
                            options: options.options,
                            response: options.response,
                            url: options.url,
                        })
                },
            },
            options: {
                get() {
                    return options.options
                },
            },
            response: {
                get() {
                    return options.response
                },
            },
            url: {
                get() {
                    return options.url
                },
            },
        })
    }
}