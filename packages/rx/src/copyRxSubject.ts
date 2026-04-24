import {
	deferred,
	DeferredOptions,
	fallbackIfFails,
	isArr,
	isFn,
	isPositiveNumber,
} from '@superutils/core'
import { BehaviorSubject, skip } from './rxjs'
import isSubjectLike from './isSubjectLike'
import { SubjectLike, UnwrapSubjectValue } from './types'
import { unsubscribeAll } from './unsubscribeAll'

/** Symbol used to signal to ignore an update when using a `valueModifier()` callback with {@link copyRxSubject} */
export const IGNORE_UPDATE_SYMBOL = Symbol('ignore-rx-update')

export type CopyRxSubjectOptions<ThisArg> = {
	delay?: number
} & DeferredOptions<ThisArg>

/**
 * Value modifier function definition for {@link copyRxSubject}
 *
 * Returning {@link IGNORE_UPDATE_SYMBOL} will ignore the update.
 */
export type ValueModifier<T = unknown, TCopy = T> = (
	newValue: T,
	previousValue: TCopy | undefined,
	copy$: SubjectLike<TCopy>,
) => TCopy | typeof IGNORE_UPDATE_SYMBOL

/**
 * @function    copyRxSubject
 * @summary returns a subject that automatically copies the value(s) of the source subject(s).
 *
 * The the changes are applied unidirectionally from the source subject to the destination subject.
 * Changes on the destination subject is NOT applied back into the source subject.
 *
 * @param source$  RxJS source subject(s). If Array provied, value of `copy$` will also be an Array by default,
 * unless a different type is provided by `copy$` or `valueModifier`.
 *
 * @param copy$    (optional) RxJS copy/destination subject.
 * If `undefined`, a new subject will be created.
 * Value type will be inferred automatically based on `copy$`, `valueModifier` and `source$`.
 * Default: `new BehaviorSubject()`
 * @param valueModifier (optional) callback to modify the value (an thus type) before copying from `source$`.
 * Accepts async functions. Function invocation errors will be gracefully ignored.
 * PS: If the very first invokation returns `IGNORE_UPDATE_SYMBOL`, the value of `copy$.value` will be undefined.
 * Args: `newValue, previousValue, copy$`
 * @param options (optional) options to enable debouce/throttling `copy$` value changes.
 * @param options.delay (optional) delay in milliseconds. Default: `0`
 * @param options.onError (optional) callback invoked whenever `valueModifier` execution fails.
 * @param options.throttle (optional) `true`: throttle, `false`: debounce. Default: `false`
 *
 * @returns `copy$`
 *
 * @example
 * #### Auto-copy values from a single subject
 * ```typescript
 * import { BehaviorSubject, copyRxSubject } from '@superutils/rx'
 *
 * const number$ = new BehaviorSubject(1)
 * const even$ = copyRxSubject(
 *   // source subject
 *   number$,
 *   // create and return a new BehaviorSubject. An existing RxJS subject can also be provided here.
 *   null,
 *   // copy and transform the value from number$
 *   newValue => newValue % 2 === 0,
 *   // debounce/throttle value changes to even$t
 *   // {
 *   //   delay: 300 //
 *   //   throttle: false,
 *   // }
 * )
 * // subscribe to even$ changes
 * even$.subscribe(console.log)
 * number$.next(2) // prints: true
 * number$.next(3) // print: false
 * ```
 *
 * @example
 * #### Auto-copy from an array of subjects & values
 * ```javascript
 * import { BehaviorSubject, copyRxSubject } from '@superutils/rx'
 *
 * const theme$ = new BehaviorSubject('dark')
 * const userId$ = new BehaviorSubject('username')
 * const settings$ = copyRxSubject(
 *   [
 * 	   theme$,
 * 	   userId$,
 * 	   'my-fancy-app' // fixed/unobserved value
 * 	 ]
 * )
 * // subscribe to the subject with reduced array values
 * settings$.subscribe(([theme, user, appName]) =>
 * 	 console.log({ theme, user, appName })
 * )
 * ```
 */
export function copyRxSubject<
	TCopy extends T,
	TSource$,
	T = UnwrapSubjectValue<TSource$>,
	TCopy$ extends SubjectLike<TCopy> = BehaviorSubject<TCopy>,
	ThisArg = unknown,
>(
	source$: TSource$,
	copy$?: TCopy$ | null,
	valueModifier?: ValueModifier<T, TCopy> | null,
	options?: CopyRxSubjectOptions<ThisArg>,
): TCopy$

// Overload to allow valueModifier to transforms T into TCopy
export function copyRxSubject<
	TCopy,
	TSource$,
	T = UnwrapSubjectValue<TSource$>,
	TCopy$ extends SubjectLike<TCopy> = BehaviorSubject<TCopy>,
	ThisArg = unknown,
>(
	source$: TSource$,
	copy$: TCopy$ | undefined | null,
	valueModifier: ValueModifier<T, TCopy> | null,
	options?: CopyRxSubjectOptions<ThisArg>,
): TCopy$

export function copyRxSubject<
	TCopy,
	TSource$,
	T = UnwrapSubjectValue<TSource$>,
	TCopy$ extends SubjectLike<TCopy> = BehaviorSubject<TCopy>,
	ThisArg = unknown,
>(
	source$: TSource$,
	copy$?: TCopy$ | null,
	valueModifier?: ValueModifier<T, TCopy> | null,
	options?: CopyRxSubjectOptions<ThisArg>,
): TCopy$ {
	copy$ = isSubjectLike(copy$)
		? copy$
		: (new BehaviorSubject(undefined) as unknown as TCopy$)
	options = {
		...copyRxSubject.defaults,
		...(options ?? {}),
	} as CopyRxSubjectOptions<ThisArg>
	const sourceArr = isSubjectLike(source$)
		? [source$]
		: isArr(source$)
			? source$
			: [source$]
	const cache = new Map(
		sourceArr.map((subject, i) => [
			i,
			isSubjectLike(subject)
				? subject.value // use subject value if available
				: subject, // fixed value provided
		]),
	)

	const triggerChange = () => {
		const currentValue = isArr(source$) ? [...cache.values()] : cache.get(0)
		if (!isFn(valueModifier)) return copy$.next(currentValue as TCopy)

		const modifiedValue = fallbackIfFails(
			valueModifier,
			[currentValue as T, undefined, copy$],
			err => {
				fallbackIfFails(
					options.onError?.bind(options.thisArg as ThisArg),
					[err],
					undefined,
				)
				return IGNORE_UPDATE_SYMBOL
			},
		)
		modifiedValue !== IGNORE_UPDATE_SYMBOL
			&& copy$.next(modifiedValue as TCopy)
	}
	const triggerChangeDeferred = isPositiveNumber(options.delay)
		? deferred(triggerChange, options.delay, options)
		: triggerChange

	const subscriptions = sourceArr
		.map((subject, i) => {
			if (!isSubjectLike(subject) || subject.closed) return

			return (
				subject instanceof BehaviorSubject
					? ((subject as BehaviorSubject<unknown>).pipe(
							skip(1), // skip initial value
						) as typeof subject)
					: subject
			).subscribe(newValue => {
				cache.set(i, newValue)
				triggerChangeDeferred()
			})
		})
		.filter(Boolean)

	const unsubscribeOrg = copy$?.unsubscribe?.bind(copy$)
	copy$.unsubscribe = (...args) => {
		unsubscribeOrg?.(...args)
		unsubscribeAll(subscriptions)
		cache.clear()
	}

	// update copy$ with the initial values
	triggerChange()
	return copy$
}
copyRxSubject.defaults = {
	delay: 0,
	throttle: false,
} as { delay: number } & DeferredOptions<unknown>
copyRxSubject.IGNORE_UPDATE_SYMBOL = IGNORE_UPDATE_SYMBOL

export default copyRxSubject
