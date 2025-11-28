import { arrReverse, reverse, randomInt } from '@superutils/core'

console.log('Starting arrReverse() & reverse() benchmark')

const arrayLength = 1e4 //
const numExecute = 1e6 // number of times to call the target function
const arr = new Array(arrayLength).fill(0).map((_, i) => randomInt(arrayLength))
const arr2 = new Map(arr.map(x => [x, x])) //[...arr]
console.log('arrays prepared with randomly generated numbers', {
	arrayLength,
	numExecute,
})

const start2 = new Date()
for (let i = 0; i < numExecute; i++) {
	reverse(arr2, true)
}
console.log('reverse', new Date().getTime() - start2.getTime())

const start = new Date()
for (let i = 0; i < numExecute; i++) {
	arrReverse(arr, true)
}
console.log('arrReverse', new Date().getTime() - start.getTime())

console.log('Benchmark ended')
