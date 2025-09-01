import { KeepFirstN, DropFirstN } from "../types"
import PromisE from "./PromisE"
import { PromisE_Deferred_Options } from "./types"

/**
 * @name    PromisE.deferredFetch
 * @summary {@link PromisE.fetch} with the advantages of {@link PromisE.deferred} and auto-abort feature
 * 
 * @example ```javascript
 * ---
 * // Example: Fetch paginated products
 * const getProducts = PromisE.deferredFetch({
 *     defer: 300, // used for both "throttle" and "deferred" modes
 *     resolveIgnored: ResolveIgnored.WITH_ACTIVE,
 *     throttle: true,
 * })
 * ;(async () => {
 *     getProducts('https://dummyjson.com/products/1').then(console.log)
 *     await PromisE.delay(200)
 *     getProducts('https://dummyjson.com/products/2').then(console.log)
 * })()
 * // result (throttle = true): only product 1 retrieved
 * 
 * // result (throttle = false): only product 2 retrieved
 * 
 * // result (ResolveIgnored.WITH_ACTIVE): only product retrieved but both request will resolve the same result
 * 
 * // result (ResolveIgnored.WITH_UNDEFINED): only one product retrieved & resolved but the other will resolve with undefined
 * 
 * // result (ResolveIgnored.NEVER): only one product retrieved & resolved but the other will NEVER resolve
 * ```
 */    
export function PromisE_deferredFetch<
    TData = unknown,
    TArgs extends any[] = Parameters<typeof PromisE.fetch<TData>>,
    TArgsPartial extends any[] = KeepFirstN<Partial<TArgs>, 3>,
>(
    deferOptions: PromisE_Deferred_Options<TData> = {},
    ...defaults: TArgsPartial
) {
    let abortCtrl: AbortController | undefined
    type TArgs2 = DropFirstN<TArgs, Required<TArgsPartial>['length']>
    const fetchCallback = <TCbData = TData>(...args: TArgs2) => {
        const allArgs = [...defaults, ...args]
        // abort any previous fetch
        abortCtrl?.abort()
        abortCtrl = allArgs[3] ?? new AbortController()
        return (PromisE.fetch as any).apply(null, allArgs) as PromisE<TCbData>
    }
    return PromisE.deferredCallback(fetchCallback, deferOptions)
}
export default PromisE_deferredFetch