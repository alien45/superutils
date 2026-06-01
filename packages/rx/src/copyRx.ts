import {
	deferred,
	DeferredOptions,
	fallbackIfFails,
	isArr,
	isFn,
	isNumber,
	isPositiveNumber,
	isPromise,
	isSubjectLike,
	ValueOrPromise,
} from '@superutils/core'
import PromisE from '@superutils/promise'
import {
	BehaviorSubject,
	isObservable,
	type Observable,
	skip,
	Subject,
} from './rxjs'
import type { UnwrapSourceValue, UnwrapSourceValueStrict } from './types'
import { unsubscribeAll } from './unsubscribeAll'

/** Symbol used to signal to ignore an update when using a `transform()` callback with {@link copyRx} */
export const IGNORE_UPDATE_SYMBOL = Symbol('ignore-update')

export type CopyRx_Options<TOut, ThisArg> = {
	/**
	 * Debounce or throttle delay in milliseconds.
	 * If provided, updates to the output subject will be delayed accordingly.
	 *
	 * @default undefined
	 */
	delay?: number

	/**
	 * The initial value for the output subject.
	 * This is particularly useful when creating a new `BehaviorSubject` internally.
	 */
	initialValue?: TOut

	/**
	 * An optional destination subject to which values will be copied.
	 * If provided, this subject will be returned by the function.
	 * If not provided, a new `BehaviorSubject` is created.
	 */
	output?: BehaviorSubject<TOut> | Subject<TOut>

	/**
	 * Number of initial emissions to skip from the input observable(s).
	 *
	 * If an array is provided, each element corresponds to the observable at the same index.
	 *
	 * @default 1 for `BehaviorSubject` (to avoid redundant updates of the initial value), otherwise 0.
	 */
	skipEmits?: number | (number | undefined | null)[]

	/** Use this only if  */
	transformSequentially?: boolean
} & DeferredOptions<ThisArg>

/**
 * Value modifier function definition for {@link copyRx}.
 *
 * This function is executed for each new value emitted by the input observable(s).
 *
 * - **`this` context**: The `this` context within the `transform` function can be set using the `options.thisArg`
 * - **Ignoring updates**: Returning {@link copyRx.IGNORE} will prevent the output observable from emitting the current update.
 * - **Asynchronous transformations**: If a `Promise` is returned, the output observable will only be updated once the promise resolves.
 *   However, this can introduce race conditions if new input values arrive before the previous promise resolves.
 *   To prevent such race conditions, enable the `transformSequentially` flag in `CopyRx_Options`.
 * - **Error handling**: If the `transform` function throws an error, the update is gracefully ignored, and the `onError` callback (if provided in `CopyRx_Options`) will be invoked.
 */
export type CopyRx_Transform<TIn = unknown, TOut = TIn, ThisArg = unknown> = (
	this: ThisArg,
	/**
	 * The current value from the input observable (or an array of values if multiple sources are provided).
	 *
	 * - If `input` to `copyRx` is a single observable, `newValue` will be the value emitted by that observable.
	 * - If `input` is an array of observables/values, `newValue` will be an array containing the latest values from all sources.
	 *
	 * **Note:** If the transformation is asynchronous, a `BehaviorSubject` output will emit `undefined` (or the
	 * `initialValue`) immediately upon subscription until the first `transform` promise resolves.
	 */
	newValue: TIn,
	/**
	 * The destination observable/subject where the results are being copied.
	 */
	output: Observable<TOut>,
) => ValueOrPromise<TOut> | typeof IGNORE_UPDATE_SYMBOL

/**
 * Returns a subject that automatically copies the value(s) of the source subject(s).
 *
 * Established a unidirectional data flow from source(s) to a destination subject.
 * Changes to the destination subject are NOT applied back to the source.
 *
 * @param source$     RxJS input observable(s) or static value(s). If an array is provided,
 *                  the output subject will emit an array of values by default.
 * @param transform (optional) A function to map or filter values before they are emitted by the output subject.
 *                  Supports async functions. If it throws, the update is ignored.
 * @param options   (optional) Configuration for timing (delay), initial state, and error handling.
 *
 * @returns The destination subject (either the one provided in `options.output` or a new `BehaviorSubject`).
 *
 * @example
 * #### Auto-copy values from a single subject
 * ```typescript
 * import { BehaviorSubject, copyRx } from '@superutils/rx'
 *
 * const number$ = new BehaviorSubject(1)
 * const even$ = copyRx(
 *   number$, // input observable
 *   newValue => newValue % 2 === 0 ? newValue : copyRx.IGNORE,
 * )
 * // subscribe to even$ changes
 * even$.subscribe(console.log) // prints: 2
 * number$.next(2)
 * number$.next(3) // (ignored)
 * ```
 *
 * @example
 * #### Auto-copy from an array of subjects & values
 * ```javascript
 * import { BehaviorSubject, copyRx } from '@superutils/rx'
 *
 * const theme$ = new BehaviorSubject('dark')
 * const userId$ = new BehaviorSubject('username')
 * const settings$ = copyRx(
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
export function copyRx<
	TOut,
	Source$ extends Observable<any> | ReadonlyArray<Observable<any> | unknown> =
		Observable<any>,
	TIn = UnwrapSourceValueStrict<Source$>,
	Copy$ extends BehaviorSubject<TOut> | Subject<TOut> = BehaviorSubject<TOut>,
	ThisArg = unknown,
>(
	source$: Source$,
	transform?: CopyRx_Transform<TIn, TOut, ThisArg> | null,
	options?: CopyRx_Options<TOut, ThisArg>,
): Copy$

// Overload to allow transform() to change T into TCopy
export function copyRx<
	TOut,
	Source$ extends Observable<any> | ReadonlyArray<Observable<any> | unknown> =
		Observable<any>,
	TIn = UnwrapSourceValueStrict<Source$>,
	Copy$ extends BehaviorSubject<TOut> | Subject<TOut> = BehaviorSubject<TOut>,
	ThisArg = unknown,
>(
	source$: Source$,
	transform: CopyRx_Transform<TIn, TOut, ThisArg>,
	options?: CopyRx_Options<TOut, ThisArg>,
): Copy$

export function copyRx<
	TOut,
	Source$ extends Observable<any> | ReadonlyArray<Observable<any> | unknown> =
		Observable<any>,
	TIn = UnwrapSourceValueStrict<Source$>,
	Copy$ extends BehaviorSubject<TOut> | Subject<TOut> = BehaviorSubject<TOut>,
	ThisArg = unknown,
>(
	source$: Source$,
	transform?: null | CopyRx_Transform<TIn, TOut, ThisArg>,
	options?: CopyRx_Options<TOut, ThisArg>,
): Copy$ {
	const sourceArr = isObservable(source$)
		? [source$]
		: isArr(source$)
			? source$
			: [source$]
	const cache = new Map(
		sourceArr.map((x, i) => [
			i,
			isObservable(x)
				? (x as BehaviorSubject<TIn>).value // use subject value if available
				: x, // fixed value provided
		]),
	)
	options = {
		...copyRx.defaults,
		...(options ?? {}),
	} as CopyRx_Options<TOut, ThisArg>

	if (!isArr(options.skipEmits)) options.skipEmits = [options.skipEmits]
	if (options.thisArg !== undefined) {
		options.onError = options.onError?.bind?.(options.thisArg)
		transform = transform?.bind?.(options.thisArg)
	}
	if (isFn(transform) && options.transformSequentially)
		transform = PromisE.deferredCallback(transform, {
			delay: 0, // enables sequential execution
			onError: options.onError,
			thisArg: options.thisArg,
		})

	const copy$ = (
		isSubjectLike(options.output)
			? options.output
			: new BehaviorSubject(options.initialValue)
	) as Copy$

	const updateOutput = (value: TOut | symbol) =>
		value !== copyRx.IGNORE && copy$.next(value as TOut)

	let handleChange = () => {
		const currentValue = isArr(source$)
			? [...cache.values()] //
			: cache.get(0)
		if (!isFn(transform)) return copy$.next(currentValue as TOut)

		const result = fallbackIfFails(
			transform,
			[currentValue as TIn, copy$] as const,
			err => {
				fallbackIfFails(options.onError, [err], undefined)
				return copyRx.IGNORE
			},
		) as ValueOrPromise<TOut | symbol>

		!isPromise(result)
			? updateOutput(result as TOut)
			: result.then(updateOutput)
	}
	handleChange = isPositiveNumber(options.delay)
		? deferred(handleChange, options.delay, options)
		: handleChange

	const subscriptions = sourceArr.map((x, i) => {
		if (!isObservable(x) || (x as BehaviorSubject<TIn>).closed) return

		const skipEmit =
			(options.skipEmits as number[])[i]
			?? (x instanceof BehaviorSubject ? 1 : 0)
		if (skipEmit > 0) x = x.pipe(skip(skipEmit))

		return (x as Observable<TIn>).subscribe({
			next: newValue => {
				cache.set(i, newValue)
				handleChange()
			},
		})
	})

	const unsubscribeOrg = copy$.unsubscribe?.bind(copy$)
	copy$.unsubscribe = (...args) => {
		unsubscribeOrg?.(...args)
		unsubscribeAll(subscriptions)
		cache.clear()
	}

	// update with the initial values
	handleChange()
	return copy$
}
copyRx.defaults = {
	delay: 0,
	throttle: false,
} as Required<Omit<DeferredOptions<unknown>, 'thisArg'> & { delay: number }>
copyRx.IGNORE = IGNORE_UPDATE_SYMBOL

export default copyRx
