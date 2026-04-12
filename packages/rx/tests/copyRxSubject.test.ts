import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	BehaviorSubject,
	copyRxSubject,
	IGNORE_UPDATE_SYMBOL,
	Subject,
	SubscriptionLike,
} from '../src'

describe('copyRxSubject', () => {
	let sub: SubscriptionLike | undefined

	afterEach(() => {
		vi.useRealTimers()
		sub?.unsubscribe?.()
		sub = undefined
	})

	beforeEach(() => vi.useFakeTimers())

	it('should create a new subject when only value provided instead of source subject', () => {
		const rxCopy = copyRxSubject(0)
		const spy = vi.fn()
		sub = rxCopy.subscribe(spy)
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith(0)

		// for coverage
		expect(() => rxCopy.subscribe().unsubscribe()).not.toThrow()
		expect(() => sub!.unsubscribe()).not.toThrow()
		expect(() => rxCopy.unsubscribe()).not.toThrow()
	})

	it('should ignore update whenever `valueModifier` returns IGNORE_UPDATE_SYMBOL', async () => {
		const rxNumber = new Subject<number>()
		const rxEven = new BehaviorSubject(0)
		copyRxSubject(rxNumber, rxEven, (n = 0) =>
			n < 3 ? n : IGNORE_UPDATE_SYMBOL,
		)
		const spy = vi.fn()
		sub = rxEven.subscribe(spy)

		for (let i = 1; i <= 10; i++) {
			rxNumber.next(i)
			await vi.advanceTimersByTimeAsync(10)
		}
		expect(spy).toHaveBeenCalledTimes(3)
	})

	it('should ignore update if `valueModifier` throws error', async () => {
		const rxNumber = new BehaviorSubject(0)
		const valueModifier = (n: number) => {
			if (n >= 3) throw new Error('error')

			return n
		}
		const rxCopy = copyRxSubject(rxNumber, undefined, valueModifier)
		const spy = vi.fn()
		sub = rxCopy.subscribe(spy)

		for (let i = 1; i <= 10; i++) rxNumber.next(i)
		await vi.advanceTimersByTimeAsync(1)
		expect(spy).toHaveBeenCalledTimes(3)
	})

	it('should create a new subject and copy values from source subject', async () => {
		const rxNumber = new BehaviorSubject(0)
		const rxEven = copyRxSubject(rxNumber, undefined, value =>
			value % 2 === 0 ? value : IGNORE_UPDATE_SYMBOL,
		)
		const spy = vi.fn()
		sub = rxEven.subscribe(spy)

		const count = 10
		for (let i = 1; i <= count; i++) rxNumber.next(i)

		await vi.advanceTimersByTimeAsync(1)
		expect(spy).toHaveBeenCalledTimes(Math.round(count / 2) + 1)
	})

	it('should copy multiple subjects into a new subject', async () => {
		const rxUserId = new BehaviorSubject<undefined | string>(undefined)
		const rxTheme = new BehaviorSubject<'dark' | 'lite'>('lite')
		const rxSettings = copyRxSubject([rxUserId, rxTheme, 'en'] as const)
		const spy = vi.fn()
		sub = rxSettings.subscribe(spy)

		// await vi.advanceTimersByTimeAsync(100)
		// check initial value
		expect(spy).toHaveBeenNthCalledWith(1, [undefined, 'lite', 'en'])

		rxTheme.next('dark')
		await vi.advanceTimersByTimeAsync(1)
		expect(spy).toHaveBeenCalledTimes(2)
		expect(spy).toHaveBeenNthCalledWith(2, [undefined, 'dark', 'en'])

		rxUserId.next('username')
		await vi.advanceTimersByTimeAsync(1)
		expect(spy).toHaveBeenNthCalledWith(3, ['username', 'dark', 'en'])

		rxUserId.next('username2')
		await vi.advanceTimersByTimeAsync(1)
		expect(spy).toHaveBeenNthCalledWith(4, ['username2', 'dark', 'en'])
	})

	it('should delay updates using debouce by default', async () => {
		const rxNum = new BehaviorSubject(0)
		const rxCopy = copyRxSubject(rxNum, null, null, {
			delay: 300,
		})
		const spy = vi.fn()
		sub = rxCopy.subscribe(spy)

		// expect initial value to fire a change event
		expect(spy).toHaveBeenCalledTimes(1)

		// series 1, update 1 (ignored by debounce)
		rxNum.next(1)
		await vi.advanceTimersByTimeAsync(50)
		expect(spy).toHaveBeenCalledTimes(1)

		// series 1, update 2 (ignored by debounce)
		rxNum.next(2)
		await vi.advanceTimersByTimeAsync(50)
		expect(spy).toHaveBeenCalledTimes(1)

		// series 1, update 3
		rxNum.next(3)
		await vi.advanceTimersByTimeAsync(300)
		expect(spy).toHaveBeenNthCalledWith(2, 3)

		// series 2, update 1
		rxNum.next(4)
		await vi.advanceTimersByTimeAsync(300)
		expect(spy).toHaveBeenNthCalledWith(3, 4)
	})

	it('should trigger onError callback when `valueModifier` fails', async () => {
		const onError = vi.fn()
		const rxSource = new BehaviorSubject(0)
		copyRxSubject(
			rxSource,
			null,
			() => {
				throw new Error('error')
			},
			{ onError },
		)
		expect(onError).toHaveBeenCalledTimes(1)
		rxSource.next(1)
		expect(onError).toHaveBeenCalledTimes(2)
		rxSource.next(2)
		expect(onError).toHaveBeenCalledTimes(3)
	})

	it('should update copied subject value even when it is not subscribed', async () => {
		const rxSource = new BehaviorSubject(0)
		const rxCopy = copyRxSubject(rxSource)
		expect(rxCopy.value).toBe(0)
		rxSource.next(1)
		expect(rxCopy.value).toBe(1)
	})
})
