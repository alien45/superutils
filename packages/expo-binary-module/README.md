# @superutils/expo-binary-module

An Expo native module for running and managing long-running native binaries on Android.

The module is designed for applications that need to bundle a native executable inside the Android application and control its lifecycle from React Native. It runs the executable as an Android foreground service, supports configurable environment variables, persistent auto-start configuration, startup detection, and customizable foreground-service notifications.

**Android only.**

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Expo Configuration](#expo-configuration)
  - [jniLibs Configuration](#jnilibs-configuration)
- [Basic Usage](#basic-usage)
  - [Starting a Binary](#starting-a-binary)
  - [Stopping a Binary](#stopping-a-binary)
  - [Checking Status](#checking-status)
  - [Accessing Exposed Environment Variables](#accessing-exposed-environment-variables)
- [Start Options](#start-options)
  - [binaryName](#binaryname)
  - [autoStart](#autostart)
  - [autoStop](#autoStop)
  - [Environment Variables](#environment-variables)
  - [Startup Detection](#startup-detection)
  - [Notifications](#notifications)
- [Status](#status)
- [Updating the Notification](#updating-the-notification)
- [Stopping the Binary](#stopping-the-binary)
- [Crash Detection](#crash-detection)
- [Binary Output](#binary-output)
- [Auto-start and Android Boot](#auto-start-and-android-boot)
- [Complete Example](#complete-example)
- [Development](#development)
- [Platform Support](#platform-support)
- [License](#license)

## Features

- Run bundled native binaries from React Native
- Keep binaries running independently of the React Native JS runtime
- Android foreground service support
- Start and stop the binary programmatically
- Configure environment variables
- Generate random environment values at runtime
- Hide binary-only environment values from the React Native side
- Persist auto-start configuration
- Automatically restart configured binaries after:
  - Android device reboot
  - Locked boot
  - Application update
- Detect successful startup using configurable startup log text
- Detect process crashes and exits
- Expose the current binary status to React Native
- Customize the foreground-service notification
- Show binary output in Android logs

## Requirements

- Expo SDK 56+
- Android 8.0+ (API 26+)
- A native Expo development build

This module cannot be used with the standard Expo Go application because it contains custom native Android code.

## Installation

Install the package in your Expo project:

```bash
yarn add @superutils/expo-binary-module
```

or:

```bash
npm install @superutils/expo-binary-module
```

Then generate the native Android project:

```bash
npx expo prebuild
```

Build the Android application:

```bash
npx expo run:android
```

## Expo Configuration

The package includes an Expo config plugin that configures the native Android project during `expo prebuild`.

The plugin is responsible for configuring the native Android project and adding the configured `jniLibs` directory to the application's native library sources.

### jniLibs Configuration

The module requires the directory containing the native binaries to be configured through the Expo plugin.

Add the module to the `plugins` section of your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@superutils/expo-binary-module",
        {
          "jniLibs": "./path/to/jniLibs"
        }
      ]
    ]
  }
}
```

`jniLibs` accepts comma-separated paths (eg: `"./path/to/jniLibs,./path/to/other/jniLibs"`).
If more than one path is provided, all files from all specified paths will be merged and copied into the APK.

The directory should contain native binaries organized by Android ABI:

```text
jniLibs/
├── arm64-v8a/
│   └── libmybinary.so
├── armeabi-v7a/
│   └── libmybinary.so
└── x86_64/
    └── libmybinary.so
```

The binary name passed to `start()` must match the binary available in the application's native library directory.

For example:

```ts
await BinaryModule.start({
  binaryName: 'libmybinary.so',
})
```

After changing the Expo configuration, regenerate the native project:

```bash
npx expo prebuild
```

If you need to completely regenerate the native Android project:

```bash
npx expo prebuild --clean
```

## Basic Usage

Import the module:

```ts
import BinaryModule from '@superutils/expo-binary-module'
```

### Starting a Binary

The simplest way to start a binary is:

```ts
const started = await BinaryModule.start({
  binaryName: 'libmybinary.so',
})

if (!started) {
  console.error('Failed to start binary')
}
```

When no `startupText` is configured, `start()` returns after the native process has been successfully launched.

### Stopping a Binary

```ts
await BinaryModule.stop()
```

### Checking Status

```ts
const status = BinaryModule.getStatus()

console.log(status)
```

The returned status describes the current state of the native binary process.

### Accessing Exposed Environment Variables

Environment variables that are not marked as `binaryOnly` can be exposed to React Native.

```ts
const env = BinaryModule.getExposedEnv()

console.log(env)
```

Values marked as `binaryOnly` are passed to the native binary but are not exposed through this API.

## Start Options

`start()` accepts a `StartOptions` object.

```ts
type StartOptions = {
  autoStart?: boolean
  autoStop?: AutoStopOptions | null
  awaitStartDelay?: number
  binaryName: string
  env?: BinaryEnv
  ipcOptions?: IpcOptions
  notification?: Partial<NotificationOptions>
  startupText?: string
  startupTimeout?: number
}
```

### binaryName

The name of the native binary to execute.

```ts
{
  binaryName: 'libmybinary.so'
}
```

The binary must be available in the application's native library directory.

### autoStart

Determines whether the binary should automatically start again after Android restarts or the application is updated.

```ts
{
  autoStart: true,
  binaryName: 'libmybinary.so',
}
```

When enabled, the module persists the startup configuration.

The Android boot receiver uses that configuration to restart the binary after:

- `BOOT_COMPLETED`
- `LOCKED_BOOT_COMPLETED`
- `MY_PACKAGE_REPLACED`

When `autoStart` is disabled, the persisted auto-start configuration is removed.

### autoStop

Configure to auto-stop and restart the binary based on device network battery status.

```ts
type AutoStopOptions = {
  /** Auto stop binary if device is on airplane mode */
  airplaneMode?: boolean
  /** Auto stop binary if battery level is below provided level/percentage. Default: 10 (=**10%**) */
  batteryLevelBelow?: number
  /** Auto stop binary if battery is not in charging state */
  batteryNotCharging?: boolean
  /** Auto stop binary if network is metered. Default: `false` */
  metered?: boolean
  /** Auto stop if matches any of the network types provided. Default: "['cellular']" */
  networkTypes?: DeviceNetworkType[]
  /** Auto stop binary if device is on power save mode */
  powerSaveMode?: boolean
}
```

### Environment Variables

Environment variables are configured using `EnvEntry` objects.

```ts
type EnvEntry = {
  value: string
  binaryOnly?: boolean
  random?: boolean
  prefix?: string
}
```

Example:

```ts
{
  binaryName: 'libmybinary.so',
  env: {
    PORT: {
      value: '1234',
    },
    API_KEY: {
      value: 'secret-value',
      binaryOnly: true,
    },
  },
}
```

#### binaryOnly

When `binaryOnly` is `true`, the environment variable is passed to the native binary but is not exposed back through the module's environment API.

This is useful for values that the binary needs but React Native should not receive.

```ts
{
  API_KEY: {
    value: 'secret-value',
    binaryOnly: true,
  },
}
```

When `binaryOnly` is `false` or omitted, the resolved value is available to the React Native side.

#### random

When `random` is enabled, the module generates a random value at runtime instead of using `value`.

```ts
{
  SECRET: {
    value: '',
    random: true,
  },
}
```

The generated value is Base64 URL-safe encoded without padding.

#### prefix

A prefix can be added to generated random values.

```ts
{
  SECRET: {
    value: '',
    random: true,
    prefix: 'myapp-',
  },
}
```

The resulting environment variable will have the form:

```text
myapp-<random-value>
```

### Startup Detection

By default, the module considers the process started once the native process has been successfully launched.

For binaries that expose a startup message in their output, `startupText` can be used to wait for a specific log message before reporting `STARTED`.

```ts
const started = await BinaryModule.start({
  binaryName: 'libmybinary.so',
  startupText: 'Binary listening on',
})
```

The module reads the binary's combined stdout and stderr output and looks for the configured text.

Startup detection waits for up to 10 seconds.

If the text is observed:

```text
STARTING
   |
   v
STARTED
```

If the text is not observed within the timeout:

- the process is terminated
- the status becomes `CRASHED`
- the notification reports `Startup timeout`
- `start()` returns `false`

Without `startupText`, `start()` returns after the process has been launched successfully.

### Notifications

The binary runs as an Android foreground service, so Android requires a persistent foreground-service notification while it is running.

The default notification uses the application's icon and displays:

```text
<App Name>: Foreground Service
Running
```

The notification can be customized using `NotificationOptions`.

```ts
type NotificationOptions = {
  title?: string
  text?: string
  subText?: string
  ongoing?: boolean
  silent?: boolean
  progress?: {
    max: number
    current: number
    indeterminate?: boolean
  }
}
```

#### title

Overrides the default notification title.

```ts
{
  title: 'My Binary',
}
```

If no title is provided, the default is:

```text
<App Name>: Foreground Service
```

#### text

Sets the notification's primary text.

Newlines can be used when multiline notification content is desired.

```ts
{
  text: 'Binary is running\nListening for connections',
}
```

#### subText

Sets Android's notification subtext.

```ts
{
  subText: 'This is a subtext',
}
```

#### ongoing

Controls whether Android treats the notification as an ongoing notification.

```ts
{
  ongoing: true,
}
```

When enabled, the notification cannot normally be dismissed by the user while the service is running.

#### silent

Controls whether the notification is silent.

```ts
{
  silent: true,
}
```

#### progress

Displays progress in the notification.

```ts
{
  progress: {
    max: 100,
    current: 65,
    indeterminate: false,
  },
}
```

For an indeterminate operation:

```ts
{
  progress: {
    max: 100,
    current: 0,
    indeterminate: true,
  },
}
```

## Status

The module exposes the following statuses:

```ts
enum Status {
  CRASHED,
  NEVER_STARTED,
  STARTED,
  STARTING,
  STOPPING,
  STOPPED,
}
```

The JavaScript representation uses the corresponding lowercase string values exposed by the native module.

A typical lifecycle is:

```text
NEVER_STARTED
      |
      v
  STARTING
      |
      v
   STARTED
      |
      v
  STOPPING
      |
      v
   STOPPED
```

If the process exits unexpectedly:

```text
STARTED
   |
   v
CRASHED
```

## Updating the Notification

The foreground-service notification can be updated without restarting the binary.

```ts
BinaryModule.setNotification({
  title: 'My Binary',
  text: 'Listening for connections',
})
```

For example:

```ts
BinaryModule.setNotification({
  text: 'Syncing\nPreparing files...',
  progress: {
    max: 100,
    current: 42,
  },
})
```

The notification options passed to `setNotification()` replace the corresponding notification values.

## Stopping the Binary

```ts
await BinaryModule.stop()
```

Stopping the binary:

- terminates the native process
- clears its exposed environment values
- changes the status to `STOPPED`
- removes the foreground notification
- stops the Android foreground service

If auto-start configuration is associated with the running process, stopping the service also clears the persisted configuration so that the binary is not unexpectedly restarted by a later boot event.

## Crash Detection

The module monitors the native process after it starts.

If the process exits unexpectedly, the module:

- clears the process reference
- clears exposed environment values
- changes the status to `CRASHED`
- updates the foreground notification

The process watcher also protects against an older process changing the state of a newer process if a binary is restarted before the previous process watcher finishes.

## Binary Output

The binary's stdout and stderr are combined and read by the service.

Output is written to Android's log for each line:

```text
MM-DD HH:MM:SS.XXX XXXX  XXXX D [ExpoBinaryService]: [BinaryLog][libbinary.so] <LOG_FROM_THE_BINARY>
```

This output (`<LOG_FROM_THE_BINARY>`) is also used by `startupText` when startup detection is enabled.

For `adb` connected devices you can see the log by running:

```bash
adb logcat | grep ExpoBinaryModule
```

## Auto-start and Android Boot

When `autoStart` is enabled, the module persists the startup configuration as JSON.

The included Android boot receiver listens for:

```text
BOOT_COMPLETED
LOCKED_BOOT_COMPLETED
MY_PACKAGE_REPLACED
```

When one of these events occurs, the receiver loads the persisted configuration and starts the foreground service again.

This allows a configured binary to start automatically after:

- a normal device reboot
- a device boot before user unlock
- an application update

No server or external service is required for this behavior.

## Complete Example

A complete example for a long-running binary:

```ts
import BinaryModule from '@superutils/expo-binary-module'

const started = await BinaryModule.start({
  binaryName: 'libmybinary.so',

  autoStart: true,

  startupText: 'Binary listening',

  env: {
    PORT: {
      value: '1234',
    },

    INSTANCE_ID: {
      value: '',
      random: true,
      prefix: 'myapp-',
      binaryOnly: true,
    },
  },

  notification: {
    title: 'My Binary',
    text: 'Starting...',
    ongoing: true,
    silent: true,
  },
})

if (!started) {
  console.error('Binary failed to start')
}
```

Once the binary reports its startup message, the notification can be updated:

```ts
BinaryModule.setNotification({
  text: 'Listening for connections',
})
```

When the binary is no longer needed:

```ts
await BinaryModule.stop()
```

## Development

Build the module:

```bash
yarn build
```

Inspect the package contents before publishing:

```bash
npm pack --dry-run
```

The package needs to contain the generated JavaScript in `build/`, the Android native implementation, the Expo config plugin, and the package metadata required by Expo modules.

## Platform Support

| Platform | Support |
| -------- | ------- |
| Android  | Yes     |
| iOS      | No      |
| Web      | No      |

This package intentionally provides Android-specific functionality for running long-lived native processes.

## License

MIT
