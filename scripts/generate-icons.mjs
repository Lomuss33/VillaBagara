import {readFileSync, readdirSync, mkdirSync, writeFileSync, copyFileSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'

export function generateIcons() {
    const root = fileURLToPath(new URL('../', import.meta.url))
    const packageRoot = join(root, 'node_modules/@fortawesome/fontawesome-free')
    const metadata = JSON.parse(readFileSync(join(packageRoot, 'metadata/icon-families.json'), 'utf8'))
    const names = new Map()
    for(const [name, icon] of Object.entries(metadata)) {
        names.set(name, icon)
        for(const alias of icon.aliases?.names || []) names.set(alias, icon)
    }
    names.set('question-mark', names.get('question'))
    const tokens = new Set()
    const scan = text => { for(const match of text.matchAll(/\bfa-([a-z0-9-]+)/g)) tokens.add(match[1]) }
    function scanDirectory(directory) {
        for(const entry of readdirSync(directory, {withFileTypes: true})) {
            const file = join(directory, entry.name)
            if(entry.isDirectory()) scanDirectory(file)
            else if(/\.(?:js|jsx)$/.test(entry.name)) scan(readFileSync(file, 'utf8'))
        }
    }
    scanDirectory(join(root, 'src/components'))
    scanDirectory(join(root, 'src/providers'))
    const sectionRegistry = JSON.parse(readFileSync(join(root, 'public/data/sections.json'), 'utf8'))
    for(const file of ['settings', 'strings', 'profile', 'categories', 'sections']) scan(readFileSync(join(root, `public/data/${file}.json`), 'utf8'))
    for(const section of sectionRegistry.sections) scan(readFileSync(join(root, 'public', section.jsonPath.replace(/^\//, '')), 'utf8'))
    const rules = ['/*! Font Awesome Free icons: CC BY 4.0, Fonticons Inc. See /licenses/fontawesome.txt. */',
        '.fa-solid,.fa-regular,.fa-brands{display:inline-block;font-style:normal;line-height:1;vertical-align:-.125em}',
        '.fa-solid::before,.fa-regular::before,.fa-brands::before{content:"";display:block;width:1em;height:1em;background:currentColor;-webkit-mask:var(--icon) center/contain no-repeat;mask:var(--icon) center/contain no-repeat}',
        '.pi-spin,.fa-spin{animation:icon-spin 2s linear infinite}@keyframes icon-spin{to{transform:rotate(360deg)}}',
        '@media(prefers-reduced-motion:reduce){.pi-spin,.fa-spin{animation:none}}']
    rules.push('@media(forced-colors:active){.fa-solid::before,.fa-regular::before,.fa-brands::before{background:CanvasText;forced-color-adjust:none}}')
    let count = 0
    for(const token of [...tokens].sort()) {
        const icon = names.get(token)
        if(!icon) continue // Utility classes, rather than glyph names.
        for(const [style, svg] of Object.entries(icon.svgs?.classic || {})) {
            if(!['solid', 'regular', 'brands'].includes(style)) continue
            const data = encodeURIComponent(svg.raw.replace(/fill="[^"]*"/g, ''))
            rules.push(`.fa-${style}.fa-${token}{--icon:url("data:image/svg+xml,${data}")}`)
            count++
        }
    }
    const output = join(root, 'src/styles/generated/icons.css')
    mkdirSync(join(root, 'src/styles/generated'), {recursive: true})
    const css = rules.join('\n') + '\n'
    // Avoid HMR loops when the generated content has not changed.
    let existing = ''
    try { existing = readFileSync(output, 'utf8') } catch { /* first generation */ }
    if(existing !== css) writeFileSync(output, css)
    mkdirSync(join(root, 'public/licenses'), {recursive: true})
    copyFileSync(join(packageRoot, 'LICENSE.txt'), join(root, 'public/licenses/fontawesome.txt'))
    return count
}
if(process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log(`${generateIcons()} SVG icon rules generated.`)
