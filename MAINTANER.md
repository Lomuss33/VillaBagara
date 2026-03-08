# Maintainer Notes

Back to the general repo overview: [README.md](./README.md)

User-facing clickable controls are documented in [USER_GUIDE.md](./USER_GUIDE.md).

## Overview

This repo is a Vite + React single-page portfolio/resume site. It is content-driven: most day-to-day changes happen in `public/data`, not in React components.

## Commands

- `npm run dev`: start local development
- `npm run build`: produce a production build
- `npm run lint`: run ESLint
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

1. `npm run lint`
2. `npm run build`

## Known Quirks

- The app is deployed with Vite `base: "/myWebsite/"`, so asset and path handling assumes that base path.
- The preloader waits for image preload completion through `LayoutImageCache`, so missing image paths can affect perceived startup behavior.
