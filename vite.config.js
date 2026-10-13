import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {generateIcons} from './scripts/generate-icons.mjs'
import {renderStaticPage, buildStaticPages, staticDataVersion} from './scripts/static-site.mjs'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const isUserPagesRepository = repositoryName.toLowerCase().endsWith('.github.io')
const base = process.env.VITE_BASE_PATH
    || (process.env.GITHUB_ACTIONS === 'true' && repositoryName
        ? (isUserPagesRepository ? '/' : `/${repositoryName}/`)
        : '/')

// https://vitejs.dev/config/
export default defineConfig({
    base,
    define: {'import.meta.env.VITE_SITE_DATA_VERSION': JSON.stringify(staticDataVersion())},
    plugins: [react(), {name: 'villa-icons', buildStart() { generateIcons() }}, {
        name: 'villa-static-pages',
        apply: 'build',
        transformIndexHtml: {order: 'pre', handler(html) { return renderStaticPage(html, 'home', 'en', base) }},
        closeBundle() { buildStaticPages('dist', base) },
    }],
    server: {
        port: 5000,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Split the swiper plugin library into a separate chunk to avoid a large chunk size on index.js
                        if (id.includes('swiper'))
                            return 'swiper';
                        return;
                    }
                }
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"],
            },
        },
    },
})
