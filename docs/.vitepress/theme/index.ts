import { onContentUpdated } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h, onMounted, onUnmounted, defineComponent } from 'vue'
import Playground from './components/Playground.vue'
import { addTryNowBtnNListen, replaceUrls, replacePageUrls } from './stackblitz'

export default {
	...DefaultTheme,
	Layout: defineComponent({
		setup(_props, { slots }) {
			onMounted(() => {
				// do stuff on first application mount
				onContentUpdated(() => {
					addTryNowBtnNListen()
					replacePageUrls()
				})
				addTryNowBtnNListen()

				replaceUrls()
			})
			onUnmounted(() => {
				// do stuff on application unmount
			})
			// Render the default theme's layout with our hooks attached.
			return () => h(DefaultTheme.Layout, null, slots)
		},
	}),
	enhanceApp({ app }) {
		app.component('Playground', Playground)
	},
}
