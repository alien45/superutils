import { HTMLProps, isValidElement, ReactNode } from 'react'
import { isObj } from '@superutils/core'

/**
 * @function    toProps
 * @summary extract/generate props object to be supplied to an element
 *
 * @param   {String|ReactNode|Object} elOrProps
 * @param   {String}                childrenProp    (optional) Default: `children`
 * @param   {Boolean}               extractElementProps
 *
 * @returns {Object}
 */
export const toProps = (
	elOrProps: string | ReactNode | object = {},
	childrenProp = 'children',
	extractElementProps = true,
): null | HTMLProps<unknown> => {
	if (elOrProps === null) return elOrProps

	childrenProp ??= 'children'
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const props = isValidElement(elOrProps)
		? extractElementProps
			? elOrProps.props // react element
			: { [childrenProp]: elOrProps }
		: isObj(elOrProps)
			? elOrProps // plain object
			: { [childrenProp]: elOrProps } // assume string or element
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return { ...(props ?? {}) }
}
