import {
	deferred,
	DeferredOptions,
	fallbackIfFails,
	isArr,
	isError,
	isFn,
	isPositiveNumber,
	isStr,
} from '@superutils/core'
import { copyRx, UnwrapSourceValue } from '@superutils/rx'
import { useEffect, useMemo, useState } from 'react'
import { isObservable, Subject, Subscription } from 'rxjs'

/**
 * A React hook that synchronizes component state with an RxJS Observable or Subject.
 *
 * It manages the subscription lifecycle automatically:
 * - **Mount/Update**: Subscribes to the provided `source$` and updates state on every emission.
 * - **Unmount**: Automatically unsubscribes to prevent memory leaks.
 * - **Initial State**: Attempts to extract an initial value from a `BehaviorSubject`. If not available,
 *   it falls back to `options.initialValue` or the result of the `transform` function.
 *
 * @template TOut - The type of the value emitted by the hook.
 * @template TIn - The type of the value received from the source observable.
 * @template Source$ - The type of the source observable/subject.
 * @template ThisArg - The context type for deferred options.
 *
 * @param source$ - The RxJS Observable or Subject to monitor. Can also be a factory function.
 *                  If null/undefined, a new internal Subject is created.
 * @param options - Configuration for transformations, merging, and update timing.
 *
 * @returns A tuple containing:
 * 1. `value`: The current state value.
 * 2. `setValue`: A function to manually update the state (supports functional updates and debouncing).
 * 3. `error`: A {@link UseRx_Error} object if the stream or transformation fails.
 * 4. `source$`: The underlying Observable/Subject.
 *
 * @example
 * ```typescript
 * const [count, setCount, error] = useRx(count$, { initialValue: 0 });
 * ```
 */
export default function useRx<
	Source$,
	TIn = UnwrapSourceValue<Source$>,
	TOut = TIn,
	ThisArg = unknown,
>(
	source$?: Source$ | null | (() => Source$ | void | undefined),
	options: UseRx_Options<TIn, TOut, ThisArg> = {},
) {
	const {
		defer,
		deferOptions,
		initialValue,
		merge: mergeObject,
		transform, //
	} = options
	const _source$ = useMemo(
		function getOrCreateSource$() {
			if (isFn(source$)) source$ = source$() ?? source$

			return isObservable(source$)
				? source$
				: isArr(source$)
					? copyRx(source$)
					: new Subject<TIn>()
		},
		[source$],
	) as Subject<TIn>

	const [state, setState] = useState<UseRx_State<TOut>>(
		function setupInitialState() {
			const firstValue = (_source$ as unknown as { value?: TIn }).value

			return initialValue !== undefined && firstValue === undefined
				? { value: initialValue }
				: transformValue(firstValue as TIn, {}, transform)
		},
	)

	const setValue = useMemo(() => {
		const _setValue = (newValue: TIn) => {
			if (!setValue.mounted) return

			setState(prevState => {
				const value = !isFn(newValue)
					? newValue
					: fallbackIfFails(newValue, [prevState.value], undefined)
				// previous value returned or newValue() call failed => state update not required
				if (value === undefined || value === prevState.value)
					return prevState

				return mergeValues(value, prevState.value!, mergeObject)
			})
		}

		return !isPositiveNumber(defer)
			? _setValue
			: deferred(_setValue, defer, deferOptions)
	}, []) as UseRx_SetValue<TOut>

	useEffect(function subscribe() {
		if (_source$.closed) {
			setState({
				error: new UseRx_Error('Cannot subscribe to a closed subject', {
					type: 'SubjectClosed',
				}),
			})
			return () => {}
		}

		setValue.mounted = true

		setValue.subscription = _source$.subscribe?.({
			error: (error: unknown) =>
				setValue.mounted
				&& setState(v => ({
					...v, // preserve old value
					error: new UseRx_Error(error, { type: 'ProducerError' }),
				})),
			next: (newValue: TIn) =>
				setValue.mounted
				&& setState(prevState => {
					const { error, value } = transformValue(
						newValue,
						prevState,
						transform,
					)

					return error
						? { error, value } // transformation failed
						: (mergeValues(
								value,
								prevState.value,
								mergeObject,
							) as UseRx_State<TOut>)
				}),
		})

		return () => {
			setValue.mounted = false
			setValue.subscription?.unsubscribe?.()
		}
	}, [])

	return [state.value, setValue, state.error, _source$] as const
}

export type UseRx_ErrorType =
	| 'ObjectMergeError'
	| 'ProducerError'
	| 'SubjectClosed'
	| 'TransformError'

/**
 * Custom error class for errors encountered within the `useRx` hook.
 */
export class UseRx_Error extends Error {
	type?: UseRx_ErrorType

	constructor(
		message?: unknown,
		options?: ErrorOptions & { type?: UseRx_ErrorType },
	) {
		if (!isStr(message)) {
			message = isError(message) ? message.message : String(message)
			options = {
				...options,
				cause: message,
			}
		}

		super(message as string, options)

		this.type = options?.type
	}
}

export type UseRx_Options<TIn, TOut, ThisArg = unknown> = {
	/** Delay in milliseconds to debounce or throttle state updates. */
	defer?: number
	/** Configuration for the deferral logic (e.g., throttle vs debounce). */
	deferOptions?: DeferredOptions<ThisArg>
	/**
	 * The value used during the initial render if the observable has not yet emitted.
	 */
	initialValue?: TOut
	/**
	 * If true, performs a shallow merge (`{...prev, ...next}`) when the value is an object.
	 * New properties will overwrite existing ones.
	 */
	merge?: TOut extends object ? boolean : never
	/**
	 * Number of initial emissions to ignore from the source observable.
	 *
	 * Default: `1` if source is a `BehaviorSubject`, otherwise `0`.
	 */
	skipEmits?: number
	/**
	 * A callback to modify the incoming value before it hits the state.
	 * Return `undefined` to use the raw value, or the previous value to skip the update.
	 *
	 * @param newValue new value received in the source observable
	 * @param prevValue previously transformed value (if any)
	 * @param prevError previous error (if any)
	 */
	transform?: (
		newValue?: TIn,
		prevValue?: TOut,
		prevError?: UseRx_Error,
	) => TOut | undefined | void
}

/**
 * The state dispatcher returned by `useRx`.
 * Includes a `mounted` flag (used internally) to prevent state updates on unmounted components.
 */
export type UseRx_SetValue<TOut> = React.Dispatch<
	React.SetStateAction<TOut | undefined>
> & {
	mounted: boolean
	subscription?: Subscription
}

export type UseRx_State<TOut> = {
	error?: UseRx_Error
	value?: TOut
}

/**
 * Internal helper to merge or replace state values.
 *
 * If `merge` is true, it performs a shallow object merge where `newValue` overwrites `prevValue`.
 * If merging fails, it captures the error and returns the previous value.
 *
 * @param newValue - The incoming value.
 * @param prevValue - The current value in state.
 * @param merge - Whether to perform a shallow merge.
 *
 * @returns A new state object with the (potentially) merged value.
 */
const mergeValues = <TIn, TOut>(
	newValue: TIn,
	prevValue: TOut,
	merge = false,
): UseRx_State<TOut> =>
	fallbackIfFails(
		() => ({
			error: undefined,
			value: (!merge
				? newValue // If not merging, just use the new value
				: { ...prevValue, ...newValue }) as unknown as TOut, // If merging, new value overwrites old
		}),
		[],
		error => ({
			error: new UseRx_Error(error, { type: 'ObjectMergeError' }),
			value: prevValue, // preserve old value
		}),
	)

/**
 * Internal helper to execute the user-provided transformation logic.
 *
 * It handles the `transform` callback, ensuring that errors are caught and
 * that the state is updated correctly based on the callback's return value.
 *
 * @param newValue - The raw value from the observable.
 * @param prevState - The current state containing the existing value and error.
 * @param transform - The optional transformation function from options.
 *
 * @returns A new state object with the (potentially) transformed value.
 */
const transformValue = <TIn, TOut>(
	newValue: TIn,
	prevState: UseRx_State<TOut>,
	transform: UseRx_Options<TIn, TOut>['transform'],
) =>
	fallbackIfFails(
		() => {
			const value = isFn(transform)
				? transform(newValue, prevState.value, prevState.error)
				: newValue
			return {
				error: undefined,
				value:
					value === undefined // no transfromation was done
						? newValue
						: value,
			}
		},
		[],
		err => ({
			error: new UseRx_Error(err, { type: 'TransformError' }),
			value: prevState.value, // preserve old value
		}),
	) as UseRx_State<TOut>
