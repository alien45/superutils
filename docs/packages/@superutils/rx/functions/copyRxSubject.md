# Function: copyRxSubject()

## Call Signature

> **copyRxSubject**\<`TCopy`, `TRxSource`, `T`\>(`rxSource`, `rxCopy?`, `valueModifier?`, `defer?`): [`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

Defined in: [packages/rx/src/copyRxSubject.ts:117](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/rx/src/copyRxSubject.ts#L117)

**`Function`**

copyRxSubject

### Type Parameters

#### TCopy

`TCopy`

#### TRxSource

`TRxSource` = `RxSourceType`

#### T

`T` = `UnwrapRxSourceValue`\<`TRxSource`\>

### Parameters

#### rxSource

`TRxSource`

RxJS source subject(s). If Array provied, value of `rxCopy` will also be an Array by default,
     unless a different type is provided by `rxCopy` or `valueModifier`.

#### rxCopy?

[`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

(optional) RxJS copy/destination subject.
     If `undefined`, a new subject will be created.
     Value type will be inferred automatically based on `rxCopy`, `valueModifier` and `rxSource`.
     Default: `new BehaviorSubject()`

#### valueModifier?

`ValueModifier`\<`T`, `TCopy`\>

(optional) callback to modify the value (an thus type) before copying from `rxSource`.
     Accepts async functions. Function invocation errors will be gracefully ignored.
     PS: If the very first invokation returns `IGNORE_UPDATE_SYMBOL`, the value of `rxCopy.value` will be undefined.
     Args: `newValue, previousValue, rxCopy`

#### defer?

`number`

(optional) delay in milliseconds.
     Default: `100` if rxSource is an array, otherwise, `0`.

### Returns

[`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

rxCopy

----------------------------------------------

### Examples

```typescript
const rxNumber = new BehaviorSubject(1)
const rxEven = copyRxSubject(
    rxNumber,
    // If not provided, rxEven will be created and returned: `new BehaviorSubject<boolean>(false),`
    // Type will be inferred from `valueModifier` if available, otherwise, `rxNumber`.
    undefined,
    // whenever a new value is received from rxNumber, reduce it to the appropriate value for the rxEven.
    (newValue) => newValue % 2 === 0,
)
// subscribe to changes
// will immediately print false from the initial value of rxNumber
rxEven.subscribe(console.log)
rxNumber.next(2) // prints: true
rxNumber.next(3) // print: false
```

----------------------------------------------

Automatically reduces to a single array with original values and their respective types
```typescript
 const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 const rxUserId = new BehaviorSubject('username')
 const rxUserSettings = copyRxSubject(
     [rxTheme, rxUser, 'my-fancy-app' ] as const
 )
 // subscribe to the subject with reduced array values
 rxUserSettings.subscribe(([theme, user, appName]) => {})
```

----------------------------------------------

```typescript
 const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 const rxUserId = new BehaviorSubject('username')
 const rxUserSettings = copyRxSubject(
     [rxTheme, rxUserId] as const,
     // A new subject will be created from `valueModifier` to: `new BehaviorSubject<...>(...),`
     undefined,
     ([theme, userId]) => ({ theme, userId }),
     100, // delay before updating rxCopy
 )
 // save settings to local storage whenever any of the values changes
 rxUserSettings.subscribe(settings => localStorage.setItem(settings.userId, JSON.stringify(settings)))
```

----------------------------------------------

Non-subjects will act as unobserved values to be included in the final value.
```typescript
 const rxTheme = new BehaviorSubject<'dark' | 'lite'>('dark')
 const rxUser = new BehaviorSubject({ balance: 1000, currency: 'usd', userId: 'username' })
 const rxProfileProps = copyRxSubject(
     [rxTheme, rxUser, 'my-fancy-app' ] as const,
     // A new subject will be created from `valueModifier` to: `new BehaviorSubject<...>(...),`
     undefined,
     ([theme, userId, appName]) => ({ appName, theme, userId }),
     100, // delay before updating rxCopy
 )
 const userProfileView = (
     <RxSubjectView
         subject={rxProfileProps}
         render={props => <UserProfile {...props} />}
     />
 )
```

## Call Signature

> **copyRxSubject**\<`TCopy`, `TRxSource`, `T`\>(`rxSource`, `rxCopy`, `valueModifier`, `defer?`): [`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

Defined in: [packages/rx/src/copyRxSubject.ts:131](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/rx/src/copyRxSubject.ts#L131)

Overload for when TCopy doesn't extend T (modifier required)

### Type Parameters

#### TCopy

`TCopy`

#### TRxSource

`TRxSource` = `RxSourceType`

#### T

`T` = `UnwrapRxSourceValue`\<`TRxSource`\>

### Parameters

#### rxSource

`TRxSource`

#### rxCopy

`undefined` | [`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>

#### valueModifier

`ValueModifier`\<`T`, `TCopy`\>

Value of rxSource (T) and value of rxCopy (TCopy) are not the same,
therefore, `valueModifier` is required to transform the value(s) of
rxSource into value of rxCopy.

#### defer?

`number`

### Returns

[`SubjectLike`](../interfaces/SubjectLike.md)\<`TCopy`\>
