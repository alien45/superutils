// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import typedocSidebar from '../packages/typedoc-sidebar.json'

export default defineConfig({
	base: '/superutils/',
	title: 'Superutils',
	description:
		'A suite of practical, opinionated and modular utilities for TypeScript, React, and RxJS.',
	ignoreDeadLinks: 'localhostLinks',
	themeConfig: {
		footer: {
			message: 'Released under the MIT License.',
			copyright:
				'Copyright © 2025 <a href="https://alien45.github.io/cv">Toufiqur Rahaman Chowdhury</a>',
		},
		nav: [
			{ text: 'Home', link: '/' },
			{
				text: 'API Reference',
				link: '/api-reference.html',
			},
		],
		search: {
			provider: 'local',
		},
		sidebar: [
			{
				text: 'Introduction',
				collapsed: false,
				items: [
					{
						text: 'What is Superutils?',
						link: '/api-reference#superutils',
					},
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
					pkgItem.collapsed = true
					pkgItem.items = [
						{
							text: 'About',
							link:
								pkgItem.link
								+ '#'
								+ pkgItem.link.split('@')[1].replace('/', '-'),
						},
						{
							text: 'Installation',
							link: pkgItem.link + '#installation',
						},
						{
							text: 'Usage',
							link: pkgItem.link + '#usage',
						},
						pkgItem.items && {
							text: 'API Reference',
							collapsed: true,
							items: pkgItem.items,
						},
						{
							text: 'License',
							link: '/LICENSE#' + pkgItem.text,
						},
					].filter(Boolean) as any
					return pkgItem
				}),
			},
		],
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/alien45/superutils' },
			{ icon: 'linkedin', link: 'https://linkedin.com/in/toufiq' },
		],
	},
})
