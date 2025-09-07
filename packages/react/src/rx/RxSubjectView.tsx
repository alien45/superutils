import { ReactNode, useEffect, useMemo, useState } from 'react'
import { BehaviorSubject } from 'rxjs'

export type RenderFunc<T = unknown> = (value: T, subject: BehaviorSubject<T>) => ReactNode
export type SubjectOrFunc<T = unknown> = BehaviorSubject<T> | (() => BehaviorSubject<T>)
export type RenderOrChildren<T = unknown> = 
| {
    children?: never,
    render: RenderFunc<T>
} 
| {
    children: RenderFunc<T>,
    render?: never,
}
export type RxSubjectViewProps<T = unknown> =  {
    subject: BehaviorSubject<T> | (() => BehaviorSubject<T>)
} & RenderOrChildren<T>

export default function RxSubjectView<T = any>(props: RxSubjectViewProps<T>) {
    const { subject } = props
    const render = 'render' in props 
        ? props.render
        : props.children
	const rxSubject = useMemo<BehaviorSubject<T>>(() =>
		typeof subject === 'function'
			? subject()
			: subject,
		[subject]
	)
	const [value, setValue] = useState(rxSubject.value)

	useEffect(() => {
		let mounted = true
		const subscription = rxSubject.subscribe(value => mounted && setValue(value))

		return () => {
			mounted = false
			subscription.unsubscribe()
		}
	}, [rxSubject])

	const content = render?.(value, rxSubject) ?? value
	return content
}