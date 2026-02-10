// ToDo: clean up here

// import { v1 as uuidV1 } from 'uuid'
// /*
//  * List of optional node-modules and the functions used by them:
//  * Module Name          : Function Name
//  * ------------------------------------------------------
//  * @polkadot/util-crypto: isAddress, generateHash
//  * escapeStringRegexp   : escapeStringRegexp, searchRanked
//  * form-data   			: objToFormData
//  * web3-utils  			: isAddress, isETHAddress
// */
// // default icons used in Message component
// // ToDo: move to `reactjs/components/Message`
// export const icons = {
//     basic: '',
//     error: 'exclamation circle',
//     loading: { name: 'circle notched', loading: true },
//     info: 'info',
//     success: 'check circle outline',
//     warning: 'lightning'
// }

// export const downloadFile = (content, fileName, contentType) => {
//     const a = document.createElement('a')
//     const file = new Blob([content], { type: contentType })
//     a.href = URL.createObjectURL(file)
//     a.download = fileName
//     a.click()
// }

// /**
//  * @name	generateHash
//  * @summary generate hash using supplied data
//  *
//  * @param	{String}	seed		data to generate hash of
//  * @param	{String}	algo		Supported algorithms: blake2 (default), keccak
//  * @param	{Number}	bitLength 	Default: 256
//  */
// export const generateHash = (seed = uuidV1(), algo = 'blake2', bitLength = 256) => {
//     const { blake2AsHex, keccakAsHex } = require('@polkadot/util-crypto')
//     seed = isUint8Arr(seed)
//         ? seed
//         : isStr(seed)
//             ? seed
//             : JSON.stringify(seed)
//     switch (`${algo}`.toLowerCase()) {
//         case 'keccak':
//             return keccakAsHex(seed)
//         case 'blake2':
//         default:
//             return blake2AsHex(seed, bitLength)
//     }
//     return // unsuporrted
// }

// /**
//  * @name    isAddress
//  * @summary validates if supplied is a valid address
//  *
//  * @param    {String}	address
//  * @param    {String}	type            (optional) valid types: polkadot (default), ethereum
//  * @param    {Number}	chainId			(optional) chainId for Ethereum address, ss58Format for Polkadot.
//  * 										Default: `undefined` (for Polkadot), `0` for Ethereum
//  * @param    {Boolean}	ignoreChecksum	(optional) for Polkadot only.
//  * 										Default: false
//  */
// export const isAddress = (address, type, chainId, ignoreChecksum = false) => {
//     try {
//         switch (`${type}`.toLowerCase()) {
//             case 'ethereum': return isETHAddress(address, chainId ?? 0)
//             case 'polkadot':
//             default:
//                 const { ss58Decode } = require('./convert')
//                 // assume Polkadot/Totem address
//                 const account = ss58Decode(address, ignoreChecksum, chainId)
//                 // must be 32 bytes length
//                 return !!account && account.length === 32
//         }
//     } catch (e) {
//         return false
//     }
// }
// isAddress.validTypes = {
//     ethereum: 'ethereum',
//     polkadot: 'polkadot',
// }
// export const isETHAddress = (address, chainId) => {
//     const { isAddress } = require('web3-utils')
//     return isAddress(address, chainId)
// }
// export const isHash = x => fallbackIfFails(() => HASH_REGEX.test(x), [], false)
// export const isHex = x => fallbackIfFails(() => HEX_REGEX.test(x), [], false)

// // Checks if argument is an Array of Objects. Each element type must be object, otherwise will return false.
// export const isObjArr = x => isArr(x) && x.every(isObj)
// // Checks if argument is a Map of Objects. Each element type must be object, otherwise will return false.
// export const isObjMap = x => isMap(x) && Array.from(x).every(([_, v]) => isObj(v))

// /**
//  * @name	className
//  * @summary formats supplied value into CSS class name compatible string for React
//  *
//  * @param	{Object|Array} value
//  *
//  * @returns	{String}
//  *
//  * @example
//  * ```JavaScript
//  * const isSection = false
//  * const isIcon = true
//  * const withBorder = false
//  * const str = className([
//  *     'ui',
//  *     { section: isSection, icon: isIcon },
//  *     withBorder && 'bordered',
//  * ])
//  *
//  * // expected result: 'ui icon'
//  * ```
//  */
// export const className = value => {
//     if (isStr(value)) return value
//     if (isObj(value)) {
//         // convert into an array
//         value = Object.keys(value)
//             .map(key => !!value[key] && key)
//     }
//     if (!isArr(value)) return ''
//     return value
//         .filter(Boolean)
//         .map(x => !isObj(x) ? x : className(x))
//         .join(' ')
// }

// /**
//  * @name	objEvalRxProps
//  * @summary evaluate/extract values from properties with RxJS subject.
//  *
//  * @param {Object}	obj
//  * @param {Array}	recursive property names of child objects to check and evaluate/extract RxJS subject value.
//  *
//  * @returns {Object} a new object with RxJS subject values extracted for specified properties.
//  */
// export const objEvalRxProps = (obj = {}, recursive = []) => {
//     const output = { ...obj }
//     Object
//         .keys(output)
//         .forEach(key => {
//             output[key] = isSubjectLike(output[key])
//                 ? output[key].value
//                 : recursive === true || recursive?.includes?.(key)
//                     ? objEvalRxProps(output[key], false)
//                     : output[key]
//         })

//     return output
// }

// /**
//  * @name	objToUrlParams
//  * @summary	constructs URL param string from an object, excluding any `undefined` values
//  *
//  * @param	{Object} obj
//  *
//  * @returns	{String}
//  */
// export const objToUrlParams = (obj = {}, excludeUndefined = true) => {
//     const params = new URLSearchParams(obj)
//     // Object
//     // 	.keys(obj)
//     // 	.forEach(key => {
//     // 		const value = obj[key]
//     // 		if (value === undefined && excludeUndefined) return

//     // 		params.set(key, value)
//     // 	})
//     return params.toString()
// }
// // Object.keys(obj)
// // .map(key => {
// // 	const value = obj[key]
// // 	if (excludeUndefined && value === undefined) return
// // 	const valueEscaped = !isArr(value)
// // 		? escape(value)
// // 		// prevents escaping comma when joining array
// // 		: value.map(escape).join()
// // 	return `${key}=${valueEscaped}`

// // })
// // .filter(Boolean)
// // .join('&')

// export const objToFormData = (obj = {}, excludeUndefined = true) => {
//     let formData = new FormData()
//     Object.keys(obj).forEach(key => {
//         let value = obj[key]
//         if (excludeUndefined && value === undefined) return
//         if (isArr(value)) value = value.join()
//         formData.append(key, value)
//     })
//     return formData
// }

// /**
//  * @name			searchRanked
//  * @summary 		enhanced search for Dropdown
//  * @description		Semantic UI Dropdown search defaults to only 'text' option property.
//  * 					See FormInput for usage.
//  * @param {Array}	searchKeys	Object properties (keys) to search for.
//  * 								Default: ['text'] (for Dropdown and similar input fields)
//  * @param {Number}  maxResults	limits maximum number of results returned.
//  * 								Default: `100`
//  *
//  * @returns	{Function}	a callback function. Params:
//  *						@options 		array of objects
//  *						@searchQuery	string
//  *						returns array of objects
//  */
// export const searchRanked = (searchKeys = ['text'], maxResults = 100) => (options, searchQuery) => {
//     if (!options || options.length === 0) return []
//     if (!searchQuery) return options.slice(0, maxResults)

//     const uniqueValues = {}
//     const regex = new RegExp(escapeStringRegexp(searchQuery || ''), 'i')
//     if (!searchQuery) return options.slice(0, maxResults)

//     const search = key => {
//         const matches = options.map((option, i) => {
//             try {
//                 if (!option || !hasValue(option[key])) return

//                 // catches errors caused by the use of some special characters with .match() below
//                 let x = fallbackIfFails(() => JSON.stringify(option[key]), [], '')
//                     .match(regex)
//                 if (!x || uniqueValues[options[i].value]) return

//                 const matchIndex = x.index
//                 uniqueValues[options[i].value] = 1
//                 return { index: i, matchIndex }
//             } catch (e) {
//                 console.log(e)
//             }
//         }).filter(Boolean)

//         return arrSort(matches, 'matchIndex').map(x => options[x.index])
//     }

//     return searchKeys
//         .reduce((result, key) => result.concat(search(key)), [])
//         .slice(0, maxResults)
// }

// /**
//  * @name	textCapitalize
//  * @summary capitalizes the first letter of input
//  *
//  * @param	{String|Object|Array} input
//  * @param	{Boolean} 		fullSentence   (optional) whether to capitalize every single word or just the first word
//  * @param	{Boolean}		forceLowercase (optional) convert string to lower case before capitalizing
//  * @param	{Object|Array}	output		   (optional) create a new object or merge with existing one.
//  * 										   Default: `input` (overrides texts)
//  *
//  * @returns {*}
//  */
// export const textCapitalize = (
//     input,
//     fullSentence = false,
//     forceLowercase = false,
//     output = input,
// ) => {
//     if (!input) return input ?? ''
//     if (isStr(input)) {
//         if (forceLowercase) input = input.toLowerCase()
//         if (!fullSentence) return input[0].toUpperCase() + input.slice(1)
//         return input.split(' ')
//             .map(word => textCapitalize(word, false))
//             .join(' ')
//     }
//     if (!input || typeof input !== 'object') return ''

//     Object
//         .keys(input)
//         .forEach(key =>
//             output[key] = textCapitalize(
//                 input[key],
//                 fullSentence,
//                 forceLowercase,
//             )
//         )
//     return output
//     // return Object.keys(input)
//     // 	.reduce((obj, key) => {
//     // 		obj[key] = textCapitalize(
//     // 			input[key],
//     // 			fullSentence,
//     // 			forceLowercase,
//     // 		)
//     // 		return obj
//     // 	}, isArr(input) ? [] : {})
// }

// /**
//  * @name	textEllipsis
//  * @summary shortens string into 'abc...xyz' or 'abcedf...' form
//  *
//  * @param	{string} text
//  * @param	{Number} maxLen	 maximum length of the shortened text including dots
//  * @param	{Number} numDots (optional) number of dots to be inserted in the middle.
//  * 							 Default: 3
//  * @param	{Boolean} split  (optional) If false, will add dots at the end, otherwise, in the middle.
//  * 							 Default: true
//  *
//  * @returns {String}
//  */
// export const textEllipsis = (text, maxLen, numDots, split = true) => {
//     if (!isStr(text)) return ''
//     if (!maxLen || text.length <= maxLen) return text
//     numDots = numDots || 3
//     const textLen = maxLen - numDots
//     const partLen = Math.floor(textLen / 2)
//     const isEven = textLen % 2 === 0
//     const arr = text.split('')
//     const dots = new Array(numDots).fill('.').join('')
//     const left = arr.slice(0, split ? partLen : maxLen - numDots).join('')
//     const right = !split
//         ? ''
//         : arr.slice(
//             text.length - (isEven ? partLen : partLen + 1)
//         ).join('')
//     return left + dots + right
// }

// /**
//  * @name	toArray
//  * @summary convert string or other itearables' values to Array
//  *
//  * @param	{String|Array|Map|Set}	value
//  * @param	{String}				seperator (optional) only used when value is a string
//  *
//  * @returns {Array}
//  */
// export const toArray = (value, seperator = ',') => isStr(value)
//     ? value
//         .split(seperator)
//         .filter(Boolean)
//     : isFn((value || []).values)
//         ? [...value.values()]
//         : []
