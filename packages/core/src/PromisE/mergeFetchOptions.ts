import { isStr } from "../is";
import { FetchOptions, PostBody } from "./types";

export const mergeFetchOptions = (
    defaults: FetchOptions = {},
    options: FetchOptions = {},
) => {
    return {
        ...defaults,
        ...options,
        headers: {
            ...defaults.headers,
            ...options?.headers,
        }
    }
}
export default mergeFetchOptions