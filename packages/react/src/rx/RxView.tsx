import { ReactNode, useEffect, useMemo, useState } from 'react'
import { BehaviorSubject } from 'rxjs'
import useRx from './useRx'
import { UnwrapSourceValue } from '@superutils/rx'

export type RxView_Render<T = unknown> = (
	value: T,
	subject: BehaviorSubject<T>,
) => ReactNode
export type SubjectOrFunc<T = unknown> =
	| BehaviorSubject<T>
	| (() => BehaviorSubject<T>)
export type RenderOrChildren<T = unknown> =
	| {
			children?: never
			render: RxView_Render<T>
	  }
	| {
			children: RxView_Render<T>
			render?: never
	  }
export type RxView_Props<T = unknown> = {
	subject: BehaviorSubject<T> | (() => BehaviorSubject<T>)
} & RenderOrChildren<T>

export default function RxView<T = unknown>(props: RxView_Props<T>) {
	const { subject } = props
	const rxSubject = useMemo<BehaviorSubject<T>>(
		() => (typeof subject === 'function' ? subject() : subject),
		[subject],
	)
	const [value, setValue] = useState(rxSubject.value)

	useEffect(() => {
		let mounted = true
		const subscription = rxSubject.subscribe(
			value => mounted && setValue(value),
		)

		return () => {
			mounted = false
			subscription.unsubscribe()
		}
	}, [rxSubject])

	const render = 'render' in props ? props.render : props.children
	const content = render?.(value, rxSubject) ?? value
	return content
}

/**
 *  TODO: update RxView to use useRx() hook
 */
// type RendrOrChildren = {
// 	children?: never
// 	render: Parameters<typeof useRx>[1]['transform']
// }
// type Props<TOut, TIn> = {
// 	options: Parameters<typeof useRx<TOut, TIn>>[1]
// 	source$: Parameters<typeof useRx<TOut, TIn>>[0]
// }
// function UseRxView<TOut, TIn>(props: Props<TOut, TIn>) {
// 	const { options, source$ } = props
// 	const [value, setValue] = useRx(source$, options)
// }

// UseRxView({
// 	options: { transform: (a, b, c) => {} },
// 	source$: new BehaviorSubject(1),
// })

// useRx(new BehaviorSubject(1), { transform: (a, b, c) => {} })

// const sourceArr = [
// 	new BehaviorSubject(1),
// 	new BehaviorSubject(''),
// 	false,
// ] as const
// useRx(sourceArr, {
// 	transform: (a, b, c) => {},
// })

// type T = UnwrapSourceValue<typeof sourceArr>
