# Current state

Updated: 2026-10-13. Use Git history for older changes.

## Target and release

- `Lomuss33/VillaBagara`, `main`; [live site](https://lomuss33.github.io/VillaBagara/).
- Published `3d74121`; [build, browser/Lighthouse and deploy passed](https://github.com/Lomuss33/VillaBagara/actions/runs/38418611269). Live localized HTML, sitemap and assets verified.

## Included improvements

- Loader, Home terrain/climate maps and keyboard/mobile controls released. [Accessibility](ACCESSIBILITY.md), [maps](GALLERY_MAPS.md).
- 28 HTML pages: seven sections/four locales, real URLs, metadata, hreflang, sitemap, 404; hash compatibility retained. [Owners/commands](STATIC_SITE.md).
- Local fonts 70,164 bytes; used SVG icons; share JPEG 312,072 bytes (91% below PNG). Owner approved gallery assets. Dev port remains 5000, strict.
- Inquiry locks pending fields, retains errors/text, supports timeout and direct contact. Draft-mode follow-up is prepared because EmailJS configuration failed.

## Verification

- Full local checks and six keyboard/route tests pass; audit zero; JS/CSS about 226 KB gzip.
- Published release: 24 browser tests pass. Lighthouse median performance 93, SEO 100, accessibility 96–98; CLS below 0.05. One cold Home run scored 71; reports preserve the timing outlier.
- Authorized email attempt: HTTP 400, service ID `myWebsite` not found; no message accepted or retried.

## Next

Publish/verify the draft-mode follow-up. Owner must provide valid EmailJS settings and exact address, capacity, amenities and arrival policies. No unsupported facts or delivery claims.
