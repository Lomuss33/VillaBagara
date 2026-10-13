export const pageSections = ['home', 'stay', 'services', 'story', 'gallery', 'videos', 'contact']
export const pageLanguages = ['en', 'de', 'hr', 'tr']

export function readPageRoute(pathname, base = '/') {
    if(!pathname.startsWith(base)) return null
    const parts = pathname.slice(base.length).replace(/index\.html$/, '').split('/').filter(Boolean)
    const language = pageLanguages.includes(parts[0]) ? parts.shift() : null
    const section = parts.shift() || 'home'
    if(parts.length || !pageSections.includes(section)) return null
    return {section, language}
}

export function pagePath(section = 'home', language = 'en', base = '/') {
    const locale = pageLanguages.includes(language) && language !== 'en' ? `${language}/` : ''
    const destination = pageSections.includes(section) && section !== 'home' ? `${section}/` : ''
    return `${base}${locale}${destination}`
}

export function syncPageAddress(section, language, base) {
    const pathname = pagePath(section, language, base)
    if(window.location.pathname !== pathname) {
        window.history.replaceState({}, '', `${pathname}${window.location.search}${window.location.hash}`)
    }
    const canonical = new URL(pathname, window.location.origin).href
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    for(const property of ['og:url', 'twitter:url']) {
        document.querySelector(`meta[property="${property}"]`)?.setAttribute('content', canonical)
    }
    for(const alternate of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
        const locale = alternate.hreflang === 'x-default' ? 'en' : alternate.hreflang
        alternate.href = new URL(pagePath(section, locale, base), window.location.origin).href
    }
}
