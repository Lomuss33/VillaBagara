# Static pages, performance and guest inquiries

The build emits seven sections in English, German, Croatian and Turkish: 28 HTML documents. English pages use `/VillaBagara/stay/`; translated pages use `/VillaBagara/de/stay/`, and similarly for each section. Home uses the site or locale root. Existing hash links continue to work.

## Source owners

| Task | File |
| --- | --- |
| Page content, guest FAQs, photos | `public/data/sections/<section>.json` |
| HTML output, metadata, sitemap, language alternatives, 404 | `scripts/static-site.mjs`, `public/static.css`, `index.html` |
| Path/hash compatibility and language selection | `src/hooks/siteRoutes.js`, `LocationProvider.jsx`, `LanguageProvider.jsx`, `src/main.jsx` |
| Font subsets/licenses | `scripts/generate-fonts.mjs`, `public/fonts/`, `public/licenses/` |
| Used SVG icons | `scripts/generate-icons.mjs`, `src/styles/generated/icons.css` |
| Inquiry state, provider failure, timeout | `ArticleContactForm.jsx`, `src/hooks/api.js`, `RowForm.jsx` |
| Browser and performance gates | `playwright.config.js`, `scripts/browser/`, `.lighthouserc.cjs`, `.github/workflows/deploy.yml` |

The HTML contains meaningful localized content and crawlable links before JavaScript loads. React enhances the same page. The fallback remains usable until the application is ready; a startup error reveals the error view. Every page has its own title, description, canonical, language alternatives and structured data. `sitemap.xml` lists real URLs without fragments. Submit that URL in Google Search Console after owner verification. Project-level `robots.txt` cannot set origin-root policy, so robots directives stay in the HTML.

Public JSON requests carry a build-derived content version. Updated content/settings receive a new cache key, so a deployment does not combine fresh JavaScript with cached old configuration. No server cache-header customization is needed.

## Assets

Run `npm run fonts:generate` only when intentionally updating fonts. It downloads licensed Saira/Orbitron Latin and extended-Latin WOFF2 subsets; commit files and licenses. All four locales retain their characters. Font display uses `swap`. The unused Lato import is removed.

Vite generates SVG masks for icon classes present in components/providers and active content. Existing `fa-*` markup remains compatible; PrimeIcons' spin utility remains supported. Font Awesome attribution ships in `public/licenses/`. Add icon names explicitly, then rebuild; dynamic name construction needs an explicit source declaration. CI rejects icon-font output and limits local fonts to 80 KB. Icons support reduced motion and forced colors.

`npm run images:responsive` also creates `share.jpg` from the existing estate image: 1200×800, 312,072 bytes, about 91% below the original PNG. Active gallery assets remain unchanged. Update metadata if the share path changes.

## Inquiry verification

The form preserves text after failures, locks fields while pending, clears its activity indicator, and times out after 30 seconds without automatic retries. Email/WhatsApp alternatives stay available. A provider acceptance response confirms submission, not inbox delivery.

The single authorized live test on 2026-10-13 returned HTTP 400: configured service `myWebsite` was not found. No message was accepted. Until the owner provides current EmailJS settings, `delivery_mode` in `contact.json` is `email-draft`: validate fields, prepare a reviewable `mailto:` link, and let the guest send it in their email app. It never claims a draft was delivered. Set `delivery_mode` to `emailjs` only after configuring a working service/template/public key and verifying delivery. Browser tests exercise draft mode plus mocked provider scenarios; they never send real mail.

`npm run check:browser` requires `npx playwright install chromium` and a completed production build. Match `VITE_BASE_PATH` to the build. The suite checks desktop/phone routes, refreshes, no-JavaScript pages, languages, axe accessibility, galleries, and failure/success/duplicate inquiry handling. It blocks real EmailJS and mocks responses. `npm run check:lighthouse` measures Home/Contact three times; accessibility, SEO, CLS and font-count limits gate releases, while performance timings initially warn. Reports are retained in GitHub Actions for seven days, without runtime code.

Only send a real inquiry after explicit recipient authorization, once, with test data. Record the provider result and ask the recipient to confirm arrival. Property address, capacity, amenities and arrival policies require owner-supplied facts; keep unsupported values out of public copy. Owner approved the existing gallery on 2026-10-13. Guest FAQs explain how to obtain confirmations.
