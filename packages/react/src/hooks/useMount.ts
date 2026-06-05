import { fallbackIfFails, ValueOrPromise } from '@superutils/core'
import { useEffect } from 'react'

/** Callback used in both `onMount` and `onUnmount` in {@link useMount} */
export type UseMountCb = (isMounted: boolean) => ValueOrPromise<void>

/**
 * Simple React hook to trigger callback when component mounts and/or unmounts
 *
 * @param onMount   (optional) Callback invoked whenever component mounts.
 * @param onUnmount (optional) Callback invoked whenever component unmounts.
 * If `true` and `onMount` is provided, `onMount` will be invoked on both mount and unmount events.
 */
export const useMount = (
	onMount?: UseMountCb | null,
	onUnmount?: UseMountCb | null | boolean,
) => {
	useEffect(() => {
		let isMounted = true
		onMount && fallbackIfFails(onMount as unknown, [isMounted], undefined)

		return () => {
			isMounted = false
			onUnmount
				&& fallbackIfFails(
					(onUnmount === true ? onMount : onUnmount) as unknown,
					[isMounted],
					undefined,
				)
		}
	}, [])
}

/**
 * Hook to trigger callback on component unmount
 */
export const useUnmount = (onUnmount: UseMountCb) => {
	useMount(null, onUnmount)
}

export default useMount
