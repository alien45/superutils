import { describe, expect, it } from 'vitest'
import {
	BehaviorSubject,
	IntervalSubject,
	isSubjectLike,
	Subject,
} from '../src'

describe('isSubjectLike', () => {
	it('should return true when value is RxJS subject-like', () => {
		expect(isSubjectLike(new BehaviorSubject(0))).toBe(true)
		expect(isSubjectLike(new Subject())).toBe(true)
		expect(isSubjectLike(new IntervalSubject(true, 1000, 0, 1))).toBe(true)
	})
	it('should return false when value is not subject-like', () => {
		expect(isSubjectLike(0)).toBe(false)
		expect(isSubjectLike(null)).toBe(false)
		expect(isSubjectLike({})).toBe(false)
		expect(isSubjectLike(new Map())).toBe(false)
		expect(isSubjectLike([])).toBe(false)
	})
})
