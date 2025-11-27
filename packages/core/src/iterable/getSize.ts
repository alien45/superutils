import { isNumber } from '../is'
import { IterableList } from './types'

/** Get size/length of Array/Map/Set */
export const getSize = (x: IterableList) => {
	if (!x) return 0
	try {
		const s =
			'size' in x
				? x.size // Map/Set...
				: 'length' in x
					? x.length // arrays
					: 0
		return isNumber(s) ? s : 0
	} catch (_) {
		return 0
	}
}
export default getSize
