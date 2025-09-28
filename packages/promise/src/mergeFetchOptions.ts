import { FetchOptions } from './types'

export const mergeFetchOptions = (
    defaults: FetchOptions = {},
    options: FetchOptions = {},
) => {
    return {
        ...defaults,
        ...options,
        headers: {
            ...defaults?.headers,
            ...options?.headers,
        }
    }
}
export default mergeFetchOptions