import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { copyToClipboard } from '../../src'

describe('copyToClipboard', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})
	beforeEach(() => {
		vi.resetModules()
	})

	it('should copy texts to clipboard using clipboard API', async () => {
		const clipboard: string[] = []
		const writeText = vi.fn(async (text: string) => {
			clipboard.push(text)
		})
		vi.stubGlobal('navigator', {
			clipboard: { writeText },
		})

		const text = 'Hello, World!'
		const result = copyToClipboard(text)
		await expect(result).resolves.toBe(1)
		expect(writeText).toHaveBeenCalledWith(text)
		expect(clipboard.slice(-1)[0]).toBe(text)
	})

	it('should fallback to document.execCommand() if clipboard API writeText fails', async () => {
		const writeText = vi
			.fn()
			.mockRejectedValue(
				new Error(
					'document.execCommand(‘cut’/‘copy’) was denied because it was not called from inside a short running user-generated event handler.',
				),
			)
		const execCommand = vi.fn().mockReturnValue(true)

		vi.stubGlobal('navigator', { clipboard: { writeText } })
		vi.stubGlobal('document', {
			execCommand,
			body: { appendChild: vi.fn(), removeChild: vi.fn() },
			createElement: vi.fn().mockReturnValue({
				select: vi.fn(),
				setSelectionRange: vi.fn(),
				setAttribute: vi.fn(),
				style: {},
				value: '',
			}),
		})

		const text = 'Text to copy after clipboard API failure'
		const result = copyToClipboard(text)

		await expect(result).resolves.toBe(2)
		expect(writeText).toHaveBeenCalledWith(text)
		expect(execCommand).toHaveBeenCalledWith('copy')
	})

	it('should return 0 when in non-browser environments and/or both methods fails', async () => {
		vi.stubGlobal('navigator', {})
		vi.stubGlobal('document', undefined)

		const result = await copyToClipboard('some text')
		expect(result).toBe(0)
	})
})
