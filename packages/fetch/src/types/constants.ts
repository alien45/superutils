/** Commonly used content types for easier access */
export const ContentType = {
	APPLICATION_JAVASCRIPT: 'application/javascript',
	APPLICATION_JSON: 'application/json',
	APPLICATION_OCTET_STREAM: 'application/octet-stream',
	APPLICATION_PDF: 'application/pdf',
	APPLICATION_X_WWW_FORM_URLENCODED: 'application/x-www-form-urlencoded',
	APPLICATION_XML: 'application/xml',
	APPLICATION_ZIP: 'application/zip',
	AUDIO_MPEG: 'audio/mpeg',
	MULTIPART_FORM_DATA: 'multipart/form-data',
	TEXT_CSS: 'text/css',
	TEXT_HTML: 'text/html',
	TEXT_PLAIN: 'text/plain',
	VIDEO_MP4: 'video/mp4',
} as const

export enum FetchAs {
	arrayBuffer = 'arrayBuffer',
	blob = 'blob',
	bytes = 'bytes',
	formData = 'formData',
	json = 'json',
	response = 'response',
	text = 'text',
}
