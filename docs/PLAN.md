# Delivery and agent documentation plan

Goal: reliable GitHub Pages hosting and fast agent onboarding with small, accurate context. Publish at `https://lomuss33.github.io/VillaBagara/`.

## Delivery stages

| Stage | Work and location | Completion evidence |
| --- | --- | --- |
| 1. Prepare | Modern workflow in `.github/workflows/deploy.yml`; Pages paths in `vite.config.js`/`index.html`; dependency patches; static checks in `scripts/` | Locked install, lint, content/build checks, zero current audit findings, desktop/mobile production preview |
| 2. Publish | Follow `docs/DEPLOYMENT.md`; switch repository Pages source to GitHub Actions; push reviewed changes to `main` | Green build/deploy, live assets without 404s, hash-route refreshes, correct share metadata |
| 3. Confirm guest flows | Gallery, language/theme tools, mobile tabs, WhatsApp/e-mail destinations; EmailJS provider configuration | Browser checks and owner-confirmed message delivery; record remaining service limitations in `docs/STATE.md` |
| 4. Improve performance | WebP estate image and responsive derivatives in `public/images/`; manifest/candidates in `ImageView`; limits in `scripts/budgets.json` | PNG to full WebP: 85% smaller. The 480px candidate is 57,832 bytes (89% below full WebP); 960px is 222,674 bytes. Gallery keeps full resolution; production JS/CSS stays below 270 KB gzip. See `docs/IMAGES.md` |
| 5. Maintain | CI checks documentation links, agent word limits, content, metadata, and payload budgets; Dependabot checks npm/actions weekly | Passing CI and dated handoff evidence; updates receive review before merge |

Stages 1, 2, and 4 are complete: the release is published and live desktop/mobile checks pass. Maintenance checks and weekly update proposals are configured. External contact delivery requires owner verification; keyboard/accessibility work is the next engineering priority described in `docs/REFERENCE_MYWEBSITE.md`.

## Small documentation system

| File | Purpose | Read/update policy |
| --- | --- | --- |
| `AGENTS.md` | Commands, task-to-file map, conventions, verification | Agent entry point; target under 450 words |
| `docs/STATE.md` | What changed, what was verified, what remains | Read once at task start; under 250 words; replace obsolete state |
| `docs/PLAN.md` | Priorities, acceptance criteria, design decisions | Read for planning; update when scope or priorities change |
| `docs/DEPLOYMENT.md` | Pages setup, exact preview steps, rollback | Read when touching hosting or release configuration |
| `docs/REFERENCE_MYWEBSITE.md` | Reference capabilities, owners, compatibility, proposed improvements | Read when adapting a myWebsite feature; recheck owning source before implementation |
| `docs/IMAGES.md` | Responsive assets, regeneration and validation | Read only for image or image-loading changes |
| `MAINTANER.md` / `USER_GUIDE.md` | Existing schema details / visible UI behavior | Read only for the relevant implementation or interface task |
| Git commits and PR descriptions | Durable change history and review evidence | Consult scoped history; keep transcripts and raw logs out of agent context |

For an agent that does not discover `AGENTS.md`, start its task with: **Read AGENTS.md and docs/STATE.md, then open only the files relevant to this task.** Avoid maintaining duplicate instructions for each AI tool; use a pointer if a tool requires its own instruction file. Compatibility depends on the tool's support for the [AGENTS.md convention](https://agents.md/).

## Improvements prepared from myWebsite

The [reference guide](REFERENCE_MYWEBSITE.md) records the 2026-10-12 comparison and a workflow for adapting complete content/rendering/behavior paths. These are engineering candidates; delivery stages retain their recorded status.

| Order | Work | Acceptance |
| --- | --- | --- |
| 1 | Named, keyboard-reachable compact navigation and language/theme tools | Localized names, focus and native control behavior; desktop/mobile navigation retain correct hashes |
| 2 | Responsive thumbnail variants complete | Cold Home uses 57,832 bytes; gallery tiles share one full-resolution download. Both bases, cached navigation, resizing and 390px layout pass; JS/CSS is 244,927 bytes gzip |
| 3 | Viewport, scrolling, overlay and animation lifecycle | Navigation agrees after resize; contact stays reachable; modal dismissal and pause/resume preserve interaction; reduced motion works |
| 4 | Configurable guest photo/text blocks, then content-backed filters/location/decoration | Four locales/two themes reflow; keyboard/touch pass; performance remains within current budgets |

Preserve Villa's gallery, contact shortcut, hiking loader, seven routes and locales. Inspect dependency chains and route-specific assumptions before adapting a feature. Retain current layout selection until a Villa design change calls for different rules. Lazy loading follows measured need or a costly new feature.

## Decisions and performance guardrails

- Keep Vite/React and hash routing: no hosting backend or routing migration is needed.
- Use official Pages artifacts: build once, validate that output, then publish it. PRs receive no deployment permissions.
- Use progressive reading: one short entry point, one current handoff, and task-specific detail. Target under 700 words for the two startup documents; token counts vary by model.
- Documentation lives outside `public/` and application imports, so these documents add no browser payload. Checks run only during development/CI and add no runtime library.
- `scripts/budgets.json` makes the context and production size limits executable; `npm run check:docs` is the fast path for documentation-only work.
- For content-only tasks, inspect the relevant JSON and run its checks. For code/dependency changes, run the full check once and verify affected interactions. Repeat only after new changes or failures.
- Record compressed JS/CSS and image transfer sizes before performance changes. Investigate increases above 10% against that baseline; compare loading and interaction behavior rather than relying on bundle size alone.
