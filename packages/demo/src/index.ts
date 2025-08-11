import { PromisE } from '@utiils/core'
import {
    BehaviorSubject,
    copyRxSubject,
    IntervalSubject,
    subjectAsPromise,
} from '@utiils/rx'

// keep the app alive indefinitely
setInterval(() => { }, 1000 * 60 * 60 * 24)

console.log('Started')

PromisE.fetch('https://google.com')

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
