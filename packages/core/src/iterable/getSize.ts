import { isNumber } from '../is'
import { IterableList } from './types'

export const getSize = (x: IterableList) => {
	if (!x) return 0
	const s = 'size' in x ? x.size : 'length' in x ? x.length : 0
	return isNumber(s) ? s : 0
}
export default getSize
