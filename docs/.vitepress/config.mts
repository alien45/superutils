// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import typedocSidebar from '../packages/typedoc-sidebar.json'

export default defineConfig({
	title: 'Superutils',
	description:
		'A set of utilities for Typescript/Javascript, RxJS and ReactJS',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'API Reference', link: '/packages' },
		],
		sidebar: [
			{
				text: 'Introduction',
				items: [
					{ text: 'Getting Started', link: '/markdown-examples' },
					{ text: 'Packages', link: '/packages/index.html' },
					{ text: 'Packages2', link: '/packages' },
				],
			},
			{
				text: 'API Reference',
				items: [
					{ text: 'Core Utilities', link: '/packages/core' },
					{ text: 'Promise Utilities', link: '/packages/promise' },
					{ text: 'RxJS Utilities', link: '/packages/rx' },
					{ text: 'React Utilities', link: '/packages/react' },
				],
			},
			{
				text: 'Packages',
				items: typedocSidebar,
			},
		],
	},
})
