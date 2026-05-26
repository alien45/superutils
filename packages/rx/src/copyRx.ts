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
import {
	BehaviorSubject,
	isObservable,
	type Observable,
	skip,
	Subject,
} from './rxjs'
import type { UnwrapSubjectValue } from './types'
import { unsubscribeAll } from './unsubscribeAll'
import PromisE from '@superutils/promise'

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
	 * Number of initial emissions to skip from the input observable(s).
	 *
	 * If an array is provided, each element corresponds to the observable at the same index.
	 *
	 * @default 1 for `BehaviorSubject` (to avoid redundant updates of the initial value), otherwise 0.
	 */
	skipEmits?: number | (number | undefined | null)[]

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

	/** Use this only if  */
	transformSequentially?: boolean
} & DeferredOptions<ThisArg>

/**
 * Value modifier function definition for {@link copyRx}
 *
 * Returning {@link copyRx.IGNORE} will ignore the update.
 */
export type CopyRx_Transform<TIn = unknown, TOut = TIn, ThisArg = unknown> = (
	this: ThisArg,
	/**
	 * The current value from the input observable (or an array of values if multiple sources are provided).
	 *
	 * **Note:** If the transformation is asynchronous, a `BehaviorSubject` output will emit `undefined` (or the
	 * `initialValue`) immediately upon subscription until the first `transform` promise resolves.
	 */
	newValue: TIn | undefined,
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
 * @param input     RxJS input observable(s) or static value(s). If an array is provided,
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
	Input,
	TIn = UnwrapSubjectValue<Input>,
	Output extends BehaviorSubject<TOut> | Subject<TOut> =
		BehaviorSubject<TOut>,
	ThisArg = unknown,
>(
	input: Input,
	transform?: CopyRx_Transform<TIn, TOut, ThisArg> | null,
	options?: CopyRx_Options<TOut, ThisArg>,
): Output

// Overload to allow transform() to change T into TCopy
export function copyRx<
	TOut,
	Input,
	TIn = UnwrapSubjectValue<Input>,
	Output extends BehaviorSubject<TOut> | Subject<TOut> =
		BehaviorSubject<TOut>,
	ThisArg = unknown,
>(
	input: Input,
	transform: CopyRx_Transform<TIn, TOut, ThisArg> | undefined | null,
	options?: CopyRx_Options<TOut, ThisArg>,
): Output

export function copyRx<
	TOut,
	Input,
	Transform extends CopyRx_Transform<TIn, TOut, ThisArg> | undefined | null,
	TIn = UnwrapSubjectValue<Input>,
	Output extends BehaviorSubject<TOut> | Subject<TOut> =
		BehaviorSubject<TOut>,
	ThisArg = unknown,
>(
	input: Input,
	transform?: Transform,
	options?: CopyRx_Options<TOut, ThisArg>,
): Output {
	options = {
		...copyRx.defaults,
		...(options ?? {}),
	} as CopyRx_Options<TOut, ThisArg>
	if (!isArr(options.skipEmits)) options.skipEmits = [options.skipEmits]
	if (options.thisArg !== undefined) {
		options.onError = options.onError?.bind?.(options.thisArg)
		transform = transform?.bind?.(options.thisArg) as Transform
	}
	if (isFn(transform) && options.transformSequentially)
		transform = PromisE.deferredCallback(transform, {
			delay: 0,
		}) as Transform

	const inputArr = isObservable(input)
		? [input]
		: isArr(input)
			? input
			: [input]
	const cache = new Map(
		inputArr.map((x, i) => [
			i,
			isObservable(x)
				? (x as BehaviorSubject<TIn>).value // use subject value if available
				: x, // fixed value provided
		]),
	)
	let subscriptions: unknown[] = []
	const output = (
		isSubjectLike(options.output)
			? options.output!
			: new BehaviorSubject(options.initialValue)
	) as Output
	const unsubscribeOrg = output.unsubscribe?.bind(output)
	output.unsubscribe = (...args) => {
		unsubscribeOrg?.(...args)
		unsubscribeAll(subscriptions)
		cache.clear()
	}

	const update = (value: TOut | symbol) =>
		value !== copyRx.IGNORE && output.next(value as TOut)

	const handleChange = () => {
		const currentValue = isArr(input) ? [...cache.values()] : cache.get(0)
		if (!isFn(transform)) return output.next(currentValue as TOut)

		const result = fallbackIfFails(
			transform,
			[currentValue as TIn, output] as const,
			err => {
				fallbackIfFails(options.onError, [err], undefined)
				return copyRx.IGNORE
			},
		) as ValueOrPromise<TOut | symbol>

		!isPromise(result) ? update(result as TOut) : result.then(update)
	}
	const handleNext = isPositiveNumber(options.delay)
		? deferred(handleChange, options.delay, options)
		: handleChange

	subscriptions = inputArr
		.map((x, i) => {
			if (!isObservable(x) || (x as Subject<TIn>).closed) return

			return x
				.pipe(
					skip(
						(options.skipEmits as number[])[i]
							?? (x instanceof BehaviorSubject ? 1 : 0),
					),
				)
				.subscribe({
					next: newValue => {
						cache.set(i, newValue)
						handleNext()
					},
				})
		})
		.filter(Boolean)

	// update with the initial values
	handleChange()
	return output
}
copyRx.defaults = {
	delay: 0,
	throttle: false,
} as Required<Omit<DeferredOptions<unknown>, 'thisArg'> & { delay: number }>

/** Use this in the `transform` function to signal that an update should be ignored. */
copyRx.IGNORE = IGNORE_UPDATE_SYMBOL

export default copyRx
