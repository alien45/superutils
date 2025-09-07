import { describe, expect, it, vi } from 'vitest'
import { curry } from './curry'

describe('curry', () => {

    it('should curry a function with multiple arguments', () => {
        const add = (a: number, b: number, c: number) => a + b + c
        const curriedAdd = curry(add)

        const with1 = curriedAdd(1)
        const with1n2 = with1(2)
        const result = with1n2(3)
        expect(with1).toBeTypeOf('function')
        expect(result).toBe(6)
    })

    it('should should force an optional argument to be provided either with value or undefined', () => {
        const greeter = vi.fn((
            name: string,
            age?: number,
            hobby?: string,
        ) => [
            `Hello ${name}!`,
            age !== undefined && `You are ${age} years old.`,
            hobby && `Your hobby is ${hobby}.`,
        ].filter(Boolean).join(' '))
        const curriedGreeter = curry(greeter)
        const wName = curriedGreeter('Mr. Earthling')
        expect(wName).toBeTypeOf('function')

        const wAge = wName(undefined)
        expect(wAge).toBeTypeOf('function')

        const result = wAge('not type gymnastics')
        expect(result).toBe([
            'Hello Mr. Earthling!',
            'Your hobby is not type gymnastics.',
        ].join(' '))
    })

    it('should allow calling with all arguments at once', () => {
        const multiply = vi.fn((a: number, b: number, c: number) => a * b * c)
        const result = curry(multiply)(2, 3, 4)
        expect(multiply).toHaveBeenCalledWith(2, 3, 4)
        expect(result).toBe(24)
    })

    it('should allow calling without any arguments which return a curried function with previously provided arguments', () => {
        const multiply = (a: number, b: number, c: number) => a * b * c
        const curriedMultiply = curry(multiply)
        const withNoneProvided = curriedMultiply()
        expect(withNoneProvided).toBeTypeOf('function')

        const result = withNoneProvided(2, 3, 4)
        expect(result).toBe(24)
    })

    it('should allow early invoking by providing arity less than max possible number of arguments', () => {
        const multiply = (a: number, b: number, c?: number) => a * b * (c ?? 1)
        const curriedMultiply = curry(multiply, 2)
        const result = curriedMultiply(2, 3)
        // TS expects it to be a function, but because of arity lower than the number
        // of total arguments `multiply()` has been invoked
        expect(result).not.toBeTypeOf('function')
        expect(result).toBe(6)
    })

    it('should should not invoke until number of arguments is the same as arity provided', () => {
        const multiply = (a: number, b: number, c?: number) => a * b * (c ?? 1)
        const curriedMultiply = curry(multiply, 4)
        const with3Args = curriedMultiply(2, 3, 4)
        // TS expects it to be number but a function will be returned at runtime
        // because of the higher number of arity
        expect(with3Args).toBeTypeOf('function')

        // Since, TS expects it to be a number, we need to force it to be invoked as a function
        const result = (with3Args as any)(99)
        expect(result).toBe(24)
    })
})