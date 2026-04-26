/**
 * Preserved reference to original Promise class and used it internally.
 * 
 * This is needed to avoid unexpected errors, in case, `globalThis.Promise` is replaced with `PromisE`.
 */
export const Promise = globalThis.Promise

export default Promise
