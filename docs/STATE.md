# Current state

Updated: 2026-10-12. See Git history for older changes.

## Target and status

- `Lomuss33/VillaBagara`, branch `main`; target `https://lomuss33.github.io/VillaBagara/`.
- Pages source is `workflow`; pushes to `main` publish automatically. [Main checks/deployments](https://github.com/Lomuss33/VillaBagara/actions/workflows/deploy.yml?query=branch%3Amain) record release status.

## Release and workspace work

- Release: Node 24/npm, restricted Pages workflow, base-aware metadata, patched dependencies, automated checks, compact agent docs, and weekly Dependabot.
- Responsive estate images: 480px (57,832 bytes), 960px (222,674), full 1536px (517,906). `ImageView` chooses small-card candidates; gallery tiles/modal share the full file. The cache skips full-photo prefetch. Source, regeneration and budgets: [IMAGES.md](IMAGES.md).
- Independent loader, navigation/accessibility and gallery-map edits remain local and outside this release. Preserve their files and temporary development settings.
- [Reference guide](REFERENCE_MYWEBSITE.md) records source owners and compatibility; reference checkout preserved.

## Verification

- Clean release: `npm ci`, audit 0, full `/VillaBagara/` check; 7 sections/4 languages, JS/CSS 244,927 bytes gzip.
- Production browser: cold Home downloads only the 58 KB candidate; gallery repeats download the full photo once. Modal retains 1536px. Resizing, cached navigation and 390px layout pass; no failed assets or horizontal overflow.

## Next

Finish verification of independent keyboard/navigation work, then publish those changes separately. Owner confirmation of EmailJS delivery remains; no message was sent.
