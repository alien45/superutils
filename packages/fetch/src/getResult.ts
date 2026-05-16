import { fallbackIfFails, isFn } from '@superutils/core'
import { ContentType, FetchAs, FetchResult, OnDownloadProgress } from './types'

/**
 * Processes the response body based on the `as` parameter, optionally reporting download progress.
 *
 * If `onDownloadProgress()` is provided, it reads the body as a stream to calculate progress,
 * otherwise it uses the standard response body methods.
 *
 * **Note:** Progress tracking is not supported when `as` is set to `FetchAs.response`,
 * as the body stream is returned directly to the caller without being consumed here.
 *
 * @template T The expected type of JSON result (if `as` is 'json').
 * @template As The format to parse the response as.
 * @template Result The resulting type based on the requested format.
 * @param response The response to read.
 * @param as How to parse the result (e.g., 'json', 'blob', 'text'). Defaults to 'json'.
 * @param onDownloadProgress Optional callback function to handle progress updates.
 * @returns A promise resolving to the parsed result.
 */
export const getResult = async <
	T,
	const As extends FetchAs = FetchAs.json,
	const Result = FetchResult<T>[As],
>(
	response: Response,
	as = FetchAs.json as As,
	onDownloadProgress?: OnDownloadProgress,
): Promise<Result> => {
	if (!isFn(onDownloadProgress) || as === FetchAs.response) {
		const parseFunc = response[as as keyof typeof response]
		const result = !isFn(parseFunc) ? response : parseFunc.bind(response)()
		return result as Result
	}

	const reader = response?.body?.getReader()

	const contentLength = response.headers.get('Content-Length')
	const total = contentLength ? parseInt(contentLength, 10) : null
	const chunks = new Chunks(
		[] as Uint8Array<ArrayBuffer>[],
		response.headers.get('content-type')!,
	)
	let received = 0

	while (reader) {
		const { done, value } = await reader.read()
		if (done) break

		chunks.value.push(value)
		received += value.length // Uint8Array length

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fallbackIfFails(
			onDownloadProgress,
			total
				? [(100 * received) / total, received, total]
				: [null, received, null],
			null,
		)
	}

	switch (as) {
		case FetchAs.arrayBuffer:
			return chunks.toArrayBuffer() as Result
		case FetchAs.blob:
			return chunks.toBlob() as Result
		case FetchAs.bytes:
			return chunks.toBytes() as Result
		case FetchAs.formData:
			return chunks.toFormData() as Result
		case FetchAs.text:
			return chunks.toText() as Result
		case FetchAs.json:
			break
	}
	return chunks.toJSON()
}

export default getResult

/**
 * A utility class for accumulating and transforming stream chunks (Uint8Array)
 * into various data formats like Blob, JSON, or Text.
 *
 * @template T - The type of the chunks array.
 */
export class Chunks<T extends Uint8Array<ArrayBuffer>[]> {
	/**
	 * @param value The initial array of chunks.
	 * @param contentType The MIME type of the content for Blob/FormData conversion.
	 * @param encoding The character encoding for text decoding. Defaults to 'utf-8'.
	 */
	constructor(
		public value: T,
		public contentType = '',
		public encoding = 'utf-8',
	) {}

	/**
	 * Concatenates all accumulated chunks into a single Uint8Array.
	 *
	 * @returns A single Uint8Array containing the merged data.
	 */
	concatChunks() {
		const total = this.value.reduce((s, c) => s + c.byteLength, 0)
		const out = new Uint8Array(total)
		let off = 0
		for (const u of this.value) {
			out.set(u, off)
			off += u.byteLength
		}
		return out
	}

	/**
	 * Converts the accumulated data to an ArrayBuffer.
	 */
	toArrayBuffer = () => this.concatChunks().buffer

	/**
	 * Converts the accumulated data to a Blob
	 *
	 * @param type content type. Default: `this.contentType`
	 */
	toBlob = (type = this.contentType) => new Blob(this.value, { type: type })

	/**
	 * Converts the accumulated data to a single Uint8Array.
	 */
	toBytes = () => this.concatChunks()

	/**
	 * Attempts to convert the accumulated data to FormData.
	 *
	 * If the `contentType` is `application/x-www-form-urlencoded` or the content appears to be
	 * query parameters, it parses them into FormData. Otherwise, it appends the entire
	 * content as a Blob under the key 'file'.
	 *
	 * @param encoding Optional encoding override for text decoding.
	 * @returns A FormData instance containing the data.
	 */
	toFormData(encoding = this.encoding) {
		const text = this.toText(encoding)
		const formData = new FormData()
		if (
			this.contentType.includes(
				ContentType.APPLICATION_X_WWW_FORM_URLENCODED,
			)
			|| text.includes('=')
		) {
			const params = new URLSearchParams(text)
			for (const [k, v] of params) formData.append(k, v)
			return formData
		}

		// fallback: put whole body as a blob under a key
		formData.append('file', new Blob([text]))
		return formData
	}

	/**
	 * Decodes the data as text and parses it as JSON.
	 *
	 * @template T The expected type of the JSON result.
	 * @param encoding Optional encoding override.
	 * @returns The parsed JSON object.
	 */
	toJSON = <T = unknown>(encoding = this.encoding) =>
		JSON.parse(this.toText(encoding)) as T

	/**
	 * Decodes the accumulated chunks into a string.
	 *
	 * @param encoding The character encoding to use. Defaults to the instance's `encoding`.
	 */
	toText = (encoding = this.encoding) =>
		new TextDecoder(encoding).decode(this.concatChunks())
}
