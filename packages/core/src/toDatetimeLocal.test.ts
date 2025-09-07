import { describe, expect, it } from 'vitest'
import { toDatetimeLocal } from './toDatetimeLocal'

describe('toDatetimeLocal', () => {
    it('should format a Date object into a datetime-local string', () => {
        const date = new Date(2023, 9, 27, 10, 0) // October 27, 2023, 10:00:00 local time
        expect(toDatetimeLocal(date)).toBe('2023-10-27T10:00')
    })

    it('should return empty string for invalid dates', () => {
        const date = new Date(undefined as any) // Invalid Date {}
        expect(toDatetimeLocal(date)).toBe('')
    })

    it('should handle the current date', () => {
        const now = new Date()
        const pad = (x: number) => `${x}`.padStart(2, '0')
        const year = now.getFullYear()
        const month = pad(now.getMonth() + 1)
        const day = pad(now.getDate())
        const hours = pad(now.getHours())
        const minutes = pad(now.getMinutes())
        const expected = `${year}-${month}-${day}T${hours}:${minutes}`
        const result = toDatetimeLocal(now)
        expect(result).toBe(expected)
    })
})
