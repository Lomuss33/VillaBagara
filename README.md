# myWebsite

Personal portfolio/resume site built with Vite, React, SCSS, and JSON-driven content.

## Quick Start

- `npm run dev`
- `npm run lint`
- `npm run build`

## Repo Structure

- `src/`: application code, providers, components, styles
- `public/data/`: settings, profile, strings, sections, and section content
- `public/images/`: static assets
- `npm/`: helper scripts for scaffolding/resetting template content

## Content Editing

Most site updates are content changes, not code changes.

- Update global behavior in `public/data/settings.json`
- Update profile data in `public/data/profile.json`
- Update section order in `public/data/sections.json`
- Update page content in `public/data/sections/*.json`

## Maintainer Guide

Detailed maintenance notes, schema conventions, and extension workflow live in [MAINTANER.md](./MAINTANER.md).

## User Guide

Clickable UI behavior and content-editing guidance for visible options live in [USER_GUIDE.md](./USER_GUIDE.md).
