import { deferred, isArr, isFn } from '@superutils/core'
import { BehaviorSubject } from './BehaviorSubject'
import { isSubjectLike } from './isSubjectLike'
import { SubjectLike } from './types'
import { unsubscribeAll } from './unsubscribeAll'

export const IGNORE_UPDATE_SYMBOL = Symbol('ignore-rx-subject-update')
export type IgnoreUpdate = typeof IGNORE_UPDATE_SYMBOL
type SubjectsNValuesArray<T = unknown> = (T | SubjectLike<T>)[]
type RxSourceType = SubjectLike<unknown> | SubjectsNValuesArray<unknown>
type UnwrapRxSourceValue<T> = T extends readonly unknown[]
	? { -readonly [K in keyof T]: SubjectToValue<T[K]> }
	: SubjectToValue<T>
type SubjectToValue<T> = T extends SubjectLike<infer V> ? V : T
type ValueModifier<T = unknown, TCopy = T> = (
	newValue: T,
	previousValue: TCopy | undefined,
	rxCopy: SubjectLike<TCopy>,
) => TCopy | IgnoreUpdate

/**
 * @function    copyRxSubject
 * @summary returns a subject that automatically copies the value(s) of the source subject(s).
 *
 * The the changes are applied unidirectionally from the source subject to the destination subject.
 * Changes on the destination subject is NOT applied back into the source subject.
 *
 * @param rxSource  RxJS source subject(s). If Array provied, value of `rxCopy` will also be an Array by default,
 *      unless a different type is provided by `rxCopy` or `valueModifier`.
 *
 * @param rxCopy    (optional) RxJS copy/destination subject.
 *      If `undefined`, a new subject will be created.
 *      Value type will be inferred automatically based on `rxCopy`, `valueModifier` and `rxSource`.
 *      Default: `new BehaviorSubject()`
 * @param valueModifier (optional) callback to modify the value (an thus type) before copying from `rxSource`.
 *      Accepts async functions. Function invocation errors will be gracefully ignored.
 *      PS: If the very first invokation returns `IGNORE_UPDATE_SYMBOL`, the value of `rxCopy.value` will be undefined.
 *      Args: `newValue, previousValue, rxCopy`
 * @param defer (optional) delay in milliseconds.
 *      Default: `100` if rxSource is an array, otherwise, `0`.
 *
 * @returns rxCopy
 *
 * ----------------------------------------------
 *
 * @example copy a single subject
 * ```typescript
 * const rxNumber = new BehaviorSubject(1)
 * const rxEven = copyRxSubject(
 *     rxNumber,
 *     // If not provided, rxEven will be created and returned: `new BehaviorSubject<boolean>(false),`
 *     // Type will be inferred from `valueModifier` if available, otherwise, `rxNumber`.
 *     undefined,
 *     // whenever a new value is received from rxNumber, reduce it to the appropriate value for the rxEven.
 *     (newValue) => newValue % 2 === 0,
 * )
 * // subscribe to changes
 * // will immediately print false from the initial value of rxNumber
 * rxEven.subscribe(console.log)
 * rxNumber.next(2) // prints: true
 * rxNumber.next(3) // print: false
 * ```
 *
 * ----------------------------------------------
 *
 * @example copy an array of subjects & non-subjects
 * Automatically reduces to a single array with original values and their respective types
 * ```typescript
 *  const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 *  const rxUserId = new BehaviorSubject('username')
 *  const rxUserSettings = copyRxSubject(
 *      [rxTheme, rxUser, 'my-fancy-app' ] as const
 *  )
 *  // subscribe to the subject with reduced array values
 *  rxUserSettings.subscribe(([theme, user, appName]) => {})
 * ```
 *
 * ----------------------------------------------
 *
 * @example copy an array of subjects and reduce to some other value
 * ```typescript
 *  const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 *  const rxUserId = new BehaviorSubject('username')
 *  const rxUserSettings = copyRxSubject(
 *      [rxTheme, rxUserId] as const,
 *      // A new subject will be created from `valueModifier` to: `new BehaviorSubject<...>(...),`
 *      undefined,
 *      ([theme, userId]) => ({ theme, userId }),
 *      100, // delay before updating rxCopy
 *  )
 *  // save settings to local storage whenever any of the values changes
 *  rxUserSettings.subscribe(settings => localStorage.setItem(settings.userId, JSON.stringify(settings)))
 * ```
 *
 * ----------------------------------------------
 *
 * @example copy an array of subjects & non-subjects and reduce to some other value.
 * Non-subjects will act as unobserved values to be included in the final value.
 * ```typescript
 *  const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 *  const rxUser = new BehaviorSubject({ balance: 1000, currency: 'usd', userId: 'username' })
 *  const rxProfileProps = copyRxSubject(
 *      [rxTheme, rxUser, 'my-fancy-app' ] as const,
 *      // A new subject will be created from `valueModifier` to: `new BehaviorSubject<...>(...),`
 *      undefined,
 *      ([theme, userId, appName]) => ({ appName, theme, userId }),
 *      100, // delay before updating rxCopy
 *  )
 *  const userProfileView = (
 *      <RxSubjectView
 *          subject={rxProfileProps}
 *          render={props => <UserProfile {...props} />}
 *      />
 *  )
 * ```
 */
export function copyRxSubject<
	TCopy extends T,
	TRxSource = RxSourceType,
	T = UnwrapRxSourceValue<TRxSource>,
>(
	rxSource: TRxSource,
	rxCopy?: SubjectLike<TCopy>,
	valueModifier?: ValueModifier<T, TCopy>,
	defer?: number,
): SubjectLike<TCopy>

/**
 * Overload for when TCopy doesn't extend T (modifier required)
 */
export function copyRxSubject<
	TCopy,
	TRxSource = RxSourceType,
	T = UnwrapRxSourceValue<TRxSource>,
>(
	rxSource: TRxSource,
	rxCopy: SubjectLike<TCopy> | undefined,
	/**
	 * Value of rxSource (T) and value of rxCopy (TCopy) are not the same,
	 * therefore, `valueModifier` is required to transform the value(s) of
	 * rxSource into value of rxCopy.
	 */
	valueModifier: ValueModifier<T, TCopy>,
	defer?: number,
): SubjectLike<TCopy>

export function copyRxSubject<
	TCopy,
	TRxSource = RxSourceType,
	T = UnwrapRxSourceValue<TRxSource>,
>(
	rxSource: TRxSource,
	rxCopy?: SubjectLike<TCopy>,
	// ...args: [T, TCopy] extends [TCopy, T] ?
	//     [valueModifier?: ValueModifier<T>, defer?: number] :
	//     [valueModifier: ValueModifier<T, TCopy>, defer?: number]
	valueModifier?: ValueModifier<T, TCopy>,
	defer: number = isArr(rxSource)
		? 10 // small delay to avoid too many updates on rxCopy (especially after initiation)
		: 0,
): SubjectLike<TCopy> {
	const sourceIsArr = isArr<T | SubjectLike<T>>(rxSource)
	const _rxSourceArr = (
		isSubjectLike<T>(rxSource)
			? [rxSource]
			: !isArr(rxSource)
				? [new BehaviorSubject(rxSource)]
				: rxSource
	) as SubjectsNValuesArray
	const gotModifier = isFn(valueModifier)
	const getCopiedValue = () => {
		const values = _rxSourceArr.map(x => (x as SubjectLike).value)
		const result = sourceIsArr ? values : values[0]
		return result as T
	}
	if (!isSubjectLike(rxCopy)) {
		const initialValue = getCopiedValue()
		rxCopy ??= new BehaviorSubject<TCopy>(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			gotModifier
				? // eslint-disable-next-line @typescript-eslint/no-explicit-any
					(undefined as any) // for type consistency
				: initialValue,
		)
		if (gotModifier) {
			const modifiedValue = valueModifier(initialValue, undefined, rxCopy)
			modifiedValue !== IGNORE_UPDATE_SYMBOL && rxCopy.next(modifiedValue)
		}
	}

	const subscribeOrg = rxCopy.subscribe.bind(rxCopy)
	rxCopy.subscribe = (...args) => {
		let unsubscribed = false
		const updateRxCopy = async () => {
			if (unsubscribed) return

			try {
				const value = !gotModifier
					? getCopiedValue()
					: // eslint-disable-next-line @typescript-eslint/await-thenable
						await valueModifier(
							getCopiedValue(),
							rxCopy.value,
							rxCopy,
						)
				value != IGNORE_UPDATE_SYMBOL
					&& value !== rxCopy.value
					&& rxCopy.next(value as TCopy)
			} catch (err) {
				err
			} // ignore if valueModifier threw exception
		}
		const handleChange =
			defer > 0 ? deferred(updateRxCopy, defer) : updateRxCopy

		const subs = _rxSourceArr
			.filter(x => isSubjectLike(x))
			.map(x => x.subscribe(handleChange))
		const sub = subscribeOrg(...args)
		const unsubscribeOrg = sub.unsubscribe
		sub.unsubscribe = (...args) => {
			if (unsubscribed) return

			unsubscribed = true
			unsubscribeOrg.call(sub, ...args)
			unsubscribeAll(subs)
		}
		return sub
	}
	return rxCopy
}
copyRxSubject.IGNORE_UPDATE_SYMBOL = IGNORE_UPDATE_SYMBOL
export default copyRxSubject
