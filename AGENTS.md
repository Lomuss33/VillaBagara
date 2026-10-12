# Agent guide

Villa Bagara is a static Vite + React 18 + SCSS website. Use Node 24 (`.nvmrc`) and npm. Sections use URL hashes; GitHub Pages serves `dist/`.

## Start here

Read [docs/STATE.md](docs/STATE.md) for verified progress and the next task. Read only the relevant detail below. Code, JSON registries, and the lockfile are authoritative; flag stale docs when they disagree.

| Task | Start with |
| --- | --- |
| Copy, photos, contact details | `public/data/sections/<section>.json`, `public/images/` |
| Languages, themes, startup options | `public/data/settings.json`, `public/data/strings.json`, `public/data/profile.json` |
| Section order, categories | `public/data/sections.json`, `public/data/categories.json` |
| Boot or loading failures | `src/main.jsx`, `src/providers/DataProvider.jsx` |
| Routing, transitions | `src/providers/LocationProvider.jsx`, `src/providers/NavigationProvider.jsx` |
| Article schema or rendering | `MAINTANER.md`, `src/components/sections/SectionBody.jsx`, `src/hooks/models/` |
| Appearance | Matching component `.scss`, then `src/styles/themes/` |
| Deployment | `docs/DEPLOYMENT.md`, `.github/workflows/deploy.yml`, `vite.config.js`, `index.html` |
| Priorities and decisions | `docs/PLAN.md`; history: `git log -5 --oneline` |
| CI limits and checks | `scripts/budgets.json`, `scripts/check-*.mjs` |
| Learn or adapt from myWebsite | `docs/REFERENCE_MYWEBSITE.md`; compare matching source owners before porting |

## Work efficiently

- Check `git status --short`; preserve existing work. Narrow `rg` searches to the relevant paths. Exclude `node_modules/`, `dist/`, and `tmp/` from source searches.
- Run `npm ci` when dependencies are missing or the lockfile changes; `npm run dev` starts development.
- Prefer content edits over component changes. Preserve the configured locale keys and unique IDs.
- Resolve runtime public assets with `utils.file.resolvePath`; use `%BASE_URL%` in HTML. File names must match case exactly on Pages.
- Keep agent docs outside `public/` and runtime imports. Add dependencies only for a concrete need.
- `npm run resume:clear` resets template content; run it only for an explicitly requested reset.

## Verify and hand off

- Docs only: `npm run check:docs` and `git diff --check`. Content: `npm run check:static` and inspect the changed section.
- Code, styles, dependencies, or deployment: `npm run check`. Deployment changes also need the `/VillaBagara/` preview procedure in `docs/DEPLOYMENT.md`.
- Check affected desktop/mobile interactions after UI changes. Stop repeating checks after they pass unless something changes.
- Update `docs/STATE.md` for material milestones or unfinished work: changed paths, checks/results, and the precise next step. Keep it under 250 words; use Git history for older changes.
- Report deployment only after a successful GitHub deployment and live-page verification.
