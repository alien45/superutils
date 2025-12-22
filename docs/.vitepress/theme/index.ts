import DefaultTheme from 'vitepress/theme'
import Playground from './components/Playground.vue'
import { embedPlayground, tryBtnClickHandler } from './stackblitz'
import { h, onMounted, onUnmounted, defineComponent } from 'vue'

export default {
	...DefaultTheme,
	Layout: defineComponent({
		setup(_props, { slots }) {
			onMounted(() => {
				;(window as any).embedPlayground = embedPlayground
				document.body.addEventListener('click', tryBtnClickHandler)
			})
			onUnmounted(() => {
				document.body.removeEventListener('click', tryBtnClickHandler)
			})
			// Render the default theme's layout with our hooks attached.
			return () => h(DefaultTheme.Layout, null, slots)
		},
	}),
	enhanceApp({ app }) {
		app.component('Playground', Playground)
	},
}
