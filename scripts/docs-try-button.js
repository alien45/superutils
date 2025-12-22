import fs from 'fs'
import path from 'path'

/**
 * Script to add "Try Now" buttons to examples code blocks in markdown files generated
 * by typedocs before being processed by vitepress.
 */

const ICON_STACKBLITZ = `<svg style="display: inline-block" viewBox="0 0 28 28" aria-hidden="true" class="StackBlitzLogo-boltIcon-FmCUV StackBlitzLogo-boltIcon_blue-NgOER" height="18" width="18"><path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"></path></svg>`

// Event handler is set up in docs/.vitepress/theme/index.js
const createTryBtn = (template = 'javascript') => `
<div class="try-button-wrap">
  <a href="#" class="try-button" data-template="${template}">
    ${ICON_STACKBLITZ} Try Now!
  </a>
</div>`


// Process a single file and add "Try Now" buttons to TS/JS code examples
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8')
    let changed = false

    // Regex to find code blocks with specified languages
    content = content.replace(
        /```(ts|typescript|js|javascript)(?:\s+[^\n]*)?\n([\s\S]*?)```/g,
        (match, language, code) => {
            changed = true

            return `${createTryBtn(language)}\n\n${match}`
        },
    )

    if (changed) fs.writeFileSync(filePath, content, 'utf8')

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
        totalChanged += file.isDirectory()
            ? processDirectory(fullPath)
            : file.name.endsWith('.md') && processFile(fullPath)
                ? 1
                : 0
    }
    return totalChanged
}

console.log('🔧 Adding "Try Now" buttons to examples...')
const changed = processDirectory('./docs/packages')
console.log(`\n✅ Done! Added buttons to ${changed} file(s).`)
