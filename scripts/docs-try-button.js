import fs from 'fs'
import path from 'path'

const ICONS = {
    codesandbox: `<svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path fill="currentColor" d="M2 6l10.455 6L2 18V6zm2 3.205L9.091 12 4 14.795V9.205z"/></svg>`,
}

function createTryButtonHTML(codesandboxUrl) {
    return `
<div class="try-buttons">
  <a href="${codesandboxUrl}" target="_blank" class="try-button codesandbox">${ICONS.codesandbox} Try on CodeSandbox</a>
</div>`
}

/**
 * Creates a CodeSandbox URL that defines a sandbox with the given code and dependencies.
 * @param {string} code The TypeScript code.
 * @param {Record<string, string>} dependencies Project dependencies.
 * @returns {string} The CodeSandbox URL.
 */
function createCodeSandboxUrl(code, dependencies = {}) {
    const config = {
        files: {
            'index.ts': {
                content: code.trim(),
            },
            'package.json': {
                content: JSON.stringify({
                    dependencies: {
                        typescript: 'latest',
                        ...dependencies,
                    },
                }),
            },
            'tsconfig.json': {
                content: JSON.stringify({
                    compilerOptions: {
                        strict: true,
                        module: 'esnext',
                        target: 'esnext',
                        moduleResolution: 'node',
                    },
                }),
            },
        },
    }

    const jsonConfig = JSON.stringify(config)

    // CodeSandbox expects the JSON to be URI-encoded, not base64.
    // For very large configurations, compression + base64 is used, but this is simpler and sufficient.
    const parameters = encodeURIComponent(jsonConfig)
    return `https://codesandbox.io/api/v1/sandboxes/define?json=1&parameters=${parameters}`
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8')
    let changed = false

    // Pattern 1: Markdown code fences (```typescript)
    content = content.replace(
        /```(ts|typescript|js|javascript)(?:\s+[^\n]*)?\n([\s\S]*?)```/g,
        function (match, lang, code) {
            // Heuristic to find the package name from the file path.
            // e.g., docs/packages/is-string/modules.md -> @superutils/is-string
            const pathParts = filePath.split(path.sep)
            const pkgIndex = pathParts.indexOf('packages')
            let dependencies = {}
            if (pkgIndex !== -1 && pathParts.length > pkgIndex + 1) {
                const pkgName = pathParts[pkgIndex + 1]
                dependencies[`@superutils/${pkgName}`] = 'latest'
            }

            changed = true

            const codesandboxUrl = createCodeSandboxUrl(code, dependencies)

            return `${match}\n\n${(codesandboxUrl)}`
        },
    )

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8')
    }

    return changed
}

// Process all markdown files
function processDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`❌ Directory not found: ${dir}`)
        return 0
    }
    let totalChanged = 0
    const files = fs.readdirSync(dir, { withFileTypes: true })

    for (const file of files) {
        const fullPath = path.join(dir, file.name)
        if (file.isDirectory()) {
            totalChanged += processDirectory(fullPath)
        } else if (file.name.endsWith('.md')) {
            if (processFile(fullPath)) {
                totalChanged++
            }
        }
    }
}

console.log('🔧 Adding "Try" buttons to examples...')
const changed = processDirectory('./docs/packages')
console.log(`\n✅ Done! Added buttons to ${changed} file(s).`)

// Test one link
if (changed > 0) {
    console.log('\n🔗 Test one of the generated links to verify it works!')
}
