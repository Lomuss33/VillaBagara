# Maintainer Notes

Back to the general repo overview: [README.md](./README.md)

User-facing clickable controls are documented in [USER_GUIDE.md](./USER_GUIDE.md).

## Overview

This repo is the Villa Bagara Vite + React static website, adapted from a portfolio template. It is content-driven: most day-to-day changes happen in `public/data`, not in React components. Agent onboarding starts in [AGENTS.md](AGENTS.md); release instructions live in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Commands

- `npm run dev`: start local development
- `npm run build`: produce a production build
- `npm run lint`: run ESLint
- `npm run check:static`: validate active section schemas, locale coverage, and case-sensitive asset paths
- `npm run check:docs`: check documentation links and agent word budgets
- `npm run check`: run lint, docs/content checks, production build, and artifact checks
- `npm run resume:make:article <ArticleName>`: scaffold a new article component and register it
- `npm run resume:clear`: reset the repo to a blank template state

## Project Map

- `src/main.jsx`: app bootstrap and provider stack
- `src/providers`: app-wide state and behavior
- `src/components/layout`: app shell, slideshow, image preloading
- `src/components/nav`: desktop/mobile navigation
- `src/components/sections`: section header/body rendering
- `src/components/articles`: JSON-driven article block implementations
- `src/hooks/models`: wrappers that normalize section/article/item JSON
- `src/styles`: SCSS entrypoint, layout styling, theme variables
- `public/data`: settings, strings, profile, categories, section registry, section content

## Content Model

Global config:

- `public/data/settings.json`: languages, themes, preloader, template behavior
- `public/data/profile.json`: name, avatar, roles, resume URL
- `public/data/strings.json`: UI translations
- `public/data/categories.json`: top-level nav categories
- `public/data/sections.json`: ordered list of sections and their JSON files

Each section file under `public/data/sections` should contain:

- `title.locales`
- `articles[]`

Each article should contain:

- `component`: must match a component registered in `src/components/sections/SectionBody.jsx`
- `locales`
- `settings`
- `items[]`

Canonical category schema for article items:

- `settings.categorize_by`: array of category ids
- `item.categoryId`: category id for each item

The runtime still accepts legacy data that used `settings.categorize_by: "category"` and `item.category`, but new content should use the canonical schema above.

## Common Changes

Add or reorder sections:

1. Edit `public/data/sections.json`
2. Create or update the matching section JSON file in `public/data/sections`

Change text or portfolio content:

1. Edit the relevant section JSON file
2. Keep locale keys aligned across languages

Add a new article type:

1. Run `npm run resume:make:article ArticleYourName`
2. Implement the new component in `src/components/articles`
3. Use that `component` name in section JSON

Change theme styling:

1. Edit `src/styles/themes/_variables-theme-dark.scss`
2. Edit `src/styles/themes/_variables-theme-light.scss`
3. If needed, update shared variables in `src/styles/themes/_theme-variables-builder.scss`

Change navigation or transitions:

1. `LocationProvider` handles hash-based routing
2. `NavigationProvider` handles section switching and animations
3. `ViewportProvider` controls layout mode and responsive helpers

## Validation

Before merging changes, run:

1. `npm run check`
2. Inspect the changed UI at desktop/mobile sizes when applicable. For deployment changes, follow the production base-path preview in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Image and context budgets

`scripts/budgets.json` is the source of truth for the agent word limits and production payload limits. `npm run check` enforces them. Estate thumbnails select 480px/960px WebPs; the gallery retains `front-porch.webp` (approximately 518 KB, 85% smaller than the PNG). The original PNG remains available for social metadata.

To regenerate all candidates and their manifest without adding an application dependency:

```sh
npm run images:responsive
```

Inspect and commit the outputs together; [docs/IMAGES.md](docs/IMAGES.md) lists source owners and validation. When changing a payload budget, record the measured reason in `docs/STATE.md`. Dependabot proposes weekly npm and GitHub Actions updates; CI validates them before review.

## Hosting Notes

- GitHub Actions derives the project base from `GITHUB_REPOSITORY`; this repo publishes under `/VillaBagara/`. Local development defaults to `/`, with `VITE_BASE_PATH` as an override.
- `LayoutImageCache` defers image caching. Keep this work outside the initial render; use `npm run check:static` to catch missing files before publishing.
- Static publishing does not provide an email backend. Contact delivery uses the configured external EmailJS service.
