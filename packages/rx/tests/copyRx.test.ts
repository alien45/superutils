import PromisE from '@superutils/promise'
import { BehaviorSubject, Subject, SubscriptionLike } from 'rxjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import copyRx from '../src/copyRx'

describe('copyObservable', () => {
	let sub: SubscriptionLike | undefined

	afterEach(() => {
		vi.useRealTimers()
		sub?.unsubscribe?.()
		sub = undefined
	})

	beforeEach(() => vi.useFakeTimers())

	it('should create a new subject when only value provided instead of source subject', () => {
		const rxCopy = copyRx(0 as any)
		const spy = vi.fn()
		sub = rxCopy.subscribe(spy)
		expect(spy).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledWith(0)

		// for coverage
		expect(() => rxCopy.subscribe().unsubscribe()).not.toThrow()
		expect(() => sub!.unsubscribe()).not.toThrow()
		expect(() => rxCopy.unsubscribe()).not.toThrow()
	})

	it('should ignore update whenever `transform` returns IGNORE_UPDATE_SYMBOL', async () => {
		const rxNumber = new Subject<number>()
		const rxEven = new BehaviorSubject(0)
		const transform = (n = 0) => (n < 3 ? n : copyRx.IGNORE)
		copyRx(rxNumber, transform, {
			output: rxEven,
		})
		const spy = vi.fn()
		sub = rxEven.subscribe(spy)

		for (let i = 1; i <= 10; i++) {
			rxNumber.next(i)
			await vi.advanceTimersByTimeAsync(10)
		}
		expect(spy).toHaveBeenCalledTimes(3)
	})

	it('should ignore update if `transform` throws error', async () => {
		const rxNumber = new BehaviorSubject(0)
		const transform = (n: number = 0) => {
			if (n >= 3) throw new Error('error')

			return n
		}
		const rxCopy = copyRx(rxNumber, transform)
		const spy = vi.fn()
		sub = rxCopy.subscribe(spy)

		for (let i = 1; i <= 10; i++) rxNumber.next(i)
		await vi.advanceTimersByTimeAsync(1)
		expect(spy).toHaveBeenCalledTimes(3)
	})

	it('should create a new subject and copy values from source subject', async () => {
		const rxNumber = new BehaviorSubject(0)
		const transform = (value: number = 0) =>
			value % 2 === 0 ? value : copyRx.IGNORE
		const rxEven = copyRx(rxNumber, transform)
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
		const rxSettings = copyRx([rxUserId, rxTheme, 'en'] as const)
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
		const rxCopy = copyRx(rxNum, undefined, {
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

	it('should trigger onError callback when `transform` fails', async () => {
		const onError = vi.fn()
		const rxSource = new BehaviorSubject(0)
		copyRx(
			rxSource,
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
		const rxCopy = copyRx(rxSource)
		expect(rxCopy.value).toBe(0)
		rxSource.next(1)
		expect(rxCopy.value).toBe(1)
	})

	it('should have correct initial value', async () => {
		const input = new BehaviorSubject(0)
		const copy = copyRx(input, x => x?.toFixed(2))
		const spy = vi.fn()
		sub = copy.subscribe(spy)

		input.next(1)
		input.next(2)
		input.next(3)
		input.next(4)
		input.next(5)

		await vi.advanceTimersByTimeAsync(801)
		expect(spy).toHaveBeenNthCalledWith(1, '0.00')
		expect(spy).toHaveBeenNthCalledWith(2, '1.00')
		expect(spy).toHaveBeenNthCalledWith(3, '2.00')
		expect(spy).toHaveBeenNthCalledWith(4, '3.00')
		expect(spy).toHaveBeenNthCalledWith(5, '4.00')
		expect(spy).toHaveBeenNthCalledWith(6, '5.00')

		sub.unsubscribe()
	})

	describe('transform', () => {
		it('should use `thisArg` when provided', () => {
			let transformThis: string
			let onErrorThis: string

			copyRx(
				new Subject(),
				function () {
					transformThis = this
					throw new Error('error') // trigger onError
				},
				{
					onError: function () {
						onErrorThis = this
					},
					thisArg: 'thisArg',
				},
			)
			expect(onErrorThis!).toBe('thisArg')
			expect(transformThis!).toBe('thisArg')
		})

		it('should handle async `transform` function', async () => {
			const rxSource = new BehaviorSubject(0)
			const rxCopy = copyRx(
				rxSource,
				async (value = 0) => PromisE.delay(1, value.toFixed(2)), // resolve after delay
				{ initialValue: '0.00' },
			)
			const spy = vi.fn()
			sub = rxCopy.subscribe(spy)
			expect(spy).toHaveBeenCalledWith('0.00')

			rxSource.next(1)
			await vi.advanceTimersByTimeAsync(1)
			expect(spy).toHaveBeenCalledWith('1.00')

			sub.unsubscribe()
		})

		it('should avoid `transform` race conditions when `transformSequentially = true`', async () => {
			const input = new BehaviorSubject<number>(0)
			const receivedValues: number[] = []
			let count = 0
			const delays = [200, 100, 300, 0]
			const transform = vi.fn(async value => {
				return PromisE.delay(delays[count++], () => {
					const transformred = value.toFixed(2)
					receivedValues.push(transformred)
					return transformred
				}) // resolve after delay
			})

			const rxCopy = copyRx(input, transform, {
				transformSequentially: true,
			})

			const spy = vi.fn()
			sub = rxCopy.subscribe(spy)

			input.next(1)
			input.next(2)
			input.next(3)
			input.next(4)
			input.next(5)

			await vi.advanceTimersByTimeAsync(801)
			expect(spy).toHaveBeenNthCalledWith(1, undefined) // because of async transform
			expect(spy).toHaveBeenNthCalledWith(2, '0.00')
			expect(spy).toHaveBeenNthCalledWith(3, '1.00')
			expect(spy).toHaveBeenNthCalledWith(4, '2.00')
			expect(spy).toHaveBeenNthCalledWith(5, '3.00')
			expect(spy).toHaveBeenNthCalledWith(6, '4.00')
			expect(spy).toHaveBeenNthCalledWith(7, '5.00')

			// ensures values received sequentially
			expect(receivedValues).toEqual([
				'0.00',
				'1.00',
				'2.00',
				'3.00',
				'4.00',
				'5.00',
			])
			sub.unsubscribe()
		})

		it('should avoid `transform` race conditions when `transformSequentially = true` and `delay > 0`', async () => {
			const input = new BehaviorSubject<number>(0)
			const receivedValues: number[] = []
			let count = 0
			const delays = [400, 300, 200, 100, 0]
			const transform = vi.fn(async value => {
				return PromisE.delay(delays[count++], () => {
					const transformred = value.toFixed(2)
					receivedValues.push(transformred)
					return transformred
				}) // resolve after delay
			})

			const rxCopy = copyRx(input, transform, {
				delay: 100,
				transformSequentially: true,
			})

			const spy = vi.fn()
			sub = rxCopy.subscribe(spy)

			input.next(1) // ignored by debouce
			input.next(2)
			await vi.advanceTimersByTimeAsync(100)
			input.next(3) // ignored by debouce
			input.next(4) // ignored by debouce
			input.next(5)

			await vi.advanceTimersByTimeAsync(801)
			expect(spy).toHaveBeenNthCalledWith(1, undefined) // because of async transform
			expect(spy).toHaveBeenNthCalledWith(2, '2.00')
			expect(spy).toHaveBeenNthCalledWith(3, '5.00')

			// ensures values received sequentially
			expect(receivedValues).toEqual(['2.00', '5.00'])
			sub.unsubscribe()
		})
	})
})
