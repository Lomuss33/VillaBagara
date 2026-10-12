# Villa Bagara

Villa Bagara website built with Vite, React, SCSS, and JSON-driven content.

## Quick Start

Install Node.js 24 with npm (`.nvmrc`), then run these commands from the repository root:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). Keep the terminal running while developing; press `Ctrl+C` to stop the server.

Other commands:

- `npm run lint`: check the application code
- `npm run check:static`: validate active content and asset paths
- `npm run check:docs`: check documentation links and agent word budgets
- `npm run check`: run lint, docs/content validation, production build, and artifact checks
- `npm run build`: create a production build in `dist/`
- `npm run preview`: serve the production build locally

## Repo Structure

- `src/`: application code, providers, components, styles
- `public/data/`: settings, profile, strings, sections, and section content
- `public/images/`: static assets
- `npm/`: helper scripts for scaffolding/resetting template content
- `scripts/`: development/CI validation
- `docs/`: current handoff, delivery plan, and deployment instructions

## GitHub Pages and AI Agents

The target is `https://lomuss33.github.io/VillaBagara/`. The prepared workflow checks pull requests and deploys pushes to `main`; first select **GitHub Actions** in repository Pages settings. See [deployment instructions](docs/DEPLOYMENT.md) for local production checks, publication, and rollback.

Agents start with [AGENTS.md](AGENTS.md) and the short [current state](docs/STATE.md). The [delivery plan](docs/PLAN.md) maps priorities, acceptance criteria, and the documentation system. Detailed guides below are read as needed.

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
