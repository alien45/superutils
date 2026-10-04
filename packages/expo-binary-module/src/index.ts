import { AppState } from 'react-native'
import { binaryModule } from './binaryModule'
export * from './binaryModule'
export * from './types'

// set the initial state
binaryModule.setAppState(AppState.currentState)
AppState.addEventListener('change', state => {
	// update state on change
	binaryModule.setAppState(state)
})

export default binaryModule
