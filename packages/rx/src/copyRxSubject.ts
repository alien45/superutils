import {
	deferred,
	fallbackIfFails,
	isArr,
	isFn,
	isPositiveNumber,
} from '@superutils/core'
import { skip } from 'rxjs'
import { BehaviorSubject } from './BehaviorSubject'
import { DelayOptions } from './data-storage'
import isSubjectLike from './isSubjectLike'
import { SubjectLike } from './types'
import { unsubscribeAll } from './unsubscribeAll'

export const IGNORE_UPDATE_SYMBOL = Symbol('ignore-rx-subject-update')
export type IgnoreUpdate = typeof IGNORE_UPDATE_SYMBOL
export type UnwrapRxSourceValue<T> = T extends readonly unknown[]
	? { -readonly [K in keyof T]: SubjectToValue<T[K]> }
	: SubjectToValue<T>
export type SubjectToValue<T> = T extends SubjectLike<infer V> ? V : T
export type ValueModifier<T = unknown, TCopy = T> = (
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
 * unless a different type is provided by `rxCopy` or `valueModifier`.
 *
 * @param rxCopy    (optional) RxJS copy/destination subject.
 * If `undefined`, a new subject will be created.
 * Value type will be inferred automatically based on `rxCopy`, `valueModifier` and `rxSource`.
 * Default: `new BehaviorSubject()`
 * @param valueModifier (optional) callback to modify the value (an thus type) before copying from `rxSource`.
 * Accepts async functions. Function invocation errors will be gracefully ignored.
 * PS: If the very first invokation returns `IGNORE_UPDATE_SYMBOL`, the value of `rxCopy.value` will be undefined.
 * Args: `newValue, previousValue, rxCopy`
 * @param delay (optional) delay in milliseconds.
 * Default: `100` if rxSource is an array, otherwise, `0`.
 *
 * @returns rxCopy
 *
 * ----------------------------------------------
 *
 * @example
 * #### Copy a single subject
 * ```typescript
 * import { BehaviorSubject, copyRxSubject } from '@superutils/rx'
 *
 * const rxNumber = new BehaviorSubject(1)
 * const rxEven = copyRxSubject(
 *   rxNumber,
 *   // If not provided, rxEven will be created and returned: `new BehaviorSubject<boolean>(false),`
 *   // Type will be inferred from `valueModifier` if available, otherwise, `rxNumber`.
 *   undefined,
 *   // whenever a new value is received from rxNumber, reduce it to the appropriate value for the rxEven.
 *   (newValue) => newValue % 2 === 0,
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
 * @example
 * #### Copy an array of subjects & non-subjects
 * Automatically reduces to a single array with original values and their respective types
 * ```typescript
 * import { BehaviorSubject, copyRxSubject } from '@superutils/rx'
 *
 * const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 * const rxUserId = new BehaviorSubject('username')
 * const rxUserSettings = copyRxSubject(
 *     [rxTheme, rxUser, 'my-fancy-app' ] as const
 * )
 * // subscribe to the subject with reduced array values
 * rxUserSettings.subscribe(([theme, user, appName]) => {})
 * ```
 *
 * ----------------------------------------------
 *
 * @example
 * #### Copy an array of subjects and reduce to some other value
 * ```typescript
 * import { BehaviorSubject, copyRxSubject } from '@superutils/rx'
 *
 * const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 * const rxUserId = new BehaviorSubject('username')
 * const rxUserSettings = copyRxSubject(
 *   [rxTheme, rxUserId] as const,
 *   // A new subject will be created from `valueModifier` to: `new BehaviorSubject<...>(...),`
 *   undefined,
 *   ([theme, userId]) => ({ theme, userId }),
 *   100, // delay before updating rxCopy
 * )
 * // save settings to local storage whenever any of the values changes
 * rxUserSettings.subscribe(settings => localStorage.setItem(settings.userId, JSON.stringify(settings)))
 * ```
 *
 * ----------------------------------------------
 *
 * @example
 * #### Copy an array of subjects & non-subjects and reduce to some other value.
 * Non-subjects will act as unobserved values to be included in the final value.
 * ```jsx
 * import { BehaviorSubject, copyRxSubject, RxSubjectView } from '@superutils/rx'
 *
 * const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 * const rxUser = new BehaviorSubject({ balance: 1000, currency: 'usd', userId: 'username' })
 * const rxProfileProps = copyRxSubject(
 *   [rxTheme, rxUser, 'my-fancy-app' ] as const,
 *   // A new subject will be created from `valueModifier` to: `new BehaviorSubject<...>(...),`
 *   undefined,
 *   ([theme, userId, appName]) => ({ appName, theme, userId }),
 *   100, // delay before updating rxCopy
 * )
 * const userProfileView = (
 *   <RxSubjectView
 *     subject={rxProfileProps}
 *     render={props => <UserProfile {...props} />}
 *   />
 * )
 * ```
 */
export function copyRxSubject<
	TCopy extends T,
	TRxSource,
	T = UnwrapRxSourceValue<TRxSource>,
	TRxCopy extends SubjectLike<TCopy> = BehaviorSubject<TCopy>,
>(
	rxSource: TRxSource,
	rxCopy?: TRxCopy,
	valueModifier?: ValueModifier<T, TCopy>,
	delay?: number,
	delayOptions?: DelayOptions,
	debugTag?: string,
): TRxCopy

// Overload for when TCopy doesn't extend T (modifier required)
export function copyRxSubject<
	TCopy,
	TRxSource,
	T = UnwrapRxSourceValue<TRxSource>,
	TRxCopy extends SubjectLike<TCopy> = BehaviorSubject<TCopy>,
>(
	rxSource: TRxSource,
	rxCopy: TRxCopy | undefined,
	/**
	 * Value of rxSource (T) and value of rxCopy (TCopy) are not the same,
	 * therefore, `valueModifier` is required to transform the value(s) of
	 * rxSource into value of rxCopy.
	 */
	valueModifier: ValueModifier<T, TCopy>,
	delay?: number,
	delayOptions?: DelayOptions,
	debugTag?: string,
): TRxCopy

export function copyRxSubject<
	TCopy,
	TRxSource,
	T = UnwrapRxSourceValue<TRxSource>,
	TRxCopy extends SubjectLike<TCopy> = BehaviorSubject<TCopy>,
>(
	rxSource: TRxSource,
	rxCopy?: TRxCopy,
	valueModifier?: ValueModifier<T, TCopy>,
	delay?: number,
	delayOptions?: DelayOptions,
): TRxCopy {
	delay ??= copyRxSubject.defaults.delay
	let sourceSubs: undefined | unknown[]
	let clientSubs = 0
	const sourceIsArr = isArr(rxSource)
	const rxSourceArr = isSubjectLike(rxSource)
		? [rxSource]
		: isArr(rxSource)
			? rxSource
			: [rxSource]
	const gotModifier = isFn(valueModifier)
	let cachedValues = rxSourceArr.map(subject =>
		isSubjectLike(subject) ? subject.value : subject,
	)
	rxCopy = isSubjectLike(rxCopy)
		? rxCopy
		: (new BehaviorSubject(undefined) as unknown as TRxCopy)

	const triggerChange = () => {
		const currentValue = (sourceIsArr ? cachedValues : cachedValues[0]) as T
		if (!gotModifier) return rxCopy.next(currentValue as unknown as TCopy)

		const modifiedValue = fallbackIfFails(
			valueModifier,
			[currentValue, undefined, rxCopy],
			IGNORE_UPDATE_SYMBOL,
		)
		modifiedValue !== IGNORE_UPDATE_SYMBOL
			&& rxCopy.next(modifiedValue as TCopy)
	}
	const trggerChangeDeferred = isPositiveNumber(delay)
		? deferred(triggerChange, delay, {
				...copyRxSubject.defaults.delayOptions,
				...delayOptions,
			})
		: triggerChange

	const subscribeOrg = rxCopy.subscribe.bind(rxCopy)
	rxCopy.subscribe = (...args) => {
		clientSubs++
		sourceSubs ??= rxSourceArr.map((subject, i) => {
			if (!isSubjectLike(subject)) return

			return (
				subject instanceof BehaviorSubject
					? ((subject as BehaviorSubject<unknown>).pipe(
							skip(1), // skip initial value
						) as typeof subject)
					: subject
			).subscribe(newValue => {
				cachedValues[i] = newValue
				trggerChangeDeferred()
			})
		})

		const sub = subscribeOrg(...args)
		const unsubscribeOrg = sub.unsubscribe.bind(sub)
		sub.unsubscribe = (...args) => {
			if (sub.closed) return

			clientSubs--
			unsubscribeOrg(...args)
			if (clientSubs > 0) return

			unsubscribeAll(sourceSubs)
			sourceSubs = undefined
		}
		return sub
	}

	const unsubscribeOrg = rxCopy?.unsubscribe?.bind(rxCopy)
	rxCopy.unsubscribe = (...args) => {
		unsubscribeOrg?.(...args)
		unsubscribeAll(sourceSubs)
		sourceSubs = undefined
		cachedValues = []
	}

	// trigger with the initial values
	triggerChange()
	return rxCopy
}
copyRxSubject.defaults = {
	delay: 0,
	delayOptions: { throttle: false },
} as {
	delay?: number
	delayOptions?: DelayOptions
}
copyRxSubject.IGNORE_UPDATE_SYMBOL = IGNORE_UPDATE_SYMBOL
export default copyRxSubject
