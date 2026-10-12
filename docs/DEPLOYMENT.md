# GitHub Pages deployment

Target: [Villa Bagara](https://lomuss33.github.io/VillaBagara/). Source: `main`. Published artifact: `dist/`.

## First publication with the new workflow

1. Review the local changes and run the checks below.
2. Open [repository Pages settings](https://github.com/Lomuss33/VillaBagara/settings/pages). Under **Build and deployment**, change **Source** from the current `gh-pages` branch to **GitHub Actions**.
3. Commit and push the prepared changes to `main`. A push to `main` publishes automatically; pull requests only run checks. Alternatively, run **Check and deploy Villa Bagara** manually from the Actions tab after the workflow reaches `main`.
4. Wait for both `build` and `deploy` to succeed. Confirm the deployment URL in the `github-pages` environment.
5. Verify the live homepage, gallery/modal, contact section, and a refresh at `/#gallery` under the repository URL. Check mobile navigation and each configured language.

The workflow uses Node 24, `npm ci`, `npm run check`, and an audit gate for high/critical advisories. Checks cover docs/word budgets, content, emitted assets, metadata, and payload limits. Only the deploy job receives Pages/OIDC write permissions. No personal access token is required.

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

On Bash, prefix each command with `VITE_BASE_PATH=/VillaBagara/` instead. Hash routing needs no server rewrite or custom `404.html`.

## Configuration and external services

- `vite.config.js` derives `/VillaBagara/` from `GITHUB_REPOSITORY` in Actions; local development defaults to `/`. `VITE_BASE_PATH` overrides this when needed. Leave the repository variable unset for this deployment.
- A future custom domain or repository rename requires updating the canonical, Open Graph, Twitter, and structured-data URLs in `index.html`. A custom domain uses base `/`.
- EmailJS credentials in `public/data/sections/contact.json` are browser configuration. Confirm the service/template and any origin restrictions for the Pages URL, then verify delivery with the owner's chosen test address. Keep private keys and server credentials out of public files and `VITE_*` variables.
- EmailJS, Google Fonts, and embedded YouTube content depend on external services. Pages does not run a backend.

## Rollback

Revert the release commit on `main` and push the revert. The same workflow rebuilds and publishes the prior content. Confirm the new deployment before reporting recovery.

References: [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
