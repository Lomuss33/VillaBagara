# Current state

Updated: 2026-10-13. Use Git history for older changes.

## Target and release

- `Lomuss33/VillaBagara`, `main`; [live site](https://lomuss33.github.io/VillaBagara/).
- Published `1882bc4`; [build, browser/Lighthouse and deployment passed](https://github.com/Lomuss33/VillaBagara/actions/runs/38420995636). Live real URLs, localized content, sitemap, assets, draft flow and versioned JSON verified.

## Included improvements

- Loader, Home terrain/climate maps and keyboard/mobile controls released. [Accessibility](ACCESSIBILITY.md), [maps](GALLERY_MAPS.md).
- 28 HTML pages: seven sections/four locales, metadata, hreflang, sitemap, 404 and hash compatibility. [Owners/commands](STATIC_SITE.md).
- Local fonts 70,164 bytes; used SVG icons; share JPEG 312,072 bytes (91% below PNG). Owner approved gallery assets. Dev remains port 5000, strict.
- Inquiry defaults to reviewable email drafts; direct email/WhatsApp remain available. Provider mode has pending locks, preserved text/errors and a timeout. Build-derived JSON versions prevent stale configuration. Documentation-only single-commit pushes use fast CI.

## Verification

- Local checks: seven keyboard/routing/CI-scope tests, audit zero, JS/CSS 226,090 bytes gzip.
- Release: 26 browser tests pass; live desktop and 390/320px checks pass without missing local assets or overflow.
- Initial Lighthouse: SEO 100, accessibility 96–98, median performance 93, CLS below 0.05. One cold Home run scored 71; reports retain that outlier.

## Next / owner inputs

One authorized live email attempt returned HTTP 400: service `myWebsite` not found; no message accepted/retried. Owner must supply working EmailJS settings plus exact address, guest capacity, amenities and check-in/out policies. Do not invent facts or claim inbox delivery.
