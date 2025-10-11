// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import typedocSidebar from '../packages/typedoc-sidebar.json'

export default defineConfig({
	title: 'Superutils',
	description:
		'A suite of powerful, opinionated, and modular utilities for TypeScript, React, and RxJS.',
	themeConfig: {
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'API Reference', link: '/api-reference' },
		],
		sidebar: [
			{
				text: 'Introduction',
				items: [
					{ text: 'What is Superutils?', link: '/api-reference#' },
					{ text: 'Packages', link: '/api-reference#packages' },
					{
						text: 'Getting Started',
						link: '/api-reference#getting-started',
					},
					{
						text: 'Contribute',
						link: '/api-reference#contribute',
						collapsed: true,
						items: [
							{
								text: 'Pull Requst Guidelines',
								link: '/api-reference#pull-request-guidelines',
							},
							{
								text: 'Development Setup',
								link: '/api-reference#development-setup',
							},
							{
								text: 'Scripts',
								link: '/api-reference#scripts',
							},
							{
								text: 'License',
								link: '/api-reference#license',
							},
						],
					},
				],
			},
			{
				text: 'Packages',
				items: typedocSidebar.map(pkgItem => {
					pkgItem.items = [
						{
							text: 'About',
							link: pkgItem.link + '#',
						},
						{
							text: 'Installation',
							link: pkgItem.link + '#installation',
						},
						{
							text: 'Usage',
							link: pkgItem.link + '#usage',
						},
						{
							text: 'API Reference',
							collapsed: true,
							items: pkgItem.items,
						},
						{
							text: 'License',
							link: '/LICENSE#' + pkgItem.text,
						},
					] as any
					return pkgItem
				}),
			},
		],
		footer: {
			message: 'Released under the MIT License.',
			copyright:
				'Copyright © 2025 <a href="https://alien45.github.io/cv">Toufiqur Rahaman Chowdhury</a>',
		},
	},
})
