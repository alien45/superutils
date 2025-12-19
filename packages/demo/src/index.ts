import {
	asAny,
	fallbackIfFails,
	toDatetimeLocal,
	TupleMaxLength,
	arrReverse,
	reverse,
	randomInt,
} from '@superutils/core'
import { PromisE, ResolveIgnored, IPromisE } from '@superutils/promise'

import {
	BehaviorSubject,
	copyRxSubject,
	IntervalSubject,
	subjectAsPromise,
	SubjectLike,
} from '@superutils/rx'
import { distinctUntilChanged } from 'rxjs'

console.log('Started')

// require('./benchmark-arr-reverse')

// ;(async () => {
// 	const count = 1_000_000
// 	const getPromises = (Promise: any, arg?: any) =>
// 		new Array(count)
// 			.fill(0)
// 			.map((_, i) => new Promise(arg ?? ((resolve: any) => resolve(i))))

// 	// console.time('Promise')
// 	// await Promise.all(getPromises(Promise))
// 	// console.timeEnd('Promise')

// 	console.time('PromisE with promise')
// 	await Promise.all(getPromises(PromisE, new Promise(r => r(1))))
// 	console.timeEnd('PromisE with promise')

// 	// console.time('PromisE with funtion')
// 	// await Promise.all(getPromises(PromisE))
// 	// console.timeEnd('PromisE with funtion')

// 	// console.time('PromisE: manual')
// 	// const promises = getPromises(Promise<number>) as IPromisE<number>[]

// 	// await Promise.all(promises.map(promise => {
// 	//     promise.then(
// 	//         () => asAny(promise).resolved = true,
// 	//         () => asAny(promise).rejected = true,
// 	//     ).finally(() => asAny(promise).pending = false)
// 	// }))
// 	// const allResolved = promises.every(promise => promise.resolved)
// 	// console.log({allResolved})
// 	// console.timeEnd('PromisE: manual')
// })().then(() => console.log('Done'))

// const context: Parameters<typeof PromisE.deferredCallback>[1] & Record<string, any> = {
//     delayMs: 100,
//     error: null,
//     ignored: false,
//     result: null,
//     onError(err) { this.error = err },
//     onIgnore() { this.ignored = true },
//     onResult(res) { this.result = res },
//     get thisArg() { return this }
// }
// const callback = async (value: number) => {
//     if (value === 3) throw 'error'
//     // if (value === 3) return PromisE.delayReject(50, 'error')
//     // return PromisE.delay(50, `${value}`)
//     return value
// }
// const deferredCb = PromisE.deferredCallback(callback, context)
// deferredCb(1)
// deferredCb(2)
// deferredCb(3)
//     .then(console.log, () => {})
// Promise.try(callback, 3)
// fallbackIfFails(async(n: number) => {
//     if (n === 2) throw 'error'
//     return n
// }, [2], err => Promise.reject(err))

// const fallback = (reason: any) => PromisE.resolve<number>(4)
// const z = fallbackIfFails(
//     callback,
//     [3],
//     Promise.resolve(8), // fallback,
//     // err => PromisEBase.reject<TResult>(err),
// )
// console.log({z})
// z?.then?.(console.log, console.trace)

// keep the app alive
// setInterval(() => { }, 1000 * 60 * 60 * 24)
// console.log('testing post')
// const addProduct = PromisE.deferredPost(
//     {
//         defer: 300,
//         onResult: <T = {id: string, title: string}>(result: T) => console.log({result}),
//         resolveIgnored: ResolveIgnored.NEVER,
//         throttle: false,
//     },
//     'https://dummyjson.com/products/add',
//     undefined, //{ title: 'default', description: 'default', price: 100 },
//     { credentials: 'include' },
//     5000
// );

// addProduct<{id: string, title: string}>(
//     undefined,
//     { title: 'product 1', description: 'juicy lemon', price: 1 },

// ).then(result => console.log('then', result))

// const df = PromisE_deferred<number>()
// df(() => PromisEBase.delay(5000)).then()
// addProduct()
// ;(async () => {
//     addProduct().then((result) => {
//         result = result as {a: string}
//         console.log(result)
//     })
//     // await PromisE.delay(200)
//     // addProduct({ title: 'second'}).then(console.log)
//  })()

// const saveDeferred = PromisE.deferredPost(
//     {
//         defer: 100,
//         resolveIgnored: ResolveIgnored.NEVER,
//         // throttle: true,
//     },
//     'https://dummyjson.com/auth/login',
//     // {
//     //     username: 'emilys',
//     //     password: 'emilyspass',
//     //     expiresInMins: 30,
//     // },
// );
//

// saveDeferred(undefined, undefined, { credentials: 'include' }, 5000 )
// const saveWOUrl = (...args: DropFirstN<Parameters<typeof saveDeferred>, 3>) => saveDeferred(undefined, undefined, ...args)
// new Array(10).fill(0).map((_, i) =>
//     saveDeferred(undefined).then(post => console.log(i + 1, {post}))
// )

// const deferredCb = PromisE.deferredCallback(
//     <A = string, B = number, C = boolean>(a: A, b: B,  c: C) => `${a}: ${b}: ${c}`,
//     { defer: 300}
// )
// const curryCb = curry(deferredCb)
// const withA = curryCb('a')
// const withB = withA(2)
// const res = withB(false)

// const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
// const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
//     defer: 300,
//     throttle: true, // throttle with delay duration set in `defer`
// })

// // simulate click event
// ;[
//     100,
//     150,
//     200,
//     550,
//     580,
//     600,
//     1000,
//     1100,
// ].forEach(ms => setTimeout(() => handleChangeDeferred({ target: { value: ms } }), ms))

// Fetch paginated products
// const getProducts = PromisE.deferredFetch(
//     {
//         defer: 300,
//         resolveIgnored: ResolveIgnored.WITH_UNDEFINED,
//         onIgnore: promise => promise().then((x: {id: string}) => x.id),
//         onResult: (product?: {id: string}) => product?.id,
//         throttle: true,
//     },
// )
// ;(async () => {
//    getProducts('https://dummyjson.com/products/1').then(x => console.log(x))
//    await PromisE.delay(300)
//    getProducts('https://dummyjson.com/products/2').then(console.log)
// })()
// const getProduct = PromisE.deferredFetch(
//     {
//         defer: 1000,
//         resolveIgnored: false,
//         // onIgnore: promise => promise.then((x: any = {}) => console.log('>>>>>ignored', {id: x.id, title: x.title})),
//         onResult: (x: any = {}) => console.log('----result', {id: x.id, title: x.title}, (new Date().getTime() - now) / 1000),
//         throttle: true,
//     },
//     undefined,
//     {
//         headers: {'content-type': 'application/json'}
//     },
//     // 5000
// )
// new Array(10)
//     .fill(0)
//     .map((_, i) => i * 600)
//     .forEach((timeout, i) => setTimeout(
//         (...args: any[]) => {
//             console.log(i + 1, 'getProduct', ...args)
//             getProduct(...args)
//             .then((x:any = {}) => console.log('>>', i + 1, timeout, 'GotProduct', {id: x.id, title: x.title}))
//         },
//         timeout + (i % 3 == 0 ? 600 : 0),
//         `https://dummyjson.com/products/${i + 1}`)
//     )

// const defer = PromisE.deferred<string>({
//     defer: 1000,
//     // resolveIgnored: ResolveIgnored.WITH_UNDEFINED,
//     // onIgnore: ignored => ignored().then(x => console.log('Defer Ignored', x)),
//     // onResult: result => console.log({ defer_result:result }, (new Date().getTime() - now) / 1000),
//     throttle: false,
// })
// const throttle = PromisE.deferred<string>({
//     defer: 1000,
//     // onIgnore: ignored => ignored().then(x => console.log('Throttle Ignored', x)),
//     onResult: result => console.log({ throttle_result: result }, (new Date().getTime() - now) / 1000),
//     throttle: true,
// })
// let count = 0
// const run = (deferFn: typeof defer, rxResult: SubjectLike<Awaited<ReturnType<typeof defer>>>) => {
//     const title = ++count === 1 ? 'defer' : 'throttle'
//     console.log(`\n----------  Running ${title}  ------------`);
//     [
//         [100],
//         [150],
//         [200],

//         [1500],
//         [1550],
//         [1600],
//         [1650],
//         [1700],
//         [1750],
//         [1800],
//         [1850],

//         [3000],
//         [3000],
//         [3000],
//         // ...new Array(100).fill(0).map((_, i) => [i * 200 + 200])

//     ].forEach(([timeout, delay = timeout], i) => {
//         const fn = PromisE.delay(i)
//         setTimeout(
//             // () => defer(async () => {
//             //     const str = `${i + 1} => ${timeout}`
//             //     console.log(title, '=> Executing', i + 1, timeout)
//             //     return str
//             // }),
//             () => deferFn(PromisE.delay(i)),
//             timeout
//         )
//     })
// }

// const any = PromisE.any([
//     PromisE.delay(2000, 'first'),
//     PromisE.delay(1000, 'second'),
//     PromisE.delay(3000, 'fourth'),
//     PromisE.reject(new Error('test'))
// ])
// any.then(v => console.log('any', any, v))

// const allSettled = PromisE.allSettled([
//     PromisE.delay(2000, 'first'),
//     PromisE.delay(1000, false),
//     PromisE.delay(3000),
//     Promise.reject(new Error('test'))
// ])
// allSettled.then(v => console.log('allSettled', allSettled, v))

// const tout = PromisE.timeout(40000, PromisE.delay(2000), PromisE.delay(1000), PromisE.delay(3000, '3000'))
// tout.then(x => console.log({x}))

// const p = PromisE.delayReject(3000, '3000')
// p.catch(err => console.error(err))

// ;(async () => {
//     const promise = PromisE.timeout(
//         5000, // timeout after 5000ms
//         PromisE.delay(10000, 'rejected', true), // resolves after 10000ms with value 10000
//     )
//     try {
//         const data = await promise.catch(() => {
//             if (promise.timeout.rejected) console.log('Request is taking longer than expected......')
//             return promise.data
//         })
//         console.log({ data })
//     } catch(err) { console.log({err}) }
// })()

// ;(async () => {
//     console.log('Will reject after 3 seconds')
//     function* simpleGenerator() {
//         console.log('Yield 1')

//         yield 1

//         console.log('Yield 2')
//         yield 2

//         console.log('Yield 3')
//         yield 3

//         return 4
//     }
//     const checkReady = simpleGenerator()
//     const rejectPromise = PromisE.delayReject(4000)
//     const intervalId = setInterval(() => {
//         if (checkReady.next().value === 3) rejectPromise.resolve()
//     }, 1000)
//     await rejectPromise
//     clearInterval(intervalId)
//     console.log('Done')
// })()

// const args = ['some value', true] as const
// const ensureValue = (value: string, criteria?: boolean) => {
//     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
//     return value
// }
// this makes sure there's always a value without having to manually write try-catch block.
// const value = fallbackIfFails(
//     ensureValue,
//     () => args,
//     () => 'fallback value'
// )

// const initialValue = 0
// const rxInterval = new IntervalSubject(
// 	true, // auto-start
//     60 * 1000, // interval delay. increment counter every "x" milliseconds
//     initialValue, // initial counter value
// 	1, // increment by 1 at each interval
// )
// const onChange = (counter: number) => {
// 	if (counter === initialValue) return console.log('Counter started')
// 	const { PromisE } = require('@superutils/core')
// 	PromisE.fetch('https://jsonplaceholder.typicode.com/todos/100').then(
//         () => console.log(new Date().toISOString(), 'Successful ping'),
//         (err: Error) => console.log('Ping failed.', err)
//     )
// }
// // BehaviorSubject automatically resolves with the initial value if subscribed immediately.
// // subscribe to the subject and execute `onChange`: first time immediately and then every 60 seconds
// rxInterval.subscribe(onChange)

// PromisE
//     .fetch(
//         'https://google.com',
//         {},
//         0,
//         false
//     )
//     .then(response => response.text())
//     .then(html => console.log('\n\nPage contents: \n', html))

/**
 * Example
 */
// // Create an interval runner subject that triggers incremental value every second.
// const rxInterval = new IntervalSubject(true, 1000, 1, 1)
// // create a promise that only resolves when expected value is received
// const [promise, unsubscribe] = subjectAsPromise(rxInterval, 10)
// promise.then(value => console.log('Value should be 10', value))

// const rxInterval = new IntervalSubject(true)
// const rxCopy = copyRxSubject(
//     rxInterval,
//     undefined,
//     // only update rxCopy every 10 seconds
//     seconds => seconds > 0 && seconds % 10 === 0
//         ? seconds
//         // do not trigger an update
//         : copyRxSubject.IGNORE_UPDATE_SYMBOL
// )
// const promise = subjectAsPromise(rxCopy, 10)[0]
// promise.then(value => console.log({ value, promise }))
// rxCopy.subscribe(x => {
//     x > 0 && console.log(x)

//     x >= 30 && rxInterval.stop()
// })

// const rxInterval = new IntervalSubject(
//     true, // auto-start
//     1000, // interval delay
//  0, // initial counter value
//     1, // increment by 1 at each interval
// )
// // subscribe to the subject and do whatever at each interval
// rxInterval.subscribe(counter =>
//     // Ignore at initial value.
//  // The BehaviorSubject automatically resolves with the initial value if subscribed immediately
//     counter > 0 && console.log(
//         counter % 60 === 0
//             ? 'Another minute passed by!'
//             : `${counter % 60}`.padStart(2, '0')
//         )
// )
