const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' && repository ? `/${repository}/` : '/')
module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4186 --strictPort',
            url: [`http://127.0.0.1:4186${base}`, `http://127.0.0.1:4186${base}contact/`],
            numberOfRuns: 3,
            settings: {chromeFlags: '--no-sandbox --disable-dev-shm-usage'},
        },
        assert: {
            assertions: {
                'categories:accessibility': ['error', {minScore: 0.95}],
                'categories:seo': ['error', {minScore: 0.9}],
                'categories:performance': ['warn', {minScore: 0.8}],
                'largest-contentful-paint': ['warn', {maxNumericValue: 3500}],
                'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
                'resource-summary:font:count': ['error', {maxNumericValue: 3}],
            },
        },
        upload: {target: 'filesystem', outputDir: './lighthouse-report'},
    },
}
