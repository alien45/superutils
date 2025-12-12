/**
 * This file generates coverage percentage for individual packages and injects them into
 * respective Cell in the README.MD file's packages table
 */

import { exec } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

const packagesDir = resolve(process.cwd(), 'packages')
const typedocConfigPath = resolve(process.cwd(), 'typedoc.json')
const readmePath = resolve(process.cwd(), 'README.md')
const summaryDir = 'coverage-summary'

async function getCoverageForPackage(pkgName) {
	console.log(`\n[INFO] Running coverage for @superutils/${pkgName}...`)
	try {
		const flags = [
			'--passWithNoTests',
			'--coverage.reporter=json-summary',
			`--coverage.reportsDirectory=./${summaryDir}/${pkgName}`,
		]
		// Run test with coverage for the specific package
		// We only request the 'json-summary' reporter to speed up the process.
		await execAsync(`npm test ${pkgName}:%:1 -- ${flags.join(' ')}`)

		// Read the generated summary for this package
		const coverageSummaryPath = resolve(
			process.cwd(),
			summaryDir,
			pkgName,
			`coverage-summary.json`,
		)
		const summaryFile = await readFile(coverageSummaryPath, 'utf-8')
		const summary = JSON.parse(summaryFile)

		// Extract the 'lines' coverage percentage from the 'total' section
		const linesPct = summary.total.lines.pct
		console.log(`[SUCCESS] Coverage for ${pkgName}: ${Number(linesPct)}%`)
		return Number(linesPct) || 0
	} catch (error) {
		console.error(`[ERROR] Failed to get coverage for ${pkgName}:`, error)
		return 0 // Return 0 if coverage fails
	}
}

async function main() {
	// Read and parse typedoc.json to find excluded packages
	const typedocConfigStr = (await readFile(typedocConfigPath, 'utf-8'))
		// A more robust regex to strip comments from the JSONC file before parsing.
		// This handles comments inside strings and avoids incorrectly stripping parts of URLs.
		.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
			g ? '' : m,
		)

	const excludedPackages = (JSON.parse(typedocConfigStr).exclude || []).map(
		p => p.replace(/packages\/|\//g, ''),
	)

	const packages = await readdir(packagesDir, { withFileTypes: true })
	const packagesToTest = packages.filter(
		d => d.isDirectory() && !excludedPackages.includes(d.name),
	)

	// Run coverage tests for all packages in parallel to speed up the process.
	const coveragePromises = packagesToTest.map(dirent =>
		getCoverageForPackage(dirent.name).then(coverage => [
			dirent.name,
			coverage,
		]),
	)

	const coverageResults = await Promise.all(coveragePromises)
	const coverageData = Object.fromEntries(coverageResults)

	// Read the README.md file
	let readmeContent = await readFile(readmePath, 'utf-8')

	const thumbUp = '&#128402;'
	const thumbDown = '&#128403;'
	const memo = '&#128221;'
	const heart = '&#128153;'
	const heartBroken = '&#128148;'
	const heartWithArrow = '&#128152;'
	// Replace the coverage placeholders in the README
	for (const pkgName in coverageData) {
		const percentage = coverageData[pkgName]
		const icon =
			percentage <= 20
				? memo
				: percentage === 100
					? heartWithArrow
					: percentage >= 90
						? heart
						: percentage >= 80
							? thumbUp
							: percentage >= 60
								? thumbDown
								: heartBroken
		const color =
			percentage >= 80
				? 'green'
				: percentage >= 60
					? 'yellow'
					: percentage <= 20
						? 'gray'
						: 'red'
		const html = `<div style="color:${color}">${icon}&nbsp;${percentage <= 20 ? 'ToDo' : percentage + '%'}</div>`
		const regex = new RegExp(
			`(<td id="coverage_${pkgName}">)(.*?)(<\\/td>)`,
			'g',
		)
		readmeContent = readmeContent.replace(regex, `$1${html}$3`)
	}

	// Write the updated content back to README.md
	await writeFile(readmePath, readmeContent)
	console.log(`\n[SUCCESS] Coverage data has been injected into README.md`)
}
const start = new Date()
main().finally(() =>
	console.log(
		'Elapsed time: ',
		(new Date().getTime() - start.getTime()) / 1000,
		'seconds',
	),
)
