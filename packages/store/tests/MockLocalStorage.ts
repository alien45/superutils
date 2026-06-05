import { vi } from 'vitest'
import { StorageCompact } from '../src'

export default class MockLocalStorage implements StorageCompact {
	storage = new Map<string, string>()

	getItem = vi.fn((key: string): string | null => {
		return this.storage.get(key) ?? null
	})

	setItem = vi.fn((key: string, value: string): void => {
		this.storage.set(key, value)
	})
}
