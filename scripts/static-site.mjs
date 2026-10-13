import {readFileSync, mkdirSync, writeFileSync} from 'node:fs'
import {join, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import {pagePath, pageLanguages} from '../src/hooks/siteRoutes.js'
import {resolveResponsiveImage} from '../src/hooks/utils/_image-utils.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const publicJSON = path => JSON.parse(readFileSync(join(root, 'public', path), 'utf8'))
const escape = value => String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
const plain = value => String(value || '').replace(/<[^>]*>/g, '').replace(/[{}\[\]]/g, '').trim()
const format = value => escape(plain(value))
const labels = {
    en: {menu: 'Explore Villa Bagara', language: 'Language', contact: 'Ask about your stay', photos: 'Estate gallery', note: 'Confirm availability, amenities, arrival arrangements and the total price with the host before making travel plans.', unavailable: 'Page not found', back: 'Return to Villa Bagara'},
    de: {menu: 'Villa Bagara entdecken', language: 'Sprache', contact: 'Aufenthalt anfragen', photos: 'Galerie', note: 'Bestätigen Sie Verfügbarkeit, Ausstattung, Anreise und Gesamtpreis mit dem Gastgeber, bevor Sie Ihre Reise planen.', unavailable: 'Seite nicht gefunden', back: 'Zurück zu Villa Bagara'},
    hr: {menu: 'Istraži Villu Bagara', language: 'Jezik', contact: 'Pošalji upit za boravak', photos: 'Galerija imanja', note: 'Prije planiranja putovanja s domaćinom potvrdi dostupnost, sadržaje, dolazak i ukupnu cijenu.', unavailable: 'Stranica nije pronađena', back: 'Vrati se na Villu Bagara'},
    tr: {menu: "Villa Bagara'yı keşfedin", language: 'Dil', contact: 'Konaklama hakkında sorun', photos: 'Galeri', note: 'Seyahat planlamadan önce müsaitliği, olanakları, varış düzenini ve toplam fiyatı ev sahibiyle teyit edin.', unavailable: 'Sayfa bulunamadı', back: "Villa Bagara'ya dönün"}
}

function contentData() {
    const registry = publicJSON('data/sections.json').sections
    return registry.map(section => ({...section, content: publicJSON(section.jsonPath.replace(/^\//, ''))}))
}

export function renderStaticPage(template, sectionId = 'home', language = 'en', base = '/') {
    const sections = contentData()
    const section = sections.find(section => section.id === sectionId) || sections[0]
    const text = labels[language]
    const path = pagePath(section.id, language, base)
    const canonical = new URL(path, 'https://lomuss33.github.io').href
    const title = `Villa Bagara | ${plain(section.content.title.locales[language].title_short)}`
    const paragraphs = section.content.articles.flatMap(article => (article.items || []).map(item => item.locales?.[language]?.text)).filter(Boolean)
    const description = plain(paragraphs[0] || `${text.menu}. ${text.contact}.`).slice(0, 155)
    const link = href => href?.startsWith('#') ? pagePath(href.slice(1), language, base) : href
    const nav = sections.map(item => `<a href="${pagePath(item.id, language, base)}"${item.id === section.id ? ' aria-current="page"' : ''}>${format(item.content.title.locales[language].title_short_nav)}</a>`).join('')
    const alternates = pageLanguages.map(locale => `<link rel="alternate" hreflang="${locale}" href="${new URL(pagePath(section.id, locale, base), 'https://lomuss33.github.io')}" />`).join('\n')
        + `\n<link rel="alternate" hreflang="x-default" href="${new URL(pagePath(section.id, 'en', base), 'https://lomuss33.github.io')}" />`
    const articles = section.content.articles.map(article => {
        const locale = article.locales?.[language] || article.locales?.en || {}
        const items = (article.items || []).map(item => {
            const itemText = item.locales?.[language] || item.locales?.en || {}
            const candidates = article.component !== 'ArticleGalleryWall' ? resolveResponsiveImage(item.img, path => base + path) : null
            const responsive = candidates ? ` srcset="${escape(candidates.srcSet)}" sizes="(min-width:1100px) 340px, (min-width:650px) 50vw, 90vw"` : ''
            const image = item.img ? `<img src="${base}${item.img.replace(/^\//, '')}"${responsive} alt="${escape(plain(itemText.title || itemText.label || text.photos))}" width="480" height="320" loading="lazy" decoding="async" />` : ''
            const destination = link(item.link?.href)
            return `<div class="static-card">${image}${itemText.title ? `<h3>${format(itemText.title)}</h3>` : ''}${itemText.text ? `<p>${format(itemText.text)}</p>` : ''}${destination ? `<a href="${escape(destination)}">${format(itemText.label || itemText.title || text.contact)}</a>` : ''}</div>`
        }).join('')
        const contact = article.component === 'ArticleContactForm' ? `<p>${escape(text.note)}</p><a href="mailto:contact@lovro-music.de">contact@lovro-music.de</a> · <a href="https://wa.me/4917662236934">WhatsApp</a>` : ''
        return `<section>${locale.title ? `<h2>${format(locale.title)}</h2>` : ''}<div class="static-cards">${items}${contact}</div></section>`
    }).join('')
    const heading = section.content.title.locales[language]
    const languages = pageLanguages.map(locale => `<a lang="${locale}" hreflang="${locale}" href="${pagePath(section.id, locale, base)}">${{en:'English', de:'Deutsch', hr:'Hrvatski', tr:'Türkçe'}[locale]}</a>`).join(' · ')
    const body = `<div id="static-content" class="static-shell"><header><a class="static-brand" href="${pagePath('home', language, base)}">Villa <span>Bagara</span></a><nav aria-label="${escape(text.menu)}">${nav}</nav><div aria-label="${escape(text.language)}">${languages}</div></header><main><h1>${format([heading.title_long_prefix, heading.title_long].filter(Boolean).join(' '))}</h1>${articles}<p class="static-action"><a href="${pagePath('contact', language, base)}">${escape(text.contact)} →</a></p></main><footer><p>${escape(text.note)}</p><a href="mailto:contact@lovro-music.de">contact@lovro-music.de</a> · <a href="https://wa.me/4917662236934">WhatsApp</a></footer></div>`
    let html = template.replace(/<html[^>]*>/, `<html lang="${language}" data-page-language="${language}">`)
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
        .replace(/rel="canonical" href="[^"]+"/, `rel="canonical" href="${canonical}"`)
        .replace(/(<meta name="description" content=")[^"]*("[^>]*>)/, `$1${escape(description)}$2`)
    for(const property of ['og:url', 'twitter:url']) html = html.replace(new RegExp(`(property="${property}" content=")[^"]*(")`), `$1${canonical}$2`)
    for(const property of ['og:title', 'twitter:title']) html = html.replace(new RegExp(`(property="${property}" content=")[^"]*(")`), `$1${escape(title)}$2`)
    for(const property of ['og:description', 'twitter:description']) html = html.replace(new RegExp(`(property="${property}" content=")[^"]*(")`), `$1${escape(description)}$2`)
    const business = {"@context": "https://schema.org", "@type": "LodgingBusiness", name: 'Villa Bagara', description, url: canonical, image: 'https://lomuss33.github.io/VillaBagara/images/villa_bagara/estate/share.jpg'}
    html = html.replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, `$1${JSON.stringify(business)}$2`)
        .replace(/<link rel="alternate"[^>]+>\s*/g, '')
        .replace('</head>', `${alternates}\n</head>`)
        .replace(/<div id="static-content"[\s\S]*?(?=<div id="root")/, '')
        .replace('<div id="root"', `${body}<div id="root"`)
    if(!html.includes('static.css')) html = html.replace('</head>', '<link rel="stylesheet" href="/static.css" />\n</head>')
    return html
}

export function buildStaticPages(directory, base) {
    const template = readFileSync(join(directory, 'index.html'), 'utf8')
    const urls = []
    for(const language of pageLanguages) {
        for(const section of contentData()) {
            const route = pagePath(section.id, language, base)
            const file = join(directory, route.slice(base.length), 'index.html')
            mkdirSync(dirname(file), {recursive: true})
            writeFileSync(file, renderStaticPage(template, section.id, language, base))
            urls.push({route, section: section.id, language})
        }
    }
    const sitemap = urls.map(page => `<url><loc>https://lomuss33.github.io${page.route}</loc>${pageLanguages.map(locale => `<xhtml:link rel="alternate" hreflang="${locale}" href="https://lomuss33.github.io${pagePath(page.section, locale, base)}" />`).join('')}</url>`).join('\n')
    writeFileSync(join(directory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemap}</urlset>`)
    // robots.txt is an origin-root policy; a project-level file would not control crawling.
    const missing = renderStaticPage(template, 'home', 'en', base)
        .replace(/<main>[\s\S]*?<\/main>/, `<main><h1>Page not found</h1><p><a href="${base}">Return to Villa Bagara</a></p></main>`)
        .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow"/>')
        .replace(/<script type="module"[^>]*><\/script>/g, '')
        .replace('<div id="root"></div>', '')
    writeFileSync(join(directory, '404.html'), missing)
    console.log(`Static HTML: ${urls.length} pages, four locales, sitemap and 404 page.`)
}
