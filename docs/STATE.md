# Current state

Updated: 2026-10-13. Use Git history for older changes.

## Target and status

- `Lomuss33/VillaBagara`, `main`; [live site](https://lomuss33.github.io/VillaBagara/).
- Published baseline `8e8514c`; [deployment](https://github.com/Lomuss33/VillaBagara/actions/runs/38312162813). Completion release below is prepared for CI/deployment.

## Completion release

- Existing loader, Home terrain/climate maps and named keyboard/mobile controls are included. Details: [ACCESSIBILITY.md](ACCESSIBILITY.md), [GALLERY_MAPS.md](GALLERY_MAPS.md).
- 28 generated HTML pages: seven sections/four locales, real URLs, metadata, hreflang, sitemap and 404. Hash compatibility remains. [Owners/commands](STATIC_SITE.md).
- Local Saira/Orbitron fonts: 70,164 bytes; used SVG icons replace icon fonts. Share JPEG: 312,072 bytes, 91% below PNG. Gallery assets approved by owner.
- Inquiry: pending lock, preserved fields on failure, timeout, persistent errors and direct email/WhatsApp. Automated checks mock EmailJS.
- Development remains port 5000, strict.

## Verification

- `npm run check` passes: lint, docs, six keyboard/route tests, seven-section content, 28 HTML pages; JS/CSS about 226 KB gzip; audit zero.
- Production browser: Stay/Contact real URLs, German selection, local fonts/icons and validation pass. Desktop/phone regression suite and three-run Lighthouse gates configured in Actions.

## Next

Pass release CI, verify live pages, send the one authorized labeled test to `contact@lovro-music.de`, and confirm inbox arrival. Owner address, capacity, amenities and check-in/out facts are requested; do not invent values.
