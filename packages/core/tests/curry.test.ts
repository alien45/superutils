import { describe, expect, it, vi } from 'vitest'
import { curry } from '../src/curry'

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

    it('should allow calling with all arguments at once', () => {
        const multiply = vi.fn((a: number, b: number, c: number) => a * b * c)
        const result = curry(multiply)(2, 3, 4)
        expect(multiply).toHaveBeenCalledWith(2, 3, 4)
        expect(result).toBe(24)
    })

    it('should allow calling a curried function without any arguments', () => {
        const multiply = vi.fn((a: number, b: number, c: number) => a * b * c)
        const curriedMultiply = curry(multiply)
        const withNoneProvided = curriedMultiply()
        expect(withNoneProvided).toBeTypeOf('function')
        expect(multiply).not.toBeCalled()

        const result = withNoneProvided(2, 3, 4)
        expect(result).toBe(24)
    })

    it('should force an optional argument to be provided either with value or undefined', () => {
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
        expect(result).toBe('Hello Mr. Earthling! Your hobby is not type gymnastics.')
    })

    it('should allow early invoking by providing arity less than max possible number of arguments', () => {
        const multiply = (a: number, b: number, c?: number) => a * b * (c ?? 1)
        const curriedMultiply = curry(multiply, 2)
        const result = curriedMultiply(2, 3)
        expect(result).toBeTypeOf('number')
        expect(result).toBe(6)
    })

    it('should allow function with limitless arguments and require arity to invoke it', () => {
        const multiply = vi.fn((...args: number[]) => args.reduce((a, b) => a + b, 0))
        const curriedMultiply = curry(multiply, 3)
        const with12 = curriedMultiply(1, 2)
        const result = with12(3)
        expect(multiply).toHaveBeenCalledWith(1, 2, 3)
        expect(result).toBeTypeOf('number')
        expect(result).toBe(6)
    })

    it('should keep accepting curried arguments until arity is met even when higher arity set forcefully', () => {
        const multiply = (a: number, b: number, c?: number) => a * b * (c ?? 1)
        const curriedMultiply = (curry as any)(multiply, 6)
        // const curriedMultiply = curry(multiply, 6 as any)
        const with1 = curriedMultiply(1)
        const with2 = with1(2)
        const with3 = with2(3)
        const with4 = with3(4)
        expect(with4).toBeTypeOf('function')
        const with5 = with4(5)
        const result = with5(6)
        expect(result).toBeTypeOf('number')
        // only the first 3 arguments are used
        expect(result).toBe(6)
    })
    
})