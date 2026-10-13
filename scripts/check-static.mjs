import {readFileSync, readdirSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {gzipSync} from 'node:zlib'
import imageManifest from '../src/data/generated/imageManifest.generated.js'
import {imageDimensions} from './lib/image-dimensions.mjs'
import {resolveResponsiveImage} from '../src/hooks/utils/_image-utils.js'

const fromDist = process.argv.includes('--dist')
const workspace = fileURLToPath(new URL('../', import.meta.url))
const budgets = JSON.parse(readFileSync(join(workspace, 'scripts/budgets.json'), 'utf8'))
const root = join(workspace, fromDist ? 'dist' : 'public')
const files = new Set()
const errors = []
const expect = (condition, message) => { if(!condition) errors.push(message) }

function listFiles(directory = '') {
    for(const entry of readdirSync(join(root, directory), {withFileTypes: true})) {
        const relative = directory ? `${directory}/${entry.name}` : entry.name
        if(entry.isDirectory()) listFiles(relative)
        else files.add(relative)
    }
}
listFiles()

function readJSON(path) {
    if(!files.has(path)) throw new Error(`Missing file or incorrect letter case: ${path}`)
    return JSON.parse(readFileSync(join(root, path), 'utf8'))
}

function uniqueIds(items, context) {
    expect(Array.isArray(items), `${context}: expected an array`)
    if(!Array.isArray(items)) return
    const ids = items.map(item => item.id)
    expect(ids.every(id => id !== undefined && id !== null), `${context}: missing id`)
    expect(new Set(ids).size === ids.length, `${context}: duplicate ids`)
}

const settings = readJSON('data/settings.json')
const profile = readJSON('data/profile.json')
const strings = readJSON('data/strings.json')
const {categories} = readJSON('data/categories.json')
const {sections} = readJSON('data/sections.json')
uniqueIds(settings.supportedLanguages, 'supportedLanguages')
uniqueIds(categories, 'categories')
uniqueIds(sections, 'sections')
const languages = settings.supportedLanguages.map(language => language.id)
const themes = settings.supportedThemes.map(theme => theme.id)
const sectionIds = new Set(sections.map(section => section.id))
expect(languages.includes(settings.templateSettings.defaultLanguageId), 'Unknown default language')
expect(themes.includes(settings.templateSettings.defaultThemeId), 'Unknown default theme')

function validateTree(value, context) {
    if(!value || typeof value !== 'object') return
    for(const [key, child] of Object.entries(value)) {
        const location = `${context}.${key}`
        if(key === 'locales' && child) {
            for(const language of languages) expect(child[language], `${location}: missing ${language}`)
        }
        if(typeof child === 'string' && /^\/?(?:images|audio|files|data)\//.test(child)) {
            const path = child.replace(/^\//, '').split(/[?#]/)[0]
            const paths = path.includes('{theme}') ? themes.map(theme => path.replaceAll('{theme}', theme)) : [path]
            for(const asset of paths) expect(files.has(asset), `${location}: missing file or incorrect letter case: ${asset}`)
        }
        if(key === 'href' && typeof child === 'string' && child.startsWith('#')) {
            const target = child.slice(1)
            expect(sectionIds.has(target) || ['book', 'explore'].includes(target), `${location}: unknown section ${target}`)
        }
        validateTree(child, location)
    }
}

const sectionBody = readFileSync(join(workspace, 'src/components/sections/SectionBody.jsx'), 'utf8')
const registry = sectionBody.match(/SectionBody\.ARTICLES = \{([\s\S]*?)\}/)?.[1]
const components = new Set(registry?.match(/\bArticle\w+/g))
for(const section of sections) {
    expect(categories.some(category => category.id === section.categoryId), `${section.id}: unknown category`)
    const path = section.jsonPath.replace(/^\//, '')
    const content = readJSON(path)
    uniqueIds(content.articles, path)
    for(const article of content.articles) {
        expect(components.has(article.component), `${path}: unregistered component ${article.component}`)
        if(article.items !== null && article.items !== undefined) uniqueIds(article.items, `${path} article ${article.id}`)
    }
    validateTree(content, path)
}
for(const category of categories) expect(sections.some(section => section.categoryId === category.id), `Empty category: ${category.id}`)
for(const [name, content] of Object.entries({settings, profile, strings, categories, sections})) validateTree(content, name)

for(const [source, image] of Object.entries(imageManifest)) {
    expect(files.has(source), `Responsive source is missing or has incorrect letter case: ${source}`)
    expect(image.variants.length >= 2, `${source}: expected responsive variants`)
    let previousWidth = 0
    for(const variant of image.variants) {
        expect(files.has(variant.src), `Responsive variant is missing or has incorrect letter case: ${variant.src}`)
        expect(variant.width > previousWidth && variant.width <= image.width, `${variant.src}: widths must increase without upscaling`)
        previousWidth = variant.width
        if(!files.has(variant.src)) continue
        const bytes = readFileSync(join(root, variant.src))
        const dimensions = imageDimensions(bytes)
        expect(dimensions?.width === variant.width && dimensions?.height === variant.height, `${variant.src}: binary dimensions disagree with the manifest`)
        expect(Math.abs(variant.width / variant.height - image.width / image.height) < 0.01, `${variant.src}: aspect ratio changed`)
        const limit = budgets.estateThumbnailBytes[variant.width]
        if(limit) expect(bytes.length <= limit, `${variant.src}: ${bytes.length} bytes exceeds ${limit}`)
    }
    const full = image.variants.at(-1)
    expect(full.src === source && full.width === image.width && full.height === image.height, `${source}: full-resolution gallery source must remain available`)
    // Exercise the same candidate resolver used by ImageView at both supported bases.
    for(const base of ['/', '/VillaBagara/']) {
        const resolved = resolveResponsiveImage(source, path => base + path)
        for(const candidate of resolved.srcSet.split(', ')) {
            const [url, width] = candidate.split(' ')
            const valid = url.startsWith(base) && files.has(url.slice(base.length))
            expect(valid, `Invalid responsive candidate: ${candidate}`)
            if(!valid) continue
            const dimensions = imageDimensions(readFileSync(join(root, url.slice(base.length))))
            expect(`${dimensions?.width}w` === width, `Incorrect responsive width descriptor: ${candidate}`)
        }
    }
}

if(fromDist) {
    const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
    const pagesBase = repository?.toLowerCase().endsWith('.github.io') ? '/' : `/${repository}/`
    const base = process.argv.find(arg => arg.startsWith('--base='))?.slice(7)
        || process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' && repository ? pagesBase : '/')
    const html = readFileSync(join(root, 'index.html'), 'utf8')
    expect(base.startsWith('/') && base.endsWith('/'), `Invalid base: ${base}`)
    expect(/type="module"/.test(html), 'Missing built JavaScript entry')
    for(const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if(/^(?:https?:|mailto:|tel:|data:|#|\/\/)/.test(url)) continue
        expect(url.startsWith(base), `HTML asset is outside ${base}: ${url}`)
        const path = url.slice(base.length)
        expect(files.has(path.endsWith('/') || !path ? `${path}index.html` : path), `Missing HTML asset: ${url}`)
    }
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
    expect(canonical?.startsWith('https://'), 'Missing HTTPS canonical URL')
    for(const property of ['og:url', 'twitter:url']) {
        const url = html.match(new RegExp(`property="${property}" content="([^"]+)"`))?.[1]
        expect(url === canonical, `${property} does not match the canonical URL`)
    }
    const structuredData = html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
    const business = structuredData ? JSON.parse(structuredData) : null
    expect(business?.url === canonical, 'Structured data URL does not match the canonical URL')
    for(const property of ['og:image', 'twitter:image']) {
        const image = html.match(new RegExp(`property="${property}" content="([^"]+)"`))?.[1]
        if(!image || !canonical) { expect(false, `Missing ${property}`); continue }
        const imageURL = new URL(image)
        const canonicalURL = new URL(canonical)
        expect(imageURL.origin === canonicalURL.origin && imageURL.pathname.startsWith(canonicalURL.pathname), `${property} is outside the site URL`)
        expect(files.has(imageURL.pathname.slice(canonicalURL.pathname.length)), `Missing ${property} image file`)
    }
    for(const path of files) expect(!path.endsWith('.md'), `Documentation leaked into dist: ${path}`)
    const gzipBytes = [...files].filter(path => /^assets\/.*\.(?:js|css)$/.test(path))
        .reduce((total, path) => total + gzipSync(readFileSync(join(root, path))).length, 0)
    expect(gzipBytes <= budgets.jsCssGzipBytes, `JS/CSS gzip size ${gzipBytes} exceeds ${budgets.jsCssGzipBytes} bytes`)
    const estateBytes = readFileSync(join(root, 'images/villa_bagara/estate/front-porch.webp')).length
    expect(estateBytes <= budgets.estateImageBytes, `Estate image size ${estateBytes} exceeds ${budgets.estateImageBytes} bytes`)
    console.log(`Payload budgets: JS/CSS ${gzipBytes}/${budgets.jsCssGzipBytes} bytes gzip; estate image ${estateBytes}/${budgets.estateImageBytes} bytes.`)
    const shareBytes = readFileSync(join(root, 'images/villa_bagara/estate/share.jpg')).length
    expect(shareBytes <= 350000, `Social image exceeds 350 KB: ${shareBytes}`)
    const fontBytes = [...files].filter(path => /^fonts\/.*\.woff2$/.test(path)).reduce((sum, path) => sum + readFileSync(join(root, path)).length, 0)
    expect(fontBytes <= 80000, `Font subset budget exceeded: ${fontBytes}`)
    expect(![...files].some(path => /(?:fa-(?:solid|regular|brands)|primeicons).*\.(?:woff2?|ttf|eot)$/.test(path)), 'Unused icon fonts leaked into the build')
    let htmlPages = 0
    for(const path of files) {
        if(!path.endsWith('index.html')) continue
        htmlPages++
        const page = readFileSync(join(root, path), 'utf8')
        expect(page.includes('id="static-content"') && /<h1>.+<\/h1>/.test(page), `${path}: missing meaningful static HTML`)
        const expectedURL = 'https://lomuss33.github.io' + base + path.replace(/index\.html$/, '')
        expect(page.includes(`rel="canonical" href="${expectedURL}"`), `${path}: incorrect canonical`)
        expect(page.includes('hreflang="x-default"'), `${path}: missing language alternatives`)
        for(const [, url] of page.matchAll(/(?:src|href)="([^"]+)"/g)) {
            if(!url.startsWith(base)) continue
            const local = url.slice(base.length)
            expect(files.has(local.endsWith('/') || !local ? `${local}index.html` : local), `${path}: broken local link ${url}`)
        }
    }
    expect(htmlPages === sections.length * languages.length, `Expected ${sections.length * languages.length} static pages; got ${htmlPages}`)
    expect(files.has('sitemap.xml') && files.has('404.html'), 'Missing sitemap or 404 page')
    const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8')
    expect(!sitemap.includes('#') && (sitemap.match(/<loc>/g) || []).length === htmlPages, 'Sitemap contains fragments or misses pages')
    console.log(`Static SEO checked: ${htmlPages} pages; local fonts ${fontBytes} bytes; social image ${shareBytes} bytes.`)
}

if(errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
} else {
    console.log(`${fromDist ? 'Build' : 'Content'} checked: ${sections.length} sections, ${languages.length} languages, case-sensitive asset paths valid.`)
}
