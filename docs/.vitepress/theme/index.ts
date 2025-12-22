import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'
import { embedPlayground, tryBtnClickHandler } from './stackblitz'
import { h, onMounted, onUnmounted } from 'vue'

export default {
	...DefaultTheme,
	// By extending the Layout, we can safely use Vue's lifecycle hooks.
	Layout: () => {
		// onMounted ensures this code runs only on the client, after the page is ready.
		onMounted(() => {
			;(window as any).embedPlayground = embedPlayground
			document.body.addEventListener('click', tryBtnClickHandler)
		})
		// onUnmounted cleans up the listener to prevent memory leaks during hot-reloads.
		onUnmounted(() => {
			document.body.removeEventListener('click', tryBtnClickHandler)
		})
		// Render the default theme's layout with our hooks attached.
		return h(DefaultTheme.Layout)
	},
	enhanceApp({ app }) {
		app.component('Playground', Playground)
	},
}
