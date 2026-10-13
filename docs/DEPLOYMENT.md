# GitHub Pages deployment

Target: [Villa Bagara](https://lomuss33.github.io/VillaBagara/). Source: `main`. Published artifact: `dist/`.

GitHub Pages is configured for **GitHub Actions**. Release `560a763` was published and verified on 2026-10-12: [successful build and deployment](https://github.com/Lomuss33/VillaBagara/actions/runs/38282721363).

## Publication and migration procedure

1. Review the local changes and run the checks below.
2. Confirm **Source** is **GitHub Actions** in [repository Pages settings](https://github.com/Lomuss33/VillaBagara/settings/pages). This migration is already complete for Villa Bagara.
3. Commit and push the prepared changes to `main`. A push to `main` publishes automatically; pull requests only run checks. Alternatively, run **Check and deploy Villa Bagara** manually from the Actions tab after the workflow reaches `main`.
4. Wait for both `build` and `deploy` to succeed. Confirm the deployment URL in the `github-pages` environment.
5. Verify the live homepage, gallery/modal, contact section, and a refresh at `/#gallery` under the repository URL. Check mobile navigation and each configured language.

The workflow uses Node 24, `npm ci`, `npm run check`, browser/axe tests, Lighthouse and an audit gate. Checks cover docs, content, 28 HTML pages, metadata and payload limits. Quality reports are retained for seven days. Only deployment receives Pages/OIDC write permissions.

## Local verification

Normal local development:

```sh
npm ci
npm run dev
```

Test the production artifact at the exact Pages base path in PowerShell:

```powershell
$env:VITE_BASE_PATH = '/VillaBagara/'
npm run check
npm run preview -- --port 4173
```

Open `http://localhost:4173/VillaBagara/#home`. Also open `#gallery` and `#contact` directly and refresh them. Stop the preview with `Ctrl+C`, then remove the temporary override:

```powershell
Remove-Item Env:VITE_BASE_PATH
```

On Bash, prefix commands with `VITE_BASE_PATH=/VillaBagara/`. Also refresh `/VillaBagara/stay/` and `/VillaBagara/de/contact/`; verify HTML content with JavaScript disabled. The build emits every page and a helpful `404.html`; no server rewrite is needed. See [STATIC_SITE.md](STATIC_SITE.md).

## Configuration and external services

- `vite.config.js` derives `/VillaBagara/` from `GITHUB_REPOSITORY` in Actions; local development defaults to `/`. `VITE_BASE_PATH` overrides this when needed. Leave the repository variable unset for this deployment.
- A future custom domain or repository rename requires updating the canonical, Open Graph, Twitter, and structured-data URLs in `index.html`. A custom domain uses base `/`.
- EmailJS credentials in `public/data/sections/contact.json` are browser configuration. Confirm the service/template and any origin restrictions for the Pages URL, then verify delivery with the owner's chosen test address. Keep private keys and server credentials out of public files and `VITE_*` variables.
- Fonts are served locally. EmailJS, terrain tiles and embedded YouTube depend on external services. Pages does not run a backend.

## Rollback

Revert the release commit on `main` and push the revert. The same workflow rebuilds and publishes the prior content. Confirm the new deployment before reporting recovery.

References: [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
