import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'
import { embedPlayground, tryBtnClickHandler } from './stackblitz'

export default {
	...DefaultTheme,
	enhanceApp({ app }) {
		app.component('Playground', Playground)
	},
}
// add for global access and testing purposes
;(window as any).embedPlayground = embedPlayground

setTimeout(() => {
	// in case of hot-reload, remove previous listener first
	document.body.removeEventListener('click', tryBtnClickHandler)
	document.body.addEventListener('click', tryBtnClickHandler)
}, 2000)
