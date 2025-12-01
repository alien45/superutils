import PromisEBase from '../PromisEBase'

export type TimeoutFunc<T extends unknown[]> = {
	all: typeof PromisEBase.all<T>
	allSettled: typeof PromisEBase.allSettled<T>
	any: typeof PromisEBase.any<T>
	race: typeof PromisEBase.race<T>
}

/**
 * `PromisE.timeout` options
 *
 * @param func (optional) name of the supported `PromieBase` static method. Default: `"all"`
 * @param timeout (optional) timeout duration in milliseconds. Default: `10_000` (10 seconds)
 * @param timeoutMsg (optional) timeout error message. Default: `"Timed out after 10000ms"`
 *
 */
export type TimeoutOptions<Func extends string = 'all'> = {
	func: Func
	timeout?: number
	timeoutMsg?: string
}
