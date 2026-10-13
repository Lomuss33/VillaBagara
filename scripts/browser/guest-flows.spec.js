import {test, expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({page}) => {
    // Every automated test blocks real email; individual response tests replace this mock.
    await page.route('https://api.emailjs.com/**', route => route.abort())
})

for(const section of ['home', 'stay', 'services', 'story', 'gallery', 'videos', 'contact']) {
    test(`direct ${section} page survives refresh and has accessible content`, async ({page}) => {
        const errors = []
        const missing = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('response', response => { if(response.url().startsWith('http://127.0.0.1:4185') && response.status() >= 400) missing.push(response.url()) })
        await page.goto(section === 'home' ? './' : `${section}/`)
        await expect(page.locator(`#section-${section}.section-shown`)).toBeVisible()
        await expect(page.locator('#static-content')).toHaveCount(0)
        await page.reload()
        await expect(page.locator(`#section-${section}.section-shown`)).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        const accessibility = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
        expect(accessibility.violations).toEqual([])
        expect(errors).toEqual([])
        expect(missing).toEqual([])
    })
}

test('static pages work without JavaScript in every locale', async ({browser, baseURL}) => {
    const context = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}})
    const page = await context.newPage()
    for(const language of ['en', 'de', 'hr', 'tr']) {
        const url = new URL(`${language === 'en' ? '' : language + '/'}stay/`, baseURL)
        await page.goto(url.href)
        await expect(page.locator('html')).toHaveAttribute('lang', language)
        await expect(page.locator('#static-content main h1')).toBeVisible()
        await expect(page.locator('#static-content nav a')).toHaveCount(7)
        await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://lomuss33.github.io${url.pathname}`)
    }
    await context.close()
})

test('localized real URL and language switching remain coherent', async ({page}) => {
    await page.goto('de/contact/')
    await expect(page.locator('#section-contact.section-shown')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expect(page.getByRole('button', {name: /Sprache.*Deutsch/})).toBeVisible()
    await page.getByRole('button', {name: /Sprache.*Deutsch/}).click()
    await page.getByRole('menuitemradio', {name: 'English'}).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page).toHaveURL(/\/contact\/#contact$/)
})

test('gallery opens, traps focus and returns it to the photo', async ({page}) => {
    await page.goto('gallery/')
    const photo = page.locator('.section-shown .article-gallery-wall-item').first()
    await expect(photo).toBeVisible()
    await photo.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const image = dialog.locator('img').first()
    await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(photo).toBeFocused()
})

async function fillInquiry(page) {
    await page.goto('contact/')
    await expect(page.locator('#contact-form')).toBeVisible()
    await page.locator('#contact-form-name').fill('Automated browser test')
    await page.locator('#contact-form-email').fill('test@example.com')
    await page.locator('#contact-form-subject').fill('TEST ONLY: no booking')
    await page.locator('#contact-form-textarea').fill('This is a mocked browser test. No email should be sent.')
}

test('provider failure preserves the inquiry and offers direct contact', async ({page}) => {
    await page.unroute('https://api.emailjs.com/**')
    await page.route('https://api.emailjs.com/**', route => route.fulfill({status: 503, body: 'Unavailable'}))
    await fillInquiry(page)
    await page.locator('#contact-form button[type=submit]').click()
    await expect(page.locator('#contact-form .alert')).toBeVisible()
    await expect(page.locator('#contact-form-textarea')).toHaveValue('This is a mocked browser test. No email should be sent.')
    await expect(page.locator('#contact-form .contact-fallback a[href^="mailto:"]')).toBeVisible()
    await expect(page.locator('#contact-form button[type=submit]')).toBeEnabled()
})

test('pending inquiry disables duplicate submissions and accepted response shows success', async ({page}) => {
    let requests = 0
    await page.unroute('https://api.emailjs.com/**')
    await page.route('https://api.emailjs.com/**', async route => {
        requests++
        await new Promise(resolve => setTimeout(resolve, 300))
        await route.fulfill({status: 200, body: 'OK'})
    })
    await fillInquiry(page)
    await page.locator('#contact-form button[type=submit]').click()
    await expect(page.locator('#contact-form')).toHaveAttribute('aria-busy', 'true')
    await expect(page.locator('#contact-form button[type=submit]')).toBeDisabled()
    await expect(page.locator('#contact-form .message-card')).toBeVisible()
    expect(requests).toBe(1)
})
