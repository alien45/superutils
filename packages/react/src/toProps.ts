import { HTMLProps, isValidElement, ReactNode } from 'react'
import { isObj } from '@utiils/core'

/**
 * @name    toProps
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
    childrenProp: string = 'children',
    extractElementProps: boolean = true
): null | HTMLProps<any> => {
    if (elOrProps === null) return elOrProps

    childrenProp ??= 'children'
    const props = isValidElement(elOrProps)
        ? extractElementProps
            ? elOrProps.props // react element
            : { [childrenProp]: elOrProps }
        : isObj(elOrProps)
            ? elOrProps // plain object
            : { [childrenProp]: elOrProps } // assume string or element
    return { ...props || {} }
}