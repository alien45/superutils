import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'
import { embedPlayground, tryBtnClickHandler } from './stackblitz'

export default {
	...DefaultTheme,
	enhanceApp({ app }) {
		app.component('Playground', Playground)
	},
}

setTimeout(() => {
	// in case of hot-reload, remove previous listener first
	document.body.removeEventListener('click', tryBtnClickHandler)
	document.body.addEventListener('click', tryBtnClickHandler)
}, 2000)
