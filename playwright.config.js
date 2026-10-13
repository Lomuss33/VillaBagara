import {defineConfig} from '@playwright/test'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS === 'true' && repository ? `/${repository}/` : '/')
export default defineConfig({
    testDir: './scripts/browser',
    timeout: 30000,
    workers: 2,
    retries: process.env.CI ? 1 : 0,
    reporter: [['list'], ['html', {open: 'never'}]],
    use: {baseURL: `http://127.0.0.1:4185${base}`, trace: 'retain-on-failure', screenshot: 'only-on-failure', reducedMotion: 'reduce'},
    projects: [
        {name: 'desktop', use: {viewport: {width: 1280, height: 900}}},
        {name: 'phone', use: {viewport: {width: 390, height: 844}}},
    ],
    webServer: {
        command: 'npm run preview -- --host 127.0.0.1 --port 4185 --strictPort',
        url: `http://127.0.0.1:4185${base}`,
        env: {VITE_BASE_PATH: base},
        reuseExistingServer: false,
    },
})
