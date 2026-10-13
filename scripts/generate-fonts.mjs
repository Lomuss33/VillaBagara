import {mkdirSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'

const directory = 'public/fonts'
mkdirSync(directory, {recursive: true})
mkdirSync('public/licenses', {recursive: true})
const url = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Saira:wght@400;700&display=swap'
const response = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}})
if(!response.ok) throw new Error(`Font CSS request failed: ${response.status}`)
const css = await response.text()
const rules = []
const downloaded = new Map()
for(const match of css.matchAll(/\/\*\s*([^*]+)\*\/\s*(@font-face\s*\{[\s\S]*?\})/g)) {
    const subset = match[1].trim()
    if(!['latin', 'latin-ext'].includes(subset)) continue
    const family = match[2].match(/font-family:\s*'([^']+)'/)?.[1]
    const source = match[2].match(/url\((https:[^)]+)\)/)?.[1]
    if(!family || !source || !source.endsWith('.woff2')) throw new Error('Expected WOFF2 fonts from Google Fonts.')
    let filename = downloaded.get(source)
    if(!filename) {
        filename = `${family.toLowerCase()}-${subset}-${downloaded.size}.woff2`
        const file = await fetch(source)
        if(!file.ok) throw new Error(`Font download failed: ${file.status}`)
        const bytes = Buffer.from(await file.arrayBuffer())
        writeFileSync(join(directory, filename), bytes)
        downloaded.set(source, filename)
        console.log(`${filename}: ${bytes.length} bytes`)
    }
    rules.push(match[2].replace(source, filename))
}
if(!rules.length) throw new Error('No matching font subsets found.')
writeFileSync(join(directory, 'fonts.css'), '/* Saira and Orbitron; SIL Open Font License, see ../licenses/. */\n' + rules.join('\n'))
for(const family of ['saira', 'orbitron']) {
    const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`)
    if(!license.ok) throw new Error(`Font license request failed: ${license.status}`)
    writeFileSync(`public/licenses/${family}-OFL.txt`, (await license.text()).replace(/[ \t]+$/gm, ''))
}
